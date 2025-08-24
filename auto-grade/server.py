# server.py
import os
import re
import json
from io import BytesIO
from typing import Optional, List, Tuple, Dict

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Poe SDK
import fastapi_poe as fp

load_dotenv()

app = FastAPI(title="File Grader API")

# ----------------------------- OCR utils -----------------------------
def _safe_imports_for_cv() -> Tuple[bool, dict]:
    """Attempt to import heavy deps; return (ok, env)"""
    env = {}
    try:
        import numpy as np  # type: ignore
        import cv2  # type: ignore
        from PIL import Image, ImageEnhance, ImageOps  # type: ignore
        import pytesseract  # type: ignore
        env.update(dict(np=np, cv2=cv2, Image=Image, ImageEnhance=ImageEnhance, ImageOps=ImageOps, pytesseract=pytesseract))
        return True, env
    except Exception:
        # Fall back to a light OCR path later
        try:
            from PIL import Image, ImageOps  # type: ignore
            import pytesseract  # type: ignore
            env.update(dict(Image=Image, ImageOps=ImageOps, pytesseract=pytesseract))
            return False, env
        except Exception as e:
            raise HTTPException(
                500,
                "OCR requires at least Pillow + pytesseract and the Tesseract binary. "
                "Install: pip install pillow pytesseract; system: tesseract-ocr.",
            ) from e


def _ocr_image_bytes(data: bytes) -> Tuple[str, Dict]:
    """
    Robust OCR for images (PNG/JPG/JPEG). Tries multiple preprocessing strategies and Tesseract configs.
    Returns (text, meta).
    """
    used_cv, env = _safe_imports_for_cv()
    Image = env["Image"]
    ImageOps = env["ImageOps"]
    pytesseract = env["pytesseract"]

    meta = {"ocr_engine": "tesseract", "used_opencv": used_cv, "passes": []}

    # First, quick pass (fast, low-latency)
    with Image.open(BytesIO(data)) as im:
        base = ImageOps.exif_transpose(im).convert("L")
    confs = [
        "--oem 3 --psm 6 -l eng",
        "--oem 3 --psm 3 -l eng",
        "--oem 1 --psm 6 -l eng",
        "--oem 3 --psm 1 -l eng",
    ]
    best_txt = ""
    for c in confs:
        t = pytesseract.image_to_string(base, config=c)
        meta["passes"].append({"config": c, "chars": len(t.strip())})
        if len(t) > len(best_txt):
            best_txt = t

    # If that already looks good, stop early
    if len(best_txt.strip()) >= 100:
        return best_txt, meta

    # Heavier pass with OpenCV (if available)
    if used_cv:
        np = env["np"]
        cv2 = env["cv2"]
        ImageEnhance = env["ImageEnhance"]

        with Image.open(BytesIO(data)) as im:
            rgb = ImageOps.exif_transpose(im).convert("RGB")
        np_img = np.array(rgb)
        gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)

        # Try multiple preprocess variants
        variants = []

        # 1) Adaptive threshold
        v1 = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 31, 5)
        variants.append(v1)

        # 2) Otsu
        _, v2 = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        variants.append(v2)

        # 3) Denoised
        v3 = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
        variants.append(v3)

        # 4) Morph close (fill gaps)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        v4 = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)
        variants.append(v4)

        # 5) Contrast + Sharpness (PIL)
        pil_g = ImageOps.grayscale(rgb)
        pil_g = ImageEnhance.Contrast(pil_g).enhance(2.0)
        pil_g = ImageEnhance.Sharpness(pil_g).enhance(2.0)
        variants.append(np.array(pil_g))

        # OCR each variant with several configs
        for arr in variants:
            pil_img = Image.fromarray(arr)
            for c in confs + ["--oem 3 --psm 6 -l eng -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_/().,:%;!?\"' \n"]:
                t = pytesseract.image_to_string(pil_img, config=c)
                meta["passes"].append({"config": f"cv:{c}", "chars": len(t.strip())})
                if len(t) > len(best_txt):
                    best_txt = t

    return best_txt, meta


def _read_pdf_bytes(data: bytes) -> Tuple[str, Dict]:
    """
    Extract text from a PDF (PyPDF2). If empty (scanned), OCR each page via pdf2image + _ocr_image_bytes().
    """
    meta = {"pdf_extracted_chars": 0, "ocr_pages": 0, "ocr_meta": []}
    text = []
    try:
        import PyPDF2  # type: ignore
        reader = PyPDF2.PdfReader(BytesIO(data))
        for p in reader.pages:
            text.append(p.extract_text() or "")
    except Exception as e:
        raise HTTPException(400, f"Failed to read PDF: {e}") from e

    joined = "\n".join(text).strip()
    meta["pdf_extracted_chars"] = len(joined)
    if joined:
        return joined, meta

    # OCR fallback
    try:
        from pdf2image import convert_from_bytes  # type: ignore
        pages = convert_from_bytes(data, dpi=350)
    except Exception as e:
        # No poppler or pdf2image not installed
        meta["ocr_error"] = f"pdf2image-unavailable: {e}"
        return "", meta

    ocr_text = []
    for pg in pages:
        buf = BytesIO()
        pg.save(buf, format="PNG")
        t, meta_page = _ocr_image_bytes(buf.getvalue())
        ocr_text.append(t)
        meta["ocr_pages"] += 1
        meta["ocr_meta"].append(meta_page)

    return "\n".join(ocr_text).strip(), meta


def _read_docx_bytes(data: bytes) -> str:
    try:
        from docx import Document  # type: ignore
        doc = Document(BytesIO(data))
        return "\n".join(p.text for p in doc.paragraphs)
    except Exception as e:
        raise HTTPException(400, f"Failed to read DOCX: {e}") from e


def read_text_from_upload(f: UploadFile) -> Tuple[str, Dict]:
    """
    Reads text from an uploaded file. Supports .txt/.md, .pdf, .docx, .png/.jpg/.jpeg.
    Returns (text, meta).
    """
    name = (f.filename or "").lower()
    ext = name.rsplit(".", 1)[-1] if "." in name else ""
    data = f.file.read()

    if ext in {"txt", "md", ""}:
        txt = data.decode("utf-8", errors="ignore")
        return txt, {"source": "txt", "chars": len(txt)}

    if ext == "pdf":
        txt, meta = _read_pdf_bytes(data)
        meta.update({"source": "pdf"})
        return txt, meta

    if ext == "docx":
        txt = _read_docx_bytes(data)
        return txt, {"source": "docx", "chars": len(txt)}

    if ext in {"png", "jpg", "jpeg"}:
        txt, meta = _ocr_image_bytes(data)
        meta.update({"source": "image"})
        return txt, meta

    raise HTTPException(400, f"Unsupported file type: .{ext}")

# ----------------------------- LLM helpers -----------------------------
def truncate(s: str, limit: int = 15000) -> str:
    if not s:
        return ""
    if len(s) <= limit:
        return s
    head = s[: limit // 2]
    tail = s[-limit // 2 :]
    return head + "\n...\n" + tail


def build_msgs(question: str, answer_key: str, student: str) -> List[fp.ProtocolMessage]:
    system = (
        "You are a strict grader. Compare the student's answers to the answer key. "
        "Return ONLY valid JSON (no prose, no code fences). Use this schema:\n"
        "{\n"
        '  "score": number,               // 0-100\n'
        '  "grading_breakdown": [         // list of items\n'
        '    {"criterion": string, "max_points": number, "points_awarded": number, "comment": string}\n'
        "  ],\n"
        '  "strengths": [string],\n'
        '  "improvements": [string],\n'
        '  "overall_comment": string\n'
        "}\n"
        "If student content is blank or unreadable, set score=0 and explain."
    )
    user = (
        f"QUESTION_SHEET:\n{question}\n\n"
        f"ANSWER_KEY:\n{answer_key}\n\n"
        f"STUDENT_ANSWER_SHEET:\n{student}\n"
        "Grade now. Respond with JSON only."
    )
    return [
        fp.ProtocolMessage(role="system", content=system),
        fp.ProtocolMessage(role="user", content=user),
    ]


def call_poe_sync(messages: List[fp.ProtocolMessage], bot_name: str, poe_api_key: str) -> str:
    out = ""
    for part in fp.get_bot_response_sync(messages=messages, bot_name=bot_name, api_key=poe_api_key):
        out += getattr(part, "text", "") or getattr(part, "content", "") or ""
    return out.strip()


def extract_json(raw_text: str) -> Optional[dict]:
    t = raw_text.strip()
    fence = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", t, flags=re.DOTALL | re.IGNORECASE)
    if fence:
        try:
            return json.loads(fence.group(1))
        except Exception:
            pass
    first = t.find("{")
    last = t.rfind("}")
    if first != -1 and last != -1 and last > first:
        cand = t[first : last + 1]
        try:
            return json.loads(cand)
        except Exception:
            pass
    try:
        return json.loads(t)
    except Exception:
        return None


def repair_json_with_llm(bad_text: str, schema_hint: str, bot: str, poe_key: str) -> Optional[dict]:
    """Ask the model to repair to strict JSON."""
    sys = (
        "You repair outputs into STRICT JSON only. No code fences, no commentary. "
        "If data is missing, infer sensible defaults. Schema:\n" + schema_hint
    )
    usr = f"REPAIR THIS TO STRICT JSON ONLY:\n{bad_text}"
    msgs = [fp.ProtocolMessage(role="system", content=sys),
            fp.ProtocolMessage(role="user", content=usr)]
    fixed = call_poe_sync(msgs, bot, poe_key)
    return extract_json(fixed)

# ----------------------------- scoring utils -----------------------------
def _to_float(x) -> float:
    try:
        return float(x)
    except Exception:
        return 0.0


def reconcile_score(report: dict) -> dict:
    bd = report.get("grading_breakdown")
    if not isinstance(bd, list) or not bd:
        report.setdefault("score", 0)
        return report
    total_max = 0.0
    total_awarded = 0.0
    norm = []
    for item in bd:
        maxp = max(0.0, _to_float(item.get("max_points")))
        pts = _to_float(item.get("points_awarded"))
        pts = min(max(0.0, pts), maxp)
        total_max += maxp
        total_awarded += pts
        norm.append({**item, "max_points": maxp, "points_awarded": pts})
    if total_max > 0:
        report["grading_breakdown"] = norm
        report["score"] = round((total_awarded / total_max) * 100, 2)
        report["totals"] = {"points_awarded": total_awarded, "max_points": total_max}
    else:
        report["score"] = 0
        report["totals"] = {"points_awarded": 0.0, "max_points": 0.0}
    return report


def _split_criteria(answer_key: str) -> List[str]:
    """
    Try to split the answer key into per-question criteria using common patterns.
    """
    lines = [ln.strip() for ln in answer_key.splitlines() if ln.strip()]
    if not lines:
        return []
    # Heuristics: numbered/bulleted or Qx:
    blocks: List[str] = []
    buf: List[str] = []
    pattern = re.compile(r"^(?:Q?\d+[\).:]\s+|[a-zA-Z]\)|- |\* )")
    for ln in lines:
        if pattern.match(ln) and buf:
            blocks.append(" ".join(buf).strip())
            buf = [ln]
        else:
            buf.append(ln)
    if buf:
        blocks.append(" ".join(buf).strip())
    # If we failed to find blocks, treat whole key as one criterion
    if len(blocks) <= 1:
        return [" ".join(lines)]
    return blocks


def _normalize(s: str) -> str:
    s = s.lower()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[^a-z0-9%()\-_,.:;!?/\'\" ]+", "", s)  # keep common symbols
    return s.strip()


def rule_based_grade(answer_key: str, student: str) -> dict:
    """
    Deterministic fallback grader using difflib similarity per criterion.
    """
    from difflib import SequenceMatcher

    criteria = _split_criteria(answer_key)
    if not criteria:
        # No structure; compare whole text
        criteria = [answer_key]

    max_per = round(100.0 / len(criteria), 2)
    breakdown = []
    strengths, improvements = [], []

    stud_norm = _normalize(student)

    for c in criteria:
        exp_norm = _normalize(c)
        ratio = SequenceMatcher(None, exp_norm, stud_norm).ratio()  # 0..1
        pts = round(max_per * ratio, 2)

        if ratio >= 0.85:
            strengths.append(f"Matched well: {c[:80]}{'...' if len(c) > 80 else ''}")
            comment = "High similarity."
        elif ratio >= 0.6:
            improvements.append(f"Partially matched: {c[:80]}{'...' if len(c) > 80 else ''}")
            comment = "Partial similarity."
        else:
            improvements.append(f"Missing/weak: {c[:80]}{'...' if len(c) > 80 else ''}")
            comment = "Low similarity."

        breakdown.append({
            "criterion": c[:120],
            "max_points": max_per,
            "points_awarded": pts,
            "comment": comment,
        })

    report = {
        "score": 0,  # reconciled below
        "grading_breakdown": breakdown,
        "strengths": strengths[:5],
        "improvements": improvements[:5],
        "overall_comment": "Rule-based similarity grading fallback.",
        "meta": {"fallback": "rule_based", "n_criteria": len(criteria)}
    }
    return reconcile_score(report)

# ----------------------------- routes -----------------------------
@app.get("/health")
def health():
    return {"ok": True}


@app.post("/grade")
def grade(
    question_file: UploadFile = File(..., description="Question sheet (.txt/.md/.pdf/.docx)"),
    answer_key_file: UploadFile = File(..., description="Answer key (.txt/.md/.pdf/.docx)"),
    student_file: UploadFile = File(..., description="Student answer (.txt/.md/.pdf/.docx/.png/.jpg/.jpeg)"),
    bot_name: Optional[str] = Form(None, description="Poe bot name, e.g., GPT-4o, Claude-3.5-Sonnet"),
):
    poe_key = os.getenv("POE_API_KEY")
    if not poe_key:
        raise HTTPException(500, "POE_API_KEY not set in environment")

    bot = bot_name or os.getenv("BOT_NAME") or "GPT-4o"

    # Read inputs
    q_text, q_meta = read_text_from_upload(question_file)
    k_text, k_meta = read_text_from_upload(answer_key_file)
    s_text, s_meta = read_text_from_upload(student_file)

    # Second-chance OCR if student text looks empty/too short
    if s_meta.get("source") in {"image", "pdf"} and len(s_text.strip()) < 30:
        s_text2, s_meta2 = _ocr_image_bytes(student_file.file.read() or b"")
        if len(s_text2.strip()) > len(s_text.strip()):
            s_text, s_meta = s_text2, {**s_meta, "retry_used": True, "retry_meta": s_meta2}

    # Truncate for prompt safety
    q = truncate(q_text)
    k = truncate(k_text)
    s = truncate(s_text)

    # If student text is still empty, avoid auto-0: use rule-based fallback anyway (will likely be low but not always 0)
    # Try LLM first
    msgs = build_msgs(q, k, s)
    raw = call_poe_sync(msgs, bot, poe_key)
    parsed = extract_json(raw)

    if not parsed:
        # Try to repair to JSON
        schema_hint = (
            '{ "score": number, "grading_breakdown": ['
            '{"criterion": string, "max_points": number, "points_awarded": number, "comment": string}],'
            '"strengths": [string], "improvements": [string], "overall_comment": string }'
        )
        repaired = repair_json_with_llm(raw, schema_hint, bot, poe_key)
        parsed = repaired

    if not parsed:
        # Deterministic fallback
        parsed = rule_based_grade(k, s)

    parsed = reconcile_score(parsed)

    # Helpful meta breadcrumbs
    parsed.setdefault("meta", {})
    parsed["meta"].update({
        "inputs": {
            "question_chars": len(q_text),
            "answer_key_chars": len(k_text),
            "student_chars": len(s_text),
        },
        "sources": {"question": q_meta, "answer_key": k_meta, "student": s_meta},
        "llm_raw_sample": raw[:300] if isinstance(raw, str) else "",
    })

    return JSONResponse(parsed, status_code=200)

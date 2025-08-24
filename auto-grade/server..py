# server.py
import os, json
from io import BytesIO
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import fastapi_poe as fp

app = FastAPI(title="File Grader API")

def read_text_from_upload(f: UploadFile) -> str:
    name = (f.filename or "").lower()
    data = f.file.read()  # sync read is fine
    ext = name.rsplit(".", 1)[-1] if "." in name else ""

    if ext in ["txt", "md", ""]:
        return data.decode("utf-8", errors="ignore")
    if ext == "pdf":
        import PyPDF2
        reader = PyPDF2.PdfReader(BytesIO(data))
        return "\n".join((p.extract_text() or "") for p in reader.pages)
    if ext == "docx":
        from docx import Document
        doc = Document(BytesIO(data))
        return "\n".join(p.text for p in doc.paragraphs)
    raise HTTPException(400, f"Unsupported file type: .{ext}")

def truncate(text: str, max_chars=12000) -> str:
    return text[:max_chars]

def build_msgs(q, k, s):
    system = (
        "You are an exam grading assistant. Grade STRICTLY using the answer key. "
        "Return ONLY valid JSON with keys: score (0-100), grading_breakdown (list of {criterion, points_awarded, points_max, reason}), "
        "strengths (list), improvements (list), overall_comment (string). No extra text."
    )
    user = f"QUESTION:\n{q}\n\nANSWER_KEY:\n{k}\n\nSTUDENT_ANSWER:\n{s}"
    return [
        fp.ProtocolMessage(role="system", content=system),
        fp.ProtocolMessage(role="user", content=user),
    ]

def call_poe_sync(messages, bot_name: str, poe_api_key: str) -> str:
    out = ""
    for part in fp.get_bot_response_sync(messages=messages, bot_name=bot_name, api_key=poe_api_key):
        out += getattr(part, "text", "") or getattr(part, "content", "") or ""
    return out.strip()

def extract_json(text: str) -> Optional[dict]:
    t = text.strip()
    if t.startswith("```"):
        t = t.strip("`").split("\n", 1)[-1].strip()
    try:
        i, j = t.index("{"), t.rindex("}")
        return json.loads(t[i:j+1])
    except Exception:
        return None

@app.post("/grade")
def grade(  # <── sync route, not async
    question_file: UploadFile = File(...),
    answer_key_file: UploadFile = File(...),
    student_file: UploadFile = File(...),
    bot: str = Form("gpt-4.1"),
):
    poe_key = os.getenv("POE_API_KEY")
    if not poe_key:
        raise HTTPException(500, "POE_API_KEY not set")

    q = truncate(read_text_from_upload(question_file))
    k = truncate(read_text_from_upload(answer_key_file))
    s = truncate(read_text_from_upload(student_file))

    msgs = build_msgs(q, k, s)
    raw = call_poe_sync(msgs, bot, poe_key)
    parsed = extract_json(raw) or {
        "score": None, "grading_breakdown": [], "strengths": [], "improvements": [],
        "overall_comment": "Model did not return valid JSON. See raw_response.", "raw_response": raw,
    }
    return JSONResponse(parsed)

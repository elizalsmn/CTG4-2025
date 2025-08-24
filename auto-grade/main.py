import os
import json
import argparse
from pathlib import Path
from typing import Optional

# Poe
import fastapi_poe as fp

# --------- readers: txt/pdf/docx ----------
def read_text_from_file(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in [".txt", ".md"]:
        return path.read_text(encoding="utf-8", errors="ignore")

    if ext == ".pdf":
        # pip install PyPDF2
        import PyPDF2
        text = []
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text.append(page.extract_text() or "")
        return "\n".join(text)

    if ext == ".docx":
        # pip install python-docx
        from docx import Document
        doc = Document(str(path))
        return "\n".join(p.text for p in doc.paragraphs)

    raise ValueError(f"Unsupported file type: {ext}. Use .txt, .pdf, or .docx")

def truncate_for_model(text: str, max_chars: int = 12000) -> str:
    return text[:max_chars]

def build_grading_messages(question: str, answer_key: str, student_answer: str):
    system_prompt = (
        "You are an exam grading assistant. Grade the student's answer STRICTLY "
        "against the provided question and answer key. Return ONLY a single valid JSON object:\n"
        "{\n"
        '  "score": <integer 0-100>,\n'
        '  "grading_breakdown": [\n'
        '    {"criterion": "<name>", "points_awarded": <int>, "points_max": <int>, "reason": "<short reason>"}\n'
        "  ],\n"
        '  "strengths": ["<bullet>", "..."],\n'
        '  "improvements": ["<bullet>", "..."],\n'
        '  "overall_comment": "<2-4 sentences summary>"\n'
        "}\n"
        "Rules: no extra text, no code fences, concise reasons, answer key is source of truth."
    )
    user_payload = (
        "QUESTION:\n" + question + "\n\n"
        "ANSWER_KEY:\n" + answer_key + "\n\n"
        "STUDENT_ANSWER:\n" + student_answer
    )
    return [
        fp.ProtocolMessage(role="system", content=system_prompt),
        fp.ProtocolMessage(role="user", content=user_payload),
    ]

def call_poe(messages, bot_name: str, poe_api_key: str) -> str:
    out = ""
    for partial in fp.get_bot_response_sync(
        messages=messages,
        bot_name=bot_name,
        api_key=poe_api_key,
    ):
        if hasattr(partial, "text") and partial.text:
            out += partial.text
        elif hasattr(partial, "content") and partial.content:
            out += partial.content
    return out.strip()

def extract_json_object(text: str) -> Optional[dict]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.split("\n", 1)[-1].strip()
    try:
        start = cleaned.index("{")
        end = cleaned.rindex("}")
        return json.loads(cleaned[start:end+1])
    except Exception:
        return None

def grade_files(question_path: Path, answer_key_path: Path, student_path: Path, bot_name: str) -> dict:
    poe_api_key = os.getenv("POE_API_KEY", "")
    if not poe_api_key:
        raise RuntimeError("Missing POE_API_KEY env var.")

    question = truncate_for_model(read_text_from_file(question_path))
    answer_key = truncate_for_model(read_text_from_file(answer_key_path))
    student_answer = truncate_for_model(read_text_from_file(student_path))

    messages = build_grading_messages(question, answer_key, student_answer)
    raw_response = call_poe(messages, bot_name=bot_name, poe_api_key=poe_api_key)

    parsed = extract_json_object(raw_response)
    if not parsed:
        parsed = {
            "score": None,
            "grading_breakdown": [],
            "strengths": [],
            "improvements": [],
            "overall_comment": "Model did not return valid JSON. See raw_response.",
            "raw_response": raw_response,
        }
    return parsed

def save_report(report: dict, output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Grade student's answer using Poe (question + answer key).")
    parser.add_argument("--question", required=True)
    parser.add_argument("--answer-key", required=True)
    parser.add_argument("--student", required=True)
    parser.add_argument("--bot", default="gpt-4.1")
    parser.add_argument("--out", default="score_report.json")
    args = parser.parse_args()

    report = grade_files(
        question_path=Path(args.question),
        answer_key_path=Path(args.answer_key),
        student_path=Path(args.student),
        bot_name=args.bot,
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    save_report(report, Path(args.out))

if __name__ == "__main__":
    main()

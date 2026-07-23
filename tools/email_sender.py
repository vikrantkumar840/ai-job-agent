import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_APP_PASSWORD = os.getenv("SMTP_APP_PASSWORD", "")
NOTIFY_TO_EMAIL = os.getenv("NOTIFY_TO_EMAIL", "")


def send_email(subject: str, body: str, to_email: str = None) -> bool:
    to_email = to_email or NOTIFY_TO_EMAIL

    if not (SMTP_EMAIL and SMTP_APP_PASSWORD and to_email):
        print("Email not sent: SMTP_EMAIL / SMTP_APP_PASSWORD / NOTIFY_TO_EMAIL not fully configured.")
        return False

    msg = MIMEMultipart()
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_APP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False


def send_application_summary(results: list[dict], to_email: str = None) -> bool:
    applied = [r for r in results if r["status"] == "applied"]
    filled_pending = [r for r in results if r["status"] == "filled_pending_submit"]
    needs_review = [r for r in results if r["status"] == "needs_manual_review"]
    failed = [r for r in results if r["status"] == "failed"]

    lines = [
        "AI Job Agent — Application Run Summary",
        "=" * 50,
        f"Total jobs attempted : {len(results)}",
        f"Fully applied        : {len(applied)}",
        f"Filled, awaiting your submit : {len(filled_pending)}",
        f"Needs manual review (bot-check) : {len(needs_review)}",
        f"Failed               : {len(failed)}",
        "",
    ]

    def section(title, items):
        out = [f"--- {title} ---"]
        for r in items:
            out.append(f"- {r.get('job_url')}")
            if r.get("reason"):
                out.append(f"  reason: {r['reason']}")
            if r.get("screenshot"):
                out.append(f"  screenshot: {r['screenshot']}")
        out.append("")
        return out

    if applied:
        lines += section("Applied", applied)
    if filled_pending:
        lines += section("Filled — go click submit yourself", filled_pending)
    if needs_review:
        lines += section("Needs manual review (bot-check found)", needs_review)
    if failed:
        lines += section("Failed", failed)

    body = "\n".join(lines)
    return send_email("AI Job Agent — Application Run Summary", body, to_email)

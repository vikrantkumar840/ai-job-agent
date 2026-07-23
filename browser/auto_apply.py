import os
import uuid
from browser.playwright_client import get_browser

SCREENSHOT_DIR = "logs/apply_screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

BLOCKED_DOMAINS = ["linkedin.com", "indeed.com"]

BOT_CHECK_SIGNALS = [
    "iframe[src*='recaptcha']",
    "iframe[title*='recaptcha']",
    "div.g-recaptcha",
    "iframe[src*='hcaptcha']",
    "div.h-captcha",
    "iframe[src*='challenges.cloudflare.com']",
    "#challenge-running",
]

BOT_CHECK_TEXT_SIGNALS = [
    "verify you are human",
    "i'm not a robot",
    "checking your browser",
    "unusual traffic",
    "security check",
]

FIELD_SELECTORS = {
    "full_name": [
        "input[name*='name' i]",
        "input[id*='name' i]",
        "input[placeholder*='full name' i]",
    ],
    "email": [
        "input[type='email']",
        "input[name*='email' i]",
    ],
    "phone": [
        "input[type='tel']",
        "input[name*='phone' i]",
    ],
    "location": [
        "input[name*='location' i]",
        "input[placeholder*='location' i]",
        "input[placeholder*='city' i]",
    ],
    "linkedin_url": [
        "input[name*='linkedin' i]",
        "input[placeholder*='linkedin' i]",
    ],
    "resume_file": [
        "input[type='file'][name*='resume' i]",
        "input[type='file']",
    ],
}

SUBMIT_TEXT_PATTERNS = ["submit", "apply", "send application", "send"]


def is_blocked_domain(url: str) -> bool:
    url_lower = url.lower()
    return any(domain in url_lower for domain in BLOCKED_DOMAINS)


def detect_ats_type(url: str) -> str:
    url_lower = url.lower()
    if "greenhouse.io" in url_lower:
        return "greenhouse"
    if "lever.co" in url_lower:
        return "lever"
    if "myworkdayjobs.com" in url_lower or "workday" in url_lower:
        return "workday"
    if "smartrecruiters.com" in url_lower:
        return "smartrecruiters"
    return "generic"


def detect_bot_check(page) -> bool:
    for selector in BOT_CHECK_SIGNALS:
        if page.query_selector(selector):
            return True
    try:
        body_text = page.inner_text("body").lower()
    except Exception:
        body_text = ""
    return any(signal in body_text for signal in BOT_CHECK_TEXT_SIGNALS)


def fill_first_matching(page, selectors: list[str], value: str) -> bool:
    if not value:
        return False
    for selector in selectors:
        el = page.query_selector(selector)
        if el:
            try:
                el.fill(value)
                return True
            except Exception:
                continue
    return False


def upload_first_matching(page, selectors: list[str], file_path: str) -> bool:
    for selector in selectors:
        el = page.query_selector(selector)
        if el:
            try:
                el.set_input_files(file_path)
                return True
            except Exception:
                continue
    return False


def click_submit(page) -> bool:
    buttons = page.query_selector_all("button, input[type='submit']")
    for btn in buttons:
        try:
            text = (btn.inner_text() or "").strip().lower()
        except Exception:
            text = ""
        if any(pattern in text for pattern in SUBMIT_TEXT_PATTERNS):
            try:
                btn.click()
                return True
            except Exception:
                continue
    return False


def _fill_form(page, applicant: dict, resume_file_path: str) -> dict:
    field_mapping = {}

    if fill_first_matching(page, FIELD_SELECTORS["full_name"], applicant.get("full_name", "")):
        field_mapping["full_name"] = applicant.get("full_name", "")

    if fill_first_matching(page, FIELD_SELECTORS["email"], applicant.get("email", "")):
        field_mapping["email"] = applicant.get("email", "")

    if fill_first_matching(page, FIELD_SELECTORS["phone"], applicant.get("phone", "")):
        field_mapping["phone"] = applicant.get("phone", "")

    if fill_first_matching(page, FIELD_SELECTORS["location"], applicant.get("location", "")):
        field_mapping["location"] = applicant.get("location", "")

    if fill_first_matching(page, FIELD_SELECTORS["linkedin_url"], applicant.get("linkedin_url", "")):
        field_mapping["linkedin_url"] = applicant.get("linkedin_url", "")

    if resume_file_path and os.path.exists(resume_file_path):
        if upload_first_matching(page, FIELD_SELECTORS["resume_file"], resume_file_path):
            field_mapping["resume"] = os.path.basename(resume_file_path)

    return field_mapping


def preview_fill(job_url: str, applicant: dict) -> dict:
    result = {
        "status": "failed",
        "ats_type": detect_ats_type(job_url),
        "field_mapping": {},
        "warnings": None,
        "screenshot_path": None,
    }

    if is_blocked_domain(job_url):
        result.update({
            "status": "blocked_domain",
            "warnings": "LinkedIn and Indeed job pages require a logged-in session and "
                        "actively block automation — not supported here. Use the direct "
                        "company/ATS application link instead (Greenhouse, Lever, Workday, etc).",
        })
        return result

    p, browser, page = get_browser()
    resume_file_path = applicant.get("resume_path", "")

    try:
        page.goto(job_url, timeout=45000)
        page.wait_for_timeout(2000)

        if detect_bot_check(page):
            screenshot_path = f"{SCREENSHOT_DIR}/{uuid.uuid4()}.png"
            page.screenshot(path=screenshot_path)
            result.update({
                "status": "needs_manual_review",
                "warnings": "A bot-check / CAPTCHA was detected on this page. Not attempting to bypass it — apply manually.",
                "screenshot_path": screenshot_path,
            })
            return result

        field_mapping = _fill_form(page, applicant, resume_file_path)

        if detect_bot_check(page):
            screenshot_path = f"{SCREENSHOT_DIR}/{uuid.uuid4()}.png"
            page.screenshot(path=screenshot_path)
            result.update({
                "status": "needs_manual_review",
                "field_mapping": field_mapping,
                "warnings": "A bot-check appeared after filling the form. Not attempting to bypass it.",
                "screenshot_path": screenshot_path,
            })
            return result

        screenshot_path = f"{SCREENSHOT_DIR}/{uuid.uuid4()}.png"
        page.screenshot(path=screenshot_path, full_page=True)

        if not field_mapping:
            result.update({
                "status": "needs_manual_review",
                "warnings": "Could not confidently identify any form fields on this page.",
                "screenshot_path": screenshot_path,
            })
            return result

        result.update({
            "status": "previewed",
            "field_mapping": field_mapping,
            "warnings": None,
            "screenshot_path": screenshot_path,
        })
        return result

    except Exception as e:
        result["warnings"] = f"Error during automation: {str(e)}"
        return result

    finally:
        browser.close()
        p.stop()


def submit_application(job_url: str, applicant: dict) -> dict:
    result = {"status": "failed", "warnings": None}

    if is_blocked_domain(job_url):
        result.update({"status": "blocked_domain", "warnings": "LinkedIn/Indeed not supported."})
        return result

    p, browser, page = get_browser()
    resume_file_path = applicant.get("resume_path", "")

    try:
        page.goto(job_url, timeout=45000)
        page.wait_for_timeout(2000)

        if detect_bot_check(page):
            result.update({
                "status": "needs_manual_review",
                "warnings": "Bot-check present at submit time. Not submitting automatically.",
            })
            return result

        _fill_form(page, applicant, resume_file_path)

        if detect_bot_check(page):
            result.update({
                "status": "needs_manual_review",
                "warnings": "Bot-check appeared after filling. Not submitting automatically.",
            })
            return result

        clicked = click_submit(page)
        page.wait_for_timeout(2000)

        if not clicked:
            result.update({
                "status": "needs_manual_review",
                "warnings": "Could not find a submit button. Form was filled but not sent.",
            })
            return result

        result.update({"status": "submitted", "warnings": None})
        return result

    except Exception as e:
        result["warnings"] = f"Error during submit: {str(e)}"
        return result

    finally:
        browser.close()
        p.stop()


def attempt_application(job_url: str, applicant: dict, resume_file_path: str, cover_letter_text: str = "") -> dict:
    """
    Backward-compatible wrapper for the older batch auto-apply flow
    (agents/auto_apply_agent.py -> api/routes/apply.py -> POST /apply/auto).
    Delegates to preview_fill and translates the result shape it used to return.
    Never auto-submits, same as its original behavior.
    """
    applicant_with_resume = {**applicant, "resume_path": resume_file_path}
    result = preview_fill(job_url, applicant_with_resume)

    status_map = {
        "previewed": "filled_pending_submit",
        "blocked_domain": "needs_manual_review",
        "needs_manual_review": "needs_manual_review",
        "failed": "failed",
    }

    return {
        "job_url": job_url,
        "status": status_map.get(result["status"], "failed"),
        "reason": result.get("warnings") or "",
        "screenshot": result.get("screenshot_path"),
        "fields_filled": result.get("field_mapping", {}),
    }

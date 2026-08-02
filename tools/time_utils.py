import re
from datetime import datetime, timezone


def humanize_iso(iso_string: str) -> str:
    if not iso_string:
        return ""
    try:
        cleaned = iso_string.replace("Z", "+00:00")
        posted = datetime.fromisoformat(cleaned)
        if posted.tzinfo is None:
            posted = posted.replace(tzinfo=timezone.utc)
    except (ValueError, TypeError):
        return ""

    now = datetime.now(timezone.utc)
    seconds = (now - posted).total_seconds()

    if seconds < 60:
        return "just now"
    if seconds < 3600:
        minutes = int(seconds // 60)
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    if seconds < 86400:
        hours = int(seconds // 3600)
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    if seconds < 86400 * 30:
        days = int(seconds // 86400)
        return f"{days} day{'s' if days != 1 else ''} ago"
    months = int(seconds // (86400 * 30))
    return f"{months} month{'s' if months != 1 else ''} ago"


def age_in_hours(posted_at: str = None, posted_relative: str = None) -> float:
    if posted_at:
        try:
            cleaned = posted_at.replace("Z", "+00:00")
            posted = datetime.fromisoformat(cleaned)
            if posted.tzinfo is None:
                posted = posted.replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            return max(0.0, (now - posted).total_seconds() / 3600)
        except (ValueError, TypeError):
            pass

    if posted_relative:
        text = posted_relative.lower().strip()
        if "just now" in text or text == "today":
            return 0.0
        match = re.search(r"(\d+)\s*(minute|hour|day|week|month|year)", text)
        if match:
            amount = int(match.group(1))
            unit = match.group(2)
            multipliers = {
                "minute": 1 / 60, "hour": 1, "day": 24,
                "week": 24 * 7, "month": 24 * 30, "year": 24 * 365,
            }
            return amount * multipliers[unit]

    return float("inf")


def is_within_hours(max_hours: float, posted_at: str = None, posted_relative: str = None) -> bool:
    if max_hours is None:
        return True
    age = age_in_hours(posted_at, posted_relative)
    if age == float("inf"):
        return True
    return age <= max_hours

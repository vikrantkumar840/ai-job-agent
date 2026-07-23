from datetime import datetime, timezone


def humanize_iso(iso_string: str) -> str:
    """Converts an ISO 8601 timestamp into a relative "X ago" string."""
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

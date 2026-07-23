from urllib.parse import quote_plus
from browser.playwright_client import get_browser
from tools.time_utils import humanize_iso
import time


def search_linkedin_jobs(
    role="Software Engineer",
    location="India",
    experience=""
):
    p, browser, page = get_browser()
    keywords = quote_plus(role)
    location = quote_plus(location)
    url = (
        "https://www.linkedin.com/jobs/search/"
        f"?keywords={keywords}"
        f"&location={location}"
    )
    page.goto(url, timeout=60000)

    try:
        page.wait_for_selector("div.base-card", timeout=10000)
    except Exception:
        pass

    jobs = []
    cards = page.query_selector_all("div.base-card")

    for card in cards[:30]:
        try:
            title = card.query_selector("h3").inner_text().strip()
            company = card.query_selector("h4").inner_text().strip()
            location_text = card.query_selector(
                "span.job-search-card__location"
            ).inner_text().strip()
            link = card.query_selector("a").get_attribute("href")

            posted_relative = ""
            posted_at = None
            time_el = card.query_selector("time")
            if time_el:
                posted_relative = (time_el.inner_text() or "").strip()
                posted_at = time_el.get_attribute("datetime")
                if not posted_relative and posted_at:
                    posted_relative = humanize_iso(posted_at)

            jobs.append(
                {
                    "title": title,
                    "company": company,
                    "location": location_text,
                    "description": f"{title} at {company}",
                    "link": link,
                    "posted_at": posted_at,
                    "posted_relative": posted_relative,
                }
            )
        except Exception:
            pass

    browser.close()
    p.stop()
    return jobs

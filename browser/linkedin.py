from urllib.parse import quote_plus

from browser.playwright_client import get_browser

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

    time.sleep(6)

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

            jobs.append(
                {
                    "title": title,
                    "company": company,
                    "location": location_text,
                    "description": f"{title} at {company}",
                    "link": link,
                }
            )

        except Exception:
            pass

    browser.close()

    p.stop()

    return jobs

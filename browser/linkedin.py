from browser.playwright_client import get_browser
import time

def search_linkedin_jobs(query="devops engineer"):
    p, browser, page = get_browser()

    url = f"https://www.linkedin.com/jobs/search?keywords={query}"

    page.goto(url, timeout=60000)
    time.sleep(5)

    jobs = []
    cards = page.query_selector_all("div.base-card")

    for card in cards[:5]:
        try:
            title_el = card.query_selector("h3")
            company_el = card.query_selector("h4")
            link_el = card.query_selector("a")

            if not title_el or not company_el:
                continue

            jobs.append({
                "title": title_el.inner_text().strip(),
                "company": company_el.inner_text().strip(),
                "description": f"{title_el.inner_text()} at {company_el.inner_text()}",
                "location": "LinkedIn",
                "link": link_el.get_attribute("href") if link_el else ""
            })
        except:
            continue

    browser.close()
    p.stop()

    return jobs

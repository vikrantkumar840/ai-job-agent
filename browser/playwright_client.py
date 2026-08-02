from playwright.sync_api import sync_playwright

def get_browser():
    p = sync_playwright().start()
    # No executable_path – Playwright uses its own installed Chromium
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    return p, browser, page

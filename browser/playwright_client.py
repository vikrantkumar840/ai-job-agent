from playwright.sync_api import sync_playwright

def get_browser():
    p = sync_playwright().start()

    # USE SYSTEM CHROMIUM (IMPORTANT FIX)
    browser = p.chromium.launch(
        headless=True,
        executable_path="/usr/bin/chromium-browser"
    )

    page = browser.new_page()
    return p, browser, page

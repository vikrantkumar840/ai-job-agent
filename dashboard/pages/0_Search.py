import streamlit as st
import requests

API = "http://127.0.0.1:8000"
st.title("🚀 AI Job Search")

resume = st.file_uploader(
    "Upload Resume",
    type=["pdf", "docx"]
)

role = st.text_input(
    "Job Title",
    placeholder="DevOps Engineer"
)

city = st.text_input(
    "City",
    placeholder="Bangalore"
)

experience = st.selectbox(
    "Experience",
    [
        "Fresher",
        "1-3 Years",
        "3-5 Years",
        "5+ Years"
    ]
)

sites = st.multiselect(
    "Job Sites",
    [
        "LinkedIn",
        "Indeed",
        "RemoteOK",
        "Wellfound"
    ],
    default=["LinkedIn"]
)

search = st.button("🚀 Find Jobs")

if search:

    payload = {
        "role": role,
        "city": city,
        "experience": experience,
        "sites": sites
    }

    with st.spinner("Searching jobs..."):

        response = requests.post(
            f"{API}/jobs/",
            json=payload
        )

    if response.status_code == 200:

        jobs = response.json()

        if len(jobs) == 0:
            st.warning("No matching jobs found.")
        else:

            st.success(f"Found {len(jobs)} jobs")

            for job in jobs:

                with st.container(border=True):

                    st.subheader(job["title"])
                    st.write(f"🏢 {job['company']}")
                    st.write(f"📍 {job['location']}")

                    if "description" in job:
                        st.write(job["description"][:300])

                    if job.get("link"):
                        st.link_button("Open Job", job["link"])

    else:
        st.error(response.text)

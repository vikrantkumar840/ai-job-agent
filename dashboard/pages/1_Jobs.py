import streamlit as st
import requests

st.title("💼 Available Jobs")

API = "http://44.203.73.54:8000"

try:
    jobs = requests.get(f"{API}/jobs").json()

    for i, job in enumerate(jobs):

        with st.container(border=True):

            st.subheader(job["title"])

            st.write(f"🏢 {job['company']}")

            st.write(f"📍 {job['location']}")

            if "description" in job:
                st.write(job["description"][:250] + "...")

            c1, c2, c3 = st.columns(3)

            with c1:
                st.button(
                    "Generate Resume",
                    key=f"resume_{i}"
                )

            with c2:
                st.button(
                    "Generate Cover Letter",
                    key=f"cover_{i}"
                )

            with c3:
                if job.get("link"):
                    st.link_button(
                        "Open Job",
                        job["link"]
                    )

except Exception as e:
    st.error(str(e))

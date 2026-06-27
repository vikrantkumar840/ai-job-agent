import streamlit as st
import pandas as pd
import requests

API = "http://44.203.73.54:8000"

st.set_page_config(
    page_title="AI Job Agent",
    page_icon="🤖",
    layout="wide"
)

st.title("🤖 AI Job Agent Dashboard")
st.caption("AI-powered Resume Tailoring • ATS Analysis • Job Tracker")


# ---------- LOAD DATA FROM API ----------
try:
    response = requests.get(f"{API}/applications/", timeout=5)
    response.raise_for_status()
    df = pd.DataFrame(response.json())
except Exception:
    df = pd.DataFrame()


# ---------- METRICS ----------
c1, c2, c3, c4 = st.columns(4)

with c1:
    st.metric("Applications", len(df))

with c2:
    st.metric(
        "Average ATS",
        round(df["score"].mean(), 1) if not df.empty else 0
    )

with c3:
    st.metric(
        "Highest Score",
        int(df["score"].max()) if not df.empty else 0
    )

with c4:
    st.metric(
        "Resume Files",
        len(df) * 2
    )


st.divider()

st.subheader("Recent Applications")

if not df.empty:
    st.dataframe(df, use_container_width=True)
else:
    st.info("No applications yet.")

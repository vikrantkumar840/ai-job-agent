import streamlit as st
from utils import get_applications

st.title("📈 Analytics")

df = get_applications()

if df.empty:
    st.warning("No analytics available.")
else:

    st.metric("Applications", len(df))

    st.metric(
        "Average ATS",
        round(df.score.mean(), 1)
    )

    st.bar_chart(df["score"])

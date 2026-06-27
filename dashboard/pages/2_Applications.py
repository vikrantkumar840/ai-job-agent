import streamlit as st
from utils import get_applications

st.title("📄 Applications")

df = get_applications()

if df.empty:
    st.info("No applications found.")
else:
    st.dataframe(df, width="stretch")

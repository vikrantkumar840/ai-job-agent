import streamlit as st


def metrics(df):

    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric("📄 Applications", len(df))

    with c2:
        avg = round(df.score.mean(), 1) if len(df) else 0
        st.metric("🎯 ATS Avg", avg)

    with c3:
        best = int(df.score.max()) if len(df) else 0
        st.metric("🏆 Best Score", best)

    with c4:
        st.metric("🤖 AI Status", "Online")

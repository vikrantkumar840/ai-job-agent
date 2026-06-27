import streamlit as st


def show_job(row):

    with st.container(border=True):

        c1, c2 = st.columns([5, 1])

        with c1:
            st.subheader(row["title"])
            st.caption(row["company"])

        with c2:
            st.metric("ATS", row["score"])

        st.write("---")

        c1, c2, c3 = st.columns(3)

        with c1:
            st.button(
                "Resume",
                key=f"resume{row.name}"
            )

        with c2:
            st.button(
                "Cover Letter",
                key=f"cover{row.name}"
            )

        with c3:
            st.button(
                "Apply",
                key=f"apply{row.name}"
            )

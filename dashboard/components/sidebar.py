import streamlit as st
from streamlit_option_menu import option_menu


def sidebar():

    with st.sidebar:

        st.title("🤖 AI Job Agent")

        selected = option_menu(
            "",
            [
                "Dashboard",
                "Jobs",
                "Applications",
                "Analytics",
                "Settings"
            ],
            icons=[
                "speedometer2",
                "briefcase",
                "folder",
                "graph-up",
                "gear"
            ],
            default_index=0
        )

    return selected

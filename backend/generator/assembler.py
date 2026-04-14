"""
CraftFolio Backend — Portfolio Assembler
Orchestrates the full build pipeline: theme → templates → inject → wrap.
Supports excluded sections and user-defined section ordering.
"""
from __future__ import annotations
from pathlib import Path
from typing import Any

from .template_engine import (
    load_theme_full,
    theme_to_css_vars,
    load_section_template,
    inject_user_data,
    build_nav_links,
)

# ── Paths ────────────────────────────────────────────────────────────────────
_HERE   = Path(__file__).resolve().parent   # generator/
BACKEND = _HERE.parent                       # backend/
ROOT    = BACKEND.parent                     # repo root
LIB     = ROOT / "lib"

# Sections the user may optionally exclude (navbar + hero are always required)
OPTIONAL_SECTIONS = {"about", "skills", "projects", "certifications", "contact"}
REQUIRED_SECTIONS = {"navbar", "hero"}


def build_portfolio(customization: dict[str, Any], user_data: dict[str, Any]) -> str:
    """
    Full pipeline:
      1. Load theme → CSS :root {} block
      2. Read base.css + animations.js
      3. Build navbar (always first, non-removable)
      4. Loop sections in user-defined order, skip excluded ones
      5. Assemble wrapper.html with all slots filled
      6. Return complete HTML string
    """

    # ── 1. Load theme ────────────────────────────────────────────────────────
    theme_name = customization.get("theme", "Midnight")
    props, typo, radius, shadows = load_theme_full(theme_name)
    theme_css = theme_to_css_vars(props, typo, radius, shadows)

    # ── 2. Shared assets ─────────────────────────────────────────────────────
    base_css_path = LIB / "base" / "base.css"
    anim_js_path  = LIB / "base" / "animations.js"

    base_css      = base_css_path.read_text(encoding="utf-8") if base_css_path.exists() else ""
    animations_js = anim_js_path.read_text(encoding="utf-8")  if anim_js_path.exists()  else ""

    # ── 3. Resolve sections ──────────────────────────────────────────────────
    section_layouts   = customization.get("section_layouts", {})
    excluded_sections = set(customization.get("excluded_sections", []))

    # Only optional sections can be excluded; required ones are always kept
    excluded_sections -= REQUIRED_SECTIONS

    sections_order = customization.get("sections_order", [
        "hero", "about", "skills", "projects", "certifications", "contact"
    ])

    # Active = sections in user's chosen order, minus excluded ones
    active_sections = [s for s in sections_order if s not in excluded_sections]

    # ── 4. Navbar (always first, non-removable) ───────────────────────────────
    navbar_layout = section_layouts.get("navbar", 1)
    navbar_tpl    = load_section_template("navbar", navbar_layout)

    nav_links_html = build_nav_links(
        active_sections,
        github   = str(user_data.get("github")  or ""),
        linkedin = str(user_data.get("linkedin") or ""),
    )

    navbar_tpl  = navbar_tpl.replace("{{NAV_LINKS}}", nav_links_html)
    navbar_html = inject_user_data(navbar_tpl, user_data, "navbar")

    # ── 5. Process each section in user-defined order ─────────────────────────
    section_parts: list[str] = []

    for section in sections_order:
        # Skip excluded sections (can only exclude optional ones)
        if section in excluded_sections:
            continue

        layout_num = section_layouts.get(section, 1)

        try:
            raw_tpl = load_section_template(section, layout_num)
        except FileNotFoundError as exc:
            print(f"[assembler] WARNING: {exc}")
            continue

        filled = inject_user_data(raw_tpl, user_data, section)
        section_parts.append(filled)

    sections_body = "\n\n".join(section_parts)

    # ── 6. Wrap into final HTML ───────────────────────────────────────────────
    wrapper_path = LIB / "wrapper.html"
    wrapper      = wrapper_path.read_text(encoding="utf-8")

    portfolio_title  = f"{user_data.get('name', 'Portfolio')} — Portfolio"
    meta_description = (
        f"{user_data.get('name', '')} — {user_data.get('title', '')}. "
        f"{str(user_data.get('bio', ''))[:120]}..."
    )
    theme_id = theme_name.lower().replace(" ", "-")

    final_html = wrapper
    final_html = final_html.replace("{{PORTFOLIO_TITLE}}",  portfolio_title)
    final_html = final_html.replace("{{META_DESCRIPTION}}", meta_description)
    final_html = final_html.replace("{{ACTIVE_THEME}}",     theme_id)
    final_html = final_html.replace("{{THEME_CSS}}",        theme_css)
    final_html = final_html.replace("{{BASE_CSS}}",         base_css)
    final_html = final_html.replace("{{NAVIGATION}}",       navbar_html)
    final_html = final_html.replace("{{SECTIONS_BODY}}",    sections_body)
    final_html = final_html.replace("{{FOOTER}}",           "")
    final_html = final_html.replace("{{ANIMATIONS_JS}}",    animations_js)

    return final_html


def build_section_preview(
    section: str,
    layout_num: int,
    theme: str,
    user_data: dict[str, Any],
) -> str:
    """
    Lightweight preview build: renders a single section (+ navbar) in the
    chosen theme. Used by the /preview endpoint for the layout picker iframe.
    """
    preview_customization = {
        "theme": theme,
        "sections_order": [section],
        "excluded_sections": [],
        "section_layouts": {
            "navbar": 1,
            section:  layout_num,
        },
    }
    return build_portfolio(preview_customization, user_data)

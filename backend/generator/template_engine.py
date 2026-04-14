"""
CraftFolio Backend — Template Engine
Handles loading themes, section templates, and injecting user data.
"""
from __future__ import annotations
import json
import re
from pathlib import Path
from typing import Any

# ── Path resolution ──────────────────────────────────────────────────────────
_HERE   = Path(__file__).resolve().parent          # generator/
BACKEND = _HERE.parent                              # backend/
ROOT    = BACKEND.parent                            # repo root
LIB     = ROOT / "lib"


# ── Theme loading ────────────────────────────────────────────────────────────

def load_theme_full(theme_name: str) -> tuple[dict[str, str], dict[str, str], dict[str, str]]:
    """
    Returns (properties, typography, radius) dicts for the given theme name.
    Raises ValueError if not found.
    """
    themes_path = LIB / "themes" / "themes.json"
    with open(themes_path, encoding="utf-8") as f:
        data = json.load(f)

    themes = data.get("themes", {})

    # Case-insensitive lookup
    key = next((k for k in themes if k.lower() == theme_name.lower()), None)
    if key is None:
        available = list(themes.keys())
        raise ValueError(f"Theme '{theme_name}' not found. Available: {available}")

    theme = themes[key]
    return (
        theme.get("properties", {}),
        theme.get("typography", {}),
        theme.get("radius", {}),
        theme.get("shadows", {}),
    )


def theme_to_css_vars(
    props: dict[str, str],
    typo: dict[str, str],
    radius: dict[str, str],
    shadows: dict[str, str],
) -> str:
    """
    Converts theme dicts into a CSS :root { } block.
    Maps themes.json keys → the CSS vars used in layout files.
    """
    lines: list[str] = []

    # ── Colour properties ────────────────────────────────────────────────────
    prop_map = {
        "--color-bg":           "--bg",
        "--color-bg-2":         "--bg2",
        "--color-surface":      "--surface",
        "--color-surface-2":    "--surface-2",
        "--color-border":       "--border",
        "--color-border-2":     "--border-2",
        "--color-accent":       "--accent",
        "--color-accent-2":     "--accent-2",
        "--color-accent-3":     "--accent-3",
        "--color-text":         "--text",
        "--color-text-muted":   "--text-2",
        "--color-text-subtle":  "--text-3",
        "--color-success":      "--success",
        "--color-warning":      "--warning",
        "--color-error":        "--error",
    }
    for src, dst in prop_map.items():
        if src in props:
            lines.append(f"  {dst}: {props[src]};")

    # ── Typography ───────────────────────────────────────────────────────────
    if typo.get("font-head"):
        lines.append(f"  --font-head: '{typo['font-head']}', sans-serif;")
    if typo.get("font-body"):
        lines.append(f"  --font-body: '{typo['font-body']}', sans-serif;")
    if typo.get("font-mono"):
        lines.append(f"  --font-mono: '{typo['font-mono']}', monospace;")

    # ── Border radius ────────────────────────────────────────────────────────
    for size in ["sm", "md", "lg", "xl"]:
        if size in radius:
            lines.append(f"  --radius-{size}: {radius[size]};")

    # ── Shadows ──────────────────────────────────────────────────────────────
    for size in ["sm", "md", "lg"]:
        if size in shadows:
            lines.append(f"  --shadow-{size}: {shadows[size]};")
    if "glow" in shadows:
        lines.append(f"  --shadow-glow: {shadows['glow']};")

    return ":root {\n" + "\n".join(lines) + "\n}"


# ── Section template loading ─────────────────────────────────────────────────

def load_section_template(section_name: str, layout_num: int) -> str:
    """
    Reads and returns the raw HTML template for the given section + layout.
    Normalises "certifications" → "certificates" folder name.
    """
    folder = "certificates" if section_name == "certifications" else section_name
    path   = LIB / "sections" / folder / f"layout{layout_num}.html"

    if not path.exists():
        raise FileNotFoundError(
            f"Template not found: {path}  (section={section_name}, layout={layout_num})"
        )
    return path.read_text(encoding="utf-8")


# ── User data injection ───────────────────────────────────────────────────────

def inject_user_data(template: str, user_data: dict[str, Any], section_name: str) -> str:
    """Resolves all {{TOKEN}} placeholders in a template."""
    data = dict(user_data)

    # Pre-render loop blocks
    if section_name == "projects" and "{{PROJECTS_LOOP}}" in template:
        data["PROJECTS_LOOP"] = _render_projects(data.get("projects", []))
    if section_name == "skills" and "{{SKILLS_LOOP}}" in template:
        data["SKILLS_LOOP"] = _render_skills(data.get("skills", []))
    if section_name in ("certifications", "certificates") and "{{CERTS_LOOP}}" in template:
        data["CERTS_LOOP"] = _render_certs(data.get("certifications", []))

    replacements = {
        "NAME":          str(data.get("name", "")),
        "TITLE":         str(data.get("title", "")),
        "BIO":           str(data.get("bio", "")),
        "GITHUB":        str(data.get("github") or "#"),
        "LINKEDIN":      str(data.get("linkedin") or "#"),
        "EMAIL":         str(data.get("contact_email") or ""),
        "PROFILE_IMAGE": str(data.get("profile_image") or ""),
        "PROJECTS_LOOP": data.get("PROJECTS_LOOP", ""),
        "SKILLS_LOOP":   data.get("SKILLS_LOOP", ""),
        "CERTS_LOOP":    data.get("CERTS_LOOP", ""),
    }

    return re.sub(
        r"\{\{(\w+)\}\}",
        lambda m: replacements.get(m.group(1), m.group(0)),
        template,
    )


# ── Loop renderers ─────────────────────────────────────────────────────────────
# All output uses the universal CSS classes defined in wrapper.html
# (section, .project-card, .skill-chip, .cert-card) which are theme-adaptive
# via CSS custom properties — no hardcoded colours anywhere.

def _render_projects(projects: list[dict]) -> str:
    if not projects:
        return '<p style="color:var(--text-3);padding:20px 0;">No projects to display.</p>'

    cards: list[str] = []
    for i, p in enumerate(projects, 1):
        name  = p.get("name", "Untitled")
        desc  = p.get("description", "")
        link  = p.get("link") or "#"
        stack = p.get("tech_stack", [])

        stack_html = "".join(f'<span class="stack-item">{t}</span>' for t in stack)
        link_html  = (
            f'<a class="btn-live" href="{link}" target="_blank" rel="noopener">View Project ↗</a>'
            if link and link != "#"
            else '<span class="btn-live" style="opacity:.45;cursor:default;">No link</span>'
        )

        cards.append(f"""
<div class="project-card" data-animate style="animation-delay:{(i-1)*0.08:.2f}s">
  <div class="project-num">{i:02d} ——</div>
  <h3 class="project-name">{name}</h3>
  <p class="project-desc">{desc}</p>
  <div class="project-stack">{stack_html}</div>
  <div class="project-actions">{link_html}</div>
</div>""")

    return "\n".join(cards)


def _render_skills(skills: list[str]) -> str:
    if not skills:
        return '<span style="color:var(--text-3)">No skills listed.</span>'

    return "\n".join(
        f'<span class="skill-chip" data-animate style="animation-delay:{i*0.04:.2f}s">{skill}</span>'
        for i, skill in enumerate(skills)
    )


def _render_certs(certifications: list[dict]) -> str:
    if not certifications:
        return '<p style="color:var(--text-3);padding:20px 0;">No certifications to display.</p>'

    cards: list[str] = []
    for i, c in enumerate(certifications):
        name   = c.get("name", "")
        issuer = c.get("issuer", "")
        year   = c.get("year", "")
        link   = c.get("link") or "#"

        cards.append(f"""
<div class="cert-card" data-animate style="animation-delay:{i*0.07:.2f}s">
  <div class="cert-issuer-badge">
    <span class="cert-issuer-name">{issuer}</span>
  </div>
  <div class="cert-name">{name}</div>
  <div class="cert-meta">
    <span class="cert-date">{year}</span>
    <a class="cert-verify" href="{link}" target="_blank" rel="noopener">Verify ↗</a>
  </div>
</div>""")

    return "\n".join(cards)


# ── Navbar helper ─────────────────────────────────────────────────────────────

def build_nav_links(active_sections: list[str], github: str = "", linkedin: str = "") -> str:
    """Returns {{NAV_LINKS}} HTML block for the navbar template."""
    labels = {
        "hero":           "Home",
        "about":          "About",
        "skills":         "Skills",
        "projects":       "Projects",
        "certifications": "Certifications",
        "contact":        "Contact",
    }

    parts = [
        f'<a class="nav1-link" href="#{s}">{labels.get(s, s.title())}</a>'
        for s in active_sections
        if s != "navbar"
    ]
    if github and github != "#":
        parts.append(f'<a class="nav1-link" href="{github}" target="_blank" rel="noopener">GitHub</a>')
    if linkedin and linkedin != "#":
        parts.append(f'<a class="nav1-link" href="{linkedin}" target="_blank" rel="noopener">LinkedIn</a>')

    return "\n".join(parts)

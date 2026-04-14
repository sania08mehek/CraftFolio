#!/usr/bin/env python3
"""
CraftFolio — Layout Refactoring Script  (run once)
Converts hardcoded colors → CSS variables and strips standalone HTML wrappers.
Uses color-mix() for rgba transparency so every layout adapts to any theme.

Usage:
    cd craftfolio/
    python backend/scripts/refactor_layouts.py
"""

import re
import sys
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT   = Path(__file__).resolve().parent.parent.parent   # repo root
LIB    = ROOT / "lib" / "sections"

# ── Sections that already ship as PARTIAL html (no <html> wrapper) ─────────
ALREADY_PARTIAL = {"navbar", "hero", "skills"}

# ── Per-layout-number color/font replacement maps ─────────────────────────
# Longer / more-specific strings must come BEFORE shorter ones (dict is ordered).
# rgba() values are normalised to no-space form before lookup.

def _cm(var: str, pct: int) -> str:
    """color-mix shorthand"""
    return f"color-mix(in srgb, {var} {pct}%, transparent)"

L1 = {   # ── Midnight Dark ──────────────────────────────────────────────
    # nav-bar semi-transparent bg
    "rgba(7,7,15,0.85)":           _cm("var(--bg)", 85),
    # backgrounds
    "#07070f":                     "var(--bg)",
    "#111":                        "var(--bg)",
    "#0d0d1a":                     "var(--bg2)",
    "#13131f":                     "var(--surface)",
    "#111125":                     "var(--surface)",
    "#1a1a3e":                     "var(--surface-2)",
    "#1a1a30":                     "var(--surface-2)",
    "#1a1a2e":                     "var(--surface-2)",
    "#12122a":                     "var(--surface-2)",
    "#0a0a20":                     "var(--surface-2)",
    # borders
    "rgba(99,102,241,0.18)":       "var(--border)",
    "rgba(255,255,255,0.07)":      "var(--border)",
    "rgba(255,255,255,0.15)":      "var(--border)",
    "#2d2d4e":                     "var(--border-2)",
    "#2a2a4e":                     "var(--border-2)",
    "#1e1e3a":                     "var(--border-2)",
    "#0d1a12":                     "var(--border-2)",
    "#1a2e1e":                     "var(--border-2)",
    # accent rgba
    "rgba(99,102,241,0.55)":       _cm("var(--accent)", 55),
    "rgba(99,102,241,0.45)":       _cm("var(--accent)", 45),
    "rgba(99,102,241,0.40)":       _cm("var(--accent)", 40),
    "rgba(99,102,241,0.4)":        _cm("var(--accent)", 40),
    "rgba(99,102,241,0.35)":       _cm("var(--accent)", 35),
    "rgba(99,102,241,0.30)":       _cm("var(--accent)", 30),
    "rgba(99,102,241,0.3)":        _cm("var(--accent)", 30),
    "rgba(99,102,241,0.25)":       _cm("var(--accent)", 25),
    "rgba(99,102,241,0.22)":       _cm("var(--accent)", 22),
    "rgba(99,102,241,0.20)":       _cm("var(--accent)", 20),
    "rgba(99,102,241,0.2)":        _cm("var(--accent)", 20),
    "rgba(99,102,241,0.15)":       _cm("var(--accent)", 15),
    "rgba(99,102,241,0.12)":       _cm("var(--accent)", 12),
    "rgba(99,102,241,0.10)":       _cm("var(--accent)", 10),
    "rgba(99,102,241,0.1)":        _cm("var(--accent)", 10),
    "rgba(99,102,241,0.08)":       _cm("var(--accent)", 8),
    "rgba(139,92,246,0.2)":        _cm("var(--accent-3)", 20),
    "rgba(139,92,246,0.08)":       _cm("var(--accent-3)", 8),
    "rgba(236,72,153,0.12)":       _cm("var(--accent-2)", 12),
    # accent solids
    "#6366f1":                     "var(--accent)",
    "#7c7ffc":                     "var(--accent-2)",
    "#a78bfa":                     "var(--accent-2)",
    "#ec4899":                     "var(--accent-2)",
    "#8b5cf6":                     "var(--accent-3)",
    "#c4b5fd":                     "var(--accent-3)",
    # text
    "#e2e4ff":                     "var(--text)",
    "#f0f0ff":                     "var(--text)",
    "#fff":                        "var(--text)",
    "rgba(240,240,255,0.70)":      "var(--text-2)",
    "rgba(240,240,255,0.7)":       "var(--text-2)",
    "rgba(240,240,255,0.50)":      "var(--text-2)",
    "rgba(240,240,255,0.5)":       "var(--text-2)",
    "rgba(240,240,255,0.45)":      "var(--text-2)",
    "rgba(240,240,255,0.40)":      "var(--text-2)",
    "rgba(240,240,255,0.4)":       "var(--text-2)",
    "rgba(240,240,255,0.35)":      "var(--text-3)",
    "rgba(240,240,255,0.30)":      "var(--text-3)",
    "rgba(240,240,255,0.3)":       "var(--text-3)",
    "rgba(240,240,255,0.28)":      "var(--text-3)",
    "rgba(255,255,255,0.70)":      "var(--text-2)",
    "rgba(255,255,255,0.7)":       "var(--text-2)",
    "rgba(255,255,255,0.40)":      "var(--text-2)",
    "rgba(255,255,255,0.4)":       "var(--text-2)",
    "rgba(255,255,255,0.30)":      "var(--text-3)",
    "rgba(255,255,255,0.3)":       "var(--text-3)",
    "#5a5a7a":                     "var(--text-2)",
    "#4a5070":                     "var(--text-2)",
    "#3a3a5c":                     "var(--text-3)",
    "#2a4a3e":                     "var(--text-3)",
    "#2a3a2e":                     "var(--text-3)",
    "#4a6a54":                     "var(--text-2)",
    "#a7f3d0":                     "var(--text)",
    # success
    "rgba(16,185,129,0.30)":       _cm("var(--success)", 30),
    "rgba(16,185,129,0.3)":        _cm("var(--success)", 30),
    "rgba(16,185,129,0.15)":       _cm("var(--success)", 15),
    "rgba(16,185,129,0.10)":       _cm("var(--success)", 10),
    "rgba(16,185,129,0.1)":        _cm("var(--success)", 10),
    "rgba(16,185,129,0.08)":       _cm("var(--success)", 8),
    "#059669":                     "var(--success)",
    "#10b981":                     "var(--success)",
    "#22c55e":                     "var(--success)",
    "#f59e0b":                     "var(--warning)",
    "#ef4444":                     "var(--error)",
    # fonts
    "'Syne'":                      "var(--font-head)",
    '"Syne"':                      "var(--font-head)",
    "'DM Sans'":                   "var(--font-body)",
    '"DM Sans"':                   "var(--font-body)",
    "'Outfit'":                    "var(--font-body)",
    '"Outfit"':                    "var(--font-body)",
    "'Space Mono'":                "var(--font-mono)",
    '"Space Mono"':                "var(--font-mono)",
}

L2 = {   # ── Light Minimal ──────────────────────────────────────────────
    "#fafaf8":                     "var(--bg)",
    "#f9f9f7":                     "var(--bg)",
    "#f4f1eb":                     "var(--bg2)",
    "#ffffff":                     "var(--surface)",
    "#fff":                        "var(--surface)",
    "#f5f5f3":                     "var(--surface-2)",
    "#f9f9f7":                     "var(--surface-2)",
    "#e2ddd6":                     "var(--border)",
    "#e5e5e0":                     "var(--border)",
    "#ebebeb":                     "var(--border-2)",
    "#e5e5e5":                     "var(--border-2)",
    "#1a1a1a":                     "var(--accent)",
    "#0f0f0f":                     "var(--accent)",
    "#333":                        "var(--accent-2)",
    "#888880":                     "var(--accent-2)",
    "#3b82f6":                     "var(--accent-3)",
    "#6b6b6b":                     "var(--text-2)",
    "#888":                        "var(--text-2)",
    "#999":                        "var(--text-2)",
    "#aaa":                        "var(--text-3)",
    "#bbb":                        "var(--text-3)",
    "#ccc":                        "var(--text-3)",
    "#22c55e":                     "var(--success)",
    "#f59e0b":                     "var(--warning)",
    "#ef4444":                     "var(--error)",
    "'DM Serif Display'":          "var(--font-head)",
    '"DM Serif Display"':          "var(--font-head)",
    "'Plus Jakarta Sans'":         "var(--font-body)",
    '"Plus Jakarta Sans"':         "var(--font-body)",
    "'DM Sans'":                   "var(--font-body)",
    '"DM Sans"':                   "var(--font-body)",
    "'Space Mono'":                "var(--font-mono)",
    '"Space Mono"':                "var(--font-mono)",
}

L3 = {   # ── Neon Cyber ──────────────────────────────────────────────────
    "#020208":                     "var(--bg)",
    "#06060f":                     "var(--bg2)",
    "#0a0a18":                     "var(--surface)",
    "#0d0d1a":                     "var(--surface)",
    "#0f0f24":                     "var(--surface-2)",
    "rgba(0,255,200,0.15)":        "var(--border)",
    "rgba(139,92,246,0.20)":       "var(--border-2)",
    "rgba(139,92,246,0.2)":        "var(--border-2)",
    "rgba(0,255,200,0.30)":        _cm("var(--accent)", 30),
    "rgba(0,255,200,0.3)":         _cm("var(--accent)", 30),
    "rgba(0,255,200,0.20)":        _cm("var(--accent)", 20),
    "rgba(0,255,200,0.2)":         _cm("var(--accent)", 20),
    "rgba(0,255,200,0.10)":        _cm("var(--accent)", 10),
    "rgba(0,255,200,0.1)":         _cm("var(--accent)", 10),
    "#00ffc8":                     "var(--accent)",
    "#ff2d78":                     "var(--accent-2)",
    "#a78bfa":                     "var(--accent-3)",
    "#e8fff8":                     "var(--text)",
    "rgba(232,255,248,0.50)":      "var(--text-2)",
    "rgba(232,255,248,0.5)":       "var(--text-2)",
    "rgba(232,255,248,0.25)":      "var(--text-3)",
    "#ffd700":                     "var(--warning)",
    "'Bebas Neue'":                "var(--font-head)",
    '"Bebas Neue"':                "var(--font-head)",
    "'Outfit'":                    "var(--font-body)",
    '"Outfit"':                    "var(--font-body)",
    "'Space Mono'":                "var(--font-mono)",
    '"Space Mono"':                "var(--font-mono)",
}

L4 = {   # ── Aurora Dark ─────────────────────────────────────────────────
    "#04080f":                     "var(--bg)",
    "#070d18":                     "var(--bg2)",
    "#0c1525":                     "var(--surface)",
    "#111d33":                     "var(--surface-2)",
    "rgba(56,189,248,0.15)":       "var(--border)",
    "rgba(196,181,253,0.10)":      "var(--border-2)",
    "rgba(196,181,253,0.1)":       "var(--border-2)",
    "rgba(56,189,248,0.30)":       _cm("var(--accent)", 30),
    "rgba(56,189,248,0.3)":        _cm("var(--accent)", 30),
    "rgba(56,189,248,0.20)":       _cm("var(--accent)", 20),
    "rgba(56,189,248,0.2)":        _cm("var(--accent)", 20),
    "rgba(56,189,248,0.12)":       _cm("var(--accent)", 12),
    "#38bdf8":                     "var(--accent)",
    "#f472b6":                     "var(--accent-2)",
    "#c4b5fd":                     "var(--accent-3)",
    "#e8f4ff":                     "var(--text)",
    "rgba(232,244,255,0.50)":      "var(--text-2)",
    "rgba(232,244,255,0.5)":       "var(--text-2)",
    "rgba(232,244,255,0.25)":      "var(--text-3)",
    "#6ee7b7":                     "var(--success)",
    "#fbbf24":                     "var(--warning)",
    "#f87171":                     "var(--error)",
    "'Fraunces'":                  "var(--font-head)",
    '"Fraunces"':                  "var(--font-head)",
    "'Plus Jakarta Sans'":         "var(--font-body)",
    '"Plus Jakarta Sans"':         "var(--font-body)",
    "'Space Mono'":                "var(--font-mono)",
    '"Space Mono"':                "var(--font-mono)",
}

L5 = {   # ── Warm Editorial ──────────────────────────────────────────────
    "#fffbf5":                     "var(--bg)",
    "#f5ede0":                     "var(--bg2)",
    "#fff8f0":                     "var(--surface)",
    "#fdf8f2":                     "var(--surface-2)",
    "rgba(44,24,16,0.12)":         "var(--border)",
    "rgba(44,24,16,0.15)":         "var(--border)",
    "#ebe5d8":                     "var(--border-2)",
    "#2c1810":                     "var(--accent)",
    "#b08060":                     "var(--accent-2)",
    "#d97706":                     "var(--accent-3)",
    "#7a4f3a":                     "var(--text-2)",
    "#65a30d":                     "var(--success)",
    "#dc2626":                     "var(--error)",
    "'Crimson Pro'":               "var(--font-head)",
    '"Crimson Pro"':               "var(--font-head)",
    "'DM Sans'":                   "var(--font-body)",
    '"DM Sans"':                   "var(--font-body)",
    "'Space Mono'":                "var(--font-mono)",
    '"Space Mono"':                "var(--font-mono)",
}

L6 = {   # ── 3D Depth ────────────────────────────────────────────────────
    "#eceef5":                     "var(--bg)",
    "#e2e5f0":                     "var(--bg2)",
    "#ffffff":                     "var(--surface)",
    "#fff":                        "var(--surface)",
    "#f8f9fc":                     "var(--surface-2)",
    "#f3f0ff":                     "var(--surface-2)",
    "#ece9f5":                     "var(--surface-2)",
    "#f0f0f5":                     "var(--border)",
    "#d8dbe8":                     "var(--border)",
    "#cdd0df":                     "var(--border-2)",
    "#c2c6d6":                     "var(--border-2)",
    "#b7bbcd":                     "var(--border-2)",
    "#acb0c4":                     "var(--border-2)",
    "rgba(124,58,237,0.15)":       _cm("var(--accent)", 15),
    "rgba(124,58,237,0.08)":       _cm("var(--accent)", 8),
    "#7c3aed":                     "var(--accent)",
    "#a78bfa":                     "var(--accent-2)",
    "#5b21b6":                     "var(--accent-3)",
    "#0f0f1e":                     "var(--text)",
    "#6b7280":                     "var(--text-2)",
    "#9ca3af":                     "var(--text-3)",
    "#22c55e":                     "var(--success)",
    "#f59e0b":                     "var(--warning)",
    "#ef4444":                     "var(--error)",
    "'Syne'":                      "var(--font-head)",
    '"Syne"':                      "var(--font-head)",
    "'Outfit'":                    "var(--font-body)",
    '"Outfit"':                    "var(--font-body)",
    "'Space Mono'":                "var(--font-mono)",
    '"Space Mono"':                "var(--font-mono)",
}

MAPS = {1: L1, 2: L2, 3: L3, 4: L4, 5: L5, 6: L6}

# ── Helpers ────────────────────────────────────────────────────────────────

def normalize_rgba(text: str) -> str:
    """rgba(1, 2, 3, 0.4) → rgba(1,2,3,0.4) for consistent map lookups."""
    return re.sub(
        r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)',
        lambda m: f'rgba({m.group(1)},{m.group(2)},{m.group(3)},{m.group(4)})',
        text,
    )


def apply_color_map(css_text: str, cmap: dict) -> str:
    """Apply the mapping to a CSS text block only (no HTML touching)."""
    css_text = normalize_rgba(css_text)
    for original, replacement in cmap.items():
        css_text = css_text.replace(original, replacement)
    return css_text


def extract_partial(html: str) -> str:
    """
    If the file is a full HTML document, extract just:
      - every <style>…</style> block
      - everything from the first <section (or <nav) to the last </section> (or </nav>)
      - any <script>…</script> that follows
    Re-join in order. Strips <!doctype>, <html>, <head>, <body> wrappers.
    """
    # Already partial if no doctype
    if "<!doctype" not in html.lower() and "<!DOCTYPE" not in html:
        return html

    parts: list[str] = []

    # 1. Pull out <style> blocks from <head>
    for m in re.finditer(r'<style[^>]*>(.*?)</style>', html, re.DOTALL | re.IGNORECASE):
        parts.append(f"<style>\n{m.group(1).strip()}\n</style>")

    # 2. Pull everything from first <section or <nav open tag to matching close
    body_match = re.search(
        r'(<(?:section|nav)\b.*?</(?:section|nav)>)',
        html, re.DOTALL | re.IGNORECASE
    )
    if body_match:
        parts.append(body_match.group(1))

    # 3. Keep any <script> blocks that appear after the section
    for m in re.finditer(r'(<script[^>]*>.*?</script>)', html, re.DOTALL | re.IGNORECASE):
        parts.append(m.group(1))

    return "\n\n".join(parts)


def apply_map_to_styles(content: str, cmap: dict) -> str:
    """Apply color replacements inside every <style> block only."""
    def replace_style(m):
        return f"<style>\n{apply_color_map(m.group(1), cmap)}\n</style>"
    return re.sub(r'<style[^>]*>(.*?)</style>', replace_style, content, flags=re.DOTALL | re.IGNORECASE)


def ensure_section_id(content: str, section_name: str) -> str:
    """Make sure the <section> tag has id='section_name'."""
    # If it already has an id attr on section tag, leave it alone
    if re.search(r'<section\s[^>]*\bid=', content, re.IGNORECASE):
        return content
    # Otherwise inject id into the first <section …>
    return re.sub(
        r'<section\b',
        f'<section id="{section_name}"',
        content, count=1, flags=re.IGNORECASE
    )


def add_contact_placeholders(content: str) -> str:
    """Replace sample contact data with template placeholders."""
    content = re.sub(r'hello@yourname\.dev', '{{EMAIL}}', content)
    content = re.sub(r'mailto:[^"\']+', 'mailto:{{EMAIL}}', content)
    return content


def process_file(path: Path, layout_num: int, section: str) -> None:
    original = path.read_text(encoding="utf-8")
    processed = extract_partial(original)

    # Remove stray * { } and body { } resets from inside style blocks
    # (they pollute the assembled page when concatenated)
    def strip_global_resets(m):
        inner = m.group(1)
        inner = re.sub(r'\*\s*\{[^}]+\}', '', inner)
        inner = re.sub(r'body\s*\{[^}]+\}', '', inner)
        return f"<style>\n{inner.strip()}\n</style>"

    processed = re.sub(r'<style[^>]*>(.*?)</style>', strip_global_resets, processed,
                       flags=re.DOTALL | re.IGNORECASE)

    # Apply color map
    cmap = MAPS.get(layout_num, {})
    processed = apply_map_to_styles(processed, cmap)

    # Ensure section id
    processed = ensure_section_id(processed, section)

    # Contact-specific data placeholders
    if section == "contact":
        processed = add_contact_placeholders(processed)

    path.write_text(processed.strip() + "\n", encoding="utf-8", newline="\n")
    print(f"  OK  {path.relative_to(ROOT)}")


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    errors = 0
    # Map layout filenames to layout number
    layout_name_re = re.compile(r'^layout(\d)\.html$', re.IGNORECASE)

    for section_dir in sorted(LIB.iterdir()):
        if not section_dir.is_dir():
            continue
        section = section_dir.name
        print(f"\n[{section}]")

        for html_file in sorted(section_dir.glob("layout*.html")):
            m = layout_name_re.match(html_file.name)
            if not m:
                print(f"  --  skipping {html_file.name}")
                continue
            layout_num = int(m.group(1))
            try:
                process_file(html_file, layout_num, section)
            except Exception as e:
                print(f"  ER  {html_file.name}: {e}")
                errors += 1

    print(f"\n{'─'*50}")
    if errors:
        print(f"!! Done with {errors} error(s).")
        sys.exit(1)
    else:
        print("[DONE] All layout files refactored successfully.")


if __name__ == "__main__":
    main()

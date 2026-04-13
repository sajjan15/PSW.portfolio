# Sajjan Gautam — PSW E-Portfolio

> A fully custom, professionally designed e-portfolio built for the Personal Support Worker (PSW) program at Centennial College (2025–2026). Crafted to meet every academic portfolio requirement while standing out as a modern, interactive web presence that showcases clinical training, certifications, and professional growth.

---

## Live Demo

**[Click here to view the portfolio site](https://sajjan15.github.io/PSW.portfolio)**

> Update the link above once you have deployed the site to your hosting platform.

---

## Portfolio Sections

| # | Section | Purpose |
|---|---------|---------|
| 01 | Statement of Originality | Academic integrity declaration + learning repository disclaimer |
| 02 | Table of Contents | Navigation to all 10 graded sections |
| 03 | Work Philosophy | Personal values and beliefs as a PSW |
| 04 | Career Goals | 1-year, 2–3 year, and 4–5 year professional goals |
| 05 | Résumé & Cover Letter | Downloadable + previewable PDFs |
| 06 | Work Samples | POP assignment, midterm & final clinical evaluations |
| 07 | Certifications & Awards | All certificates with download and in-page preview |
| 08 | Academic Plan of Study | All 9 PSW courses with descriptions + previous AEC education |
| 09 | References | 3 professional references with full contact info |
| 10 | Global Citizenship | PSHS 104 group project — mental health equity Philippines vs Canada |
| — | Skills & Languages | PSW competencies + Nepali / English / French / Chinese |
| — | Education & Placement History | Left/right alternating timeline |
| — | Professional Experience | Forum Research Inc. customer service role |
| — | Contact | Validated form → opens email client directly |

---

## Features

### Animations & Interactions
- **Animated SVG progress ring** — draws itself around the SG logo on every page load
- **Typewriter effect** — cover subtitle types out letter by letter with a blinking cursor
- **Rotating hero badge** — PSW 2025–26 badge spins continuously on the cover
- **Scroll progress bar** — thin teal line at the top of the page fills as you scroll
- **Ambient orbs** — soft drifting background gradients for depth
- **Noise texture overlay** — subtle grain for a refined, editorial feel
- **Parallax cover** — the hero fades and shifts gently as you scroll away

### Navigation
- **Sticky frosted-glass nav** — blurred backdrop, stays at the top as you scroll
- **Floating dot navigation** — right-edge vertical dots, one per section; hover to see labels, click to jump
- **Active section highlighting** — nav links and dots update as you scroll
- **Back to top button** — appears after scrolling 500px, smooth scroll back

### Theme
- **Dark / light mode** with saved preference via `localStorage`
- **Radial wipe transition** — clicking the theme toggle triggers a circle that expands from the button, sweeping the new theme across the screen
- **Custom cursor** — teal ring follows the mouse with spring lag; enlarges on hover, shrinks on click (desktop only)

### Documents
- **PDF viewer modal** — every Preview button opens the document in a full-screen overlay directly on the page; close with ✕, Escape key, or clicking outside
- **Certificate availability check** — each certificate card automatically checks if its PDF is uploaded; buttons disable with a toast message if the file is missing

### Contact Form
- **Client-side validation:**
  - Name must be at least two words (first + last)
  - Email must contain `@`
  - Message must be at least 5 words
- **Direct mailto delivery** — on valid submit, opens the user's email client pre-filled with the sender's name, email, and message addressed to `Sajjangautam28@gmail.com`
- **Toast notifications** — friendly inline error messages guide the user

---

## File Structure

After downloading, place your PDFs alongside the HTML file like this:

```
portfolio-complete.html
assets/
└── certificates/
    ├── pswresume.pdf
    ├── pswcoverpage.pdf
    ├── MaskFit-Certificate.pdf
    ├── CPR-BLS-Standard-First-Aid.pdf
    ├── Food-Handling-Certificate.pdf
    ├── Dementia-Course-Certificate.pdf
    ├── aectranscript.pdf
    ├── Driving-License.pdf
    ├── pop.pdf
    ├── midterm-evaluation.pdf
    ├── final-evaluation.pdf
    └── GC-E-Presentation.pdf
```

> The certificate availability checker runs automatically on page load. Any missing PDF will show a grey disabled state on the card — no errors, just a clean fallback.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Structure | Vanilla HTML5 | Single-file, zero dependencies |
| Styling | Custom CSS with variables | Full dark/light theming, responsive, no framework bloat |
| Fonts | Google Fonts (Cormorant Garamond, Outfit, JetBrains Mono) | Editorial + clean + monospace pairing |
| Icons | Font Awesome 6.5 (CDN) | Healthcare-relevant icon set |
| Scripting | Vanilla JavaScript (ES2020) | No build step, runs everywhere |
| Animations | Pure CSS keyframes + JS IntersectionObserver | Smooth, accessible, respects `prefers-reduced-motion` |

---

## Accessibility

- Skip-to-content link for keyboard users
- `aria-label` on all icon-only buttons and links
- `aria-live` toast region for screen readers
- `role="dialog"` and `aria-modal` on the PDF modal
- `prefers-reduced-motion` media query disables all animations for users who prefer it
- Colour contrast meets WCAG AA in both light and dark themes
- Custom cursor automatically disabled on touch devices

---

## Customisation

All personal details are in the HTML — search and replace to update:

| Find | Replace with |
|------|-------------|
| `Sajjangautam28@gmail.com` | Your email |
| `+1 (514) 576-4015` | Your phone |
| `sajjan-gautam-68891a19a` | Your LinkedIn handle |
| `Toronto, ON, Canada` | Your location |

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/psw-portfolio.git
cd psw-portfolio
```

### Run Locally

No build tools needed. Simply open the file in your browser:

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

Or serve it locally with Python for full PDF preview support:

```bash
# Python 3
python3 -m http.server 8000
# Then open http://localhost:8000/index.html
```

---

## Academic Context

This portfolio was built to satisfy the **PSW E-Portfolio assignment** (30 marks / 20% of final grade) for the Personal Support Worker program at Centennial College. All 10 required sections are present and clearly labelled with the star badge (⭐) in each section heading.

Beyond meeting the assignment requirements, this portfolio was designed to serve as a **real professional tool** — something that can be shared with employers, placed on a résumé, and updated over time as new certifications and experience are added.

### Why This Portfolio Stands Out

- Every section goes beyond the minimum requirement with detailed, genuine writing
- Clinical placements are documented with context, not just dates
- References include real contact information from actual supervisors and instructors
- The Global Citizenship section features original research into mental health equity between the Philippines and Canada
- The Academic Plan of Study includes full course descriptions for all 9 PSW courses
- Professional experience from Forum Research Inc. connects data skills to healthcare documentation
- Four languages are listed — Nepali (mother tongue), English, French, and Chinese — reflecting real multilingual capability relevant to Toronto's diverse client population

---

## License & Disclaimer

This portfolio is an **educational learning project**. All client-related information has been anonymised. Personal contact details are included for professional evaluation purposes only and may not be harvested or reused. © 2026 Sajjan Gautam — all rights reserved.
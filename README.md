# CISSP Prep Lab

A fully offline-capable, zero-infrastructure CISSP exam preparation app.  
Hosted free on **GitHub Pages** — no server, no backend, no cost.

## Features

- **Mock Exam** — timed 125-question exam mimicking real CISSP format
- **Study / Practice** — domain-filtered sessions with instant explanations
- **Quick Domain Test** — one-click test for any of the 8 CBK domains
- **Key Concepts** — domain-wise accordion study notes (50 topics, 500+ facts)
- **Study Materials** — clickable PDF links (local or Google Drive)
- **Live Score** — running correct/wrong/% counter during every session
- **Score Card** — pass/fail verdict, domain performance bars, session history
- **Hard Question Bank** — mark questions as hard; revisit them anytime

## Domains Covered

| # | Domain |
|---|--------|
| D1 | Security and Risk Management |
| D2 | Asset Security |
| D3 | Security Architecture and Engineering |
| D4 | Communication and Network Security |
| D5 | Identity and Access Management |
| D6 | Security Assessment and Testing |
| D7 | Security Operations |
| D8 | Software Development Security |

## Run Locally

Just open `index.html` in any browser — no install, no server needed.

```bash
open index.html
# or for Chrome file:// access:
python3 -m http.server 8080
```

## Question Bank

200 questions (25 per domain) in `data/questions.js`.  
Add your own questions by editing that file — see the format inside.

## PDF Study Materials

The **Materials** tab lets you open PDFs from a local folder or via Google Drive links.  
Google Drive links are saved in your browser's localStorage — no account needed.

> PDFs are not included in this repository. Add your own copies locally or via Google Drive.

## Tech Stack

Pure HTML5 · CSS3 · Vanilla JavaScript · localStorage  
Zero dependencies · Zero build step · Runs anywhere

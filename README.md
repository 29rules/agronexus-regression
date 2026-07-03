# agronexus-regression

Monthly black-box regression test suite for [agronexustrading.in](https://agronexustrading.in) using [Playwright](https://playwright.dev/).

> Tests run against the **live production site** — no source code access needed. All checks are end-to-end.

---

## Test Suite Overview

| Spec file | Tag | What it tests |
|---|---|---|
| `smoke.spec.js` | `@smoke` | Homepage loads, title correct, hero section visible, API health |
| `navigation.spec.js` | `@navigation` | All nav links reachable, no broken routes, page titles |
| `whatsapp.spec.js` | `@whatsapp` | WhatsApp bubble visible, correct number linked, click opens WA |
| `chatbot.spec.js` | `@chatbot` | Chat toggle visible, opens panel, send message, receives reply |
| `inquiry-form.spec.js` | `@form` | Form renders, validation works, submission succeeds |
| `api.spec.js` | `@api` | /api/whatsapp and /api/chat endpoints return expected status |
| `responsive.spec.js` | `@responsive` | Mobile (375px), tablet (768px), desktop (1280px) layouts |

---

## Folder Structure

```
agronexus-regression/
├── tests/
│   ├── smoke.spec.js
│   ├── navigation.spec.js
│   ├── whatsapp.spec.js
│   ├── chatbot.spec.js
│   ├── inquiry-form.spec.js
│   ├── api.spec.js
│   └── responsive.spec.js
├── config/
│   └── urls.js
├── helpers/
│   ├── wait.js
│   └── assertions.js
├── scripts/
│   └── run-regression.sh
├── .github/
│   └── workflows/
│       ├── monthly.yml      ← runs 1st of every month at 09:00 UTC
│       └── manual.yml       ← on-demand with tag filter
├── playwright.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## Running Locally

### Prerequisites

```bash
node >= 18
npm >= 9
```

### Setup

```bash
git clone https://github.com/29rules/agronexus-regression.git
cd agronexus-regression
npm install
npx playwright install chromium webkit firefox
cp .env.example .env
```

### Run all tests

```bash
npm test
```

### Run smoke tests only

```bash
npm run test:smoke
```

### Run a specific tag

```bash
npm run test:whatsapp
npm run test:chatbot
npm run test:form
npm run test:api
npm run test:responsive
```

### Run full regression suite with report

```bash
npm run regression
```

This runs the shell script which: checks site is reachable → runs smoke tests → runs full suite → generates HTML report.

### View HTML report

```bash
npm run test:report
```

---

## GitHub Actions — On-Demand Run

You can trigger a test run manually from GitHub without setting up anything locally.

1. Go to [Actions → Run regression manually](https://github.com/29rules/agronexus-regression/actions/workflows/manual.yml)
2. Click **Run workflow**
3. Fill in:
   - **Target URL** — defaults to `https://agronexustrading.in`
   - **Test tag** — e.g. `@smoke`, `@chatbot`, `@whatsapp`, `@form`, `@api`, `@responsive` — leave blank to run ALL tests
4. Click **Run workflow** (green button)
5. Wait ~5-10 minutes for results
6. Download the `playwright-report` artifact from the run summary (retained 30 days)

---

## Scheduled Runs

The suite runs automatically on the **1st of every month at 09:00 UTC** via `.github/workflows/monthly.yml`.

- Browsers: Chromium, Mobile Safari (iPhone 13), Firefox
- On failure: Slack notification sent to `SLACK_WEBHOOK_URL` secret (if configured)
- Report artifact retained: **30 days**
- JSON results retained: **90 days**

### Configuring Slack notifications

1. In your Slack workspace, create an Incoming Webhook
2. In this repo → Settings → Secrets → Actions
3. Add secret: `SLACK_WEBHOOK_URL` = your webhook URL

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BASE_URL` | No | Target site (default: `https://agronexustrading.in`) |
| `SLACK_WEBHOOK_URL` | No | Slack webhook for failure alerts |

Copy `.env.example` to `.env` for local overrides. Never commit `.env`.

---

## Browsers Tested

| Browser | Config name | Viewport |
|---|---|---|
| Chromium (Desktop Chrome) | Desktop Chrome | 1280 × 720 |
| WebKit (Mobile Safari) | Mobile Safari — iPhone 13 | 390 × 844 |
| Firefox | Desktop Firefox | 1280 × 720 |

---

## Failure Interpretation

| Failure type | Likely cause |
|---|---|
| Smoke test fails | Site is down or DNS issue |
| WhatsApp test fails | WA bubble removed or number changed |
| Chatbot test fails | Chat widget not rendering or API down |
| Form test fails | Form validation or submission endpoint broken |
| API test fails | Vercel serverless function error |
| Responsive test fails | Layout regression at a specific breakpoint |

---

## Contributing

This suite is intentionally minimal and black-box. To add a new test:

1. Add a new spec file in `tests/`
2. Tag the describe block: `test.describe('@mytag Homepage', () => { ... })`
3. Add a script in `package.json`: `"test:mytag": "playwright test --grep @mytag"`
4. Document it in the table above

---

## Repo

- **Main website:** [github.com/29rules/agronexus](https://github.com/29rules/agronexus)
- **Chatbot:** [github.com/29rules/agronexus-chatbot](https://github.com/29rules/agronexus-chatbot)
- **Live site:** [agronexustrading.in](https://agronexustrading.in)

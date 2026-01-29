# Week 6 Base Files (Issues 24-26)

This folder is the Week 6 snapshot. It starts from Week 5 and focuses on **advanced backend intelligence**: vendor resolution, analytics, and alert rules.

## Week 6 Goal

Level-up ingestion and insights: add vendor confidence scoring, real analytics, and renewal alert rules.

## Issues Covered (Planned)

### Issue 24: Gmail Ingestion v2 — Vendor Resolver + Confidence Scoring (Competitive)
- Vendor normalization + confidence scoring
- Dedupe hash + explainability signals

### Issue 25: Analytics Engine — Spend Trends + Category Insights
- Aggregation pipelines for spend + category analytics
- Trend series for dashboard

### Issue 26: Renewal Alert Rules + Upcoming Notifications API
- User-defined rule window (3/7/14 days)
- Upcoming renewals API (no notifications yet)

---

## Progress Checklist

Backend (Week 6)
- [ ] Vendor resolver + confidence scoring
- [ ] Candidate deduping and metadata
- [ ] Analytics overview endpoint
- [ ] Alerts rule endpoints + upcoming renewals

Frontend (Week 6)
- [ ] No UI changes required (backend-only week)

## Credits (Merged PRs)

| Issue | Focus Area | Contributors (PRs) |
| ----: | ---------- | ------------------ |
| **24** | Vendor Resolver + Confidence | _pending integration_ |
| **25** | Analytics Engine | _pending integration_ |
| **26** | Renewal Alerts API | _pending integration_ |

## Structure

- `client/` — UI layer (Week 5 baseline).
- `server/` — Gmail ingestion + analytics/alerts (Week 6 target).

## Run Locally

### Using pnpm

```bash
cd base_files/week6/client
pnpm install --no-frozen-lockfile
pnpm dev
```

```bash
cd base_files/week6/server
pnpm install --no-frozen-lockfile
pnpm dev
```

### Using npm

```bash
cd base_files/week6/client
npm install
npm run dev
```

```bash
cd base_files/week6/server
npm install
npm run dev
```

> Tip: copy `base_files/week6/server/envExample` to `.env` and fill Google OAuth values before starting the server.

## Notes
- Week 6 is backend-heavy; UI changes should remain scoped to contributors folders only.

#!/bin/bash
set -e

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SITE=${BASE_URL:-https://agronexustrading.in}

echo "================================================"
echo "  AGRONEXUS REGRESSION SUITE"
echo "  Site: $SITE"
echo "  Run: $TIMESTAMP"
echo "================================================"
echo ""

echo ">> Checking site is reachable..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE" --max-time 15)
if [ "$STATUS" != "200" ]; then
  echo "FATAL: Site returned HTTP $STATUS — aborting tests"
  exit 1
fi
echo "Site is up (HTTP 200)"
echo ""

echo ">> Running smoke tests..."
npx playwright test --grep @smoke --reporter=list

echo ""
echo ">> Running full regression suite..."
npx playwright test --reporter=list

echo ""
echo ">> Generating HTML report..."
echo "Open playwright-report/index.html to view detailed results"
echo ""
echo "================================================"
echo "  REGRESSION COMPLETE: $(date '+%H:%M:%S')"
echo "================================================"

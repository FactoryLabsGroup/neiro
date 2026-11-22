#!/usr/bin/env bash
# Capture the app screens the website shows, in one language, from the iOS Simulator.
#
#   tools/capture-screens.sh en ~/code/neiro-ios
#
# Run it on a Mac with Xcode. It builds Neiro for the Simulator, launches it once per screen
# with the app's own debug launch arguments (three weeks of demo progress, onboarding skipped,
# dark appearance, the chosen language), and saves each screenshot to tools/raw/<lang>/.
# Two screens need a scroll by hand; the script waits for you. Then it runs make-screens.py,
# which puts the set on the site.
#
# Optional: SIM="iPhone 17 Pro Max" to pick the Simulator.
set -euo pipefail

LANG_CODE="${1:-}"
APP_REPO="${2:-}"
if [[ "$LANG_CODE" != "en" && "$LANG_CODE" != "ka" ]] || [[ ! -d "$APP_REPO/Neiro.xcodeproj" ]]; then
  echo "Usage: tools/capture-screens.sh en|ka path/to/neiro-ios" >&2
  exit 1
fi

SITE="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$SITE/tools/raw/$LANG_CODE"
SIM="${SIM:-iPhone 17 Pro Max}"
BUNDLE="com.factorylabs.neiro"
DERIVED="$SITE/tools/raw/build"
mkdir -p "$OUT"

echo "Building Neiro for the $SIM simulator…"
xcodebuild -project "$APP_REPO/Neiro.xcodeproj" -scheme Neiro -configuration Debug \
  -destination "platform=iOS Simulator,name=$SIM" -derivedDataPath "$DERIVED" build -quiet
APP="$(find "$DERIVED/Build/Products" -maxdepth 2 -name 'Neiro.app' -path '*iphonesimulator*' | head -n 1)"

xcrun simctl boot "$SIM" 2>/dev/null || true
open -a Simulator
xcrun simctl bootstatus "$SIM" -b >/dev/null
xcrun simctl install "$SIM" "$APP"
xcrun simctl status_bar "$SIM" override --time "9:41" --batteryState charged --batteryLevel 100 \
  --cellularMode active --cellularBars 4 --wifiBars 3 --dataNetwork wifi

BASE=(-debug.seed YES -settings.onboarded YES -settings.language "$LANG_CODE" -settings.appearance dark)

# shot NAME SECONDS [launch arguments…]
shot() {
  local name="$1" wait="$2"; shift 2
  xcrun simctl launch --terminate-running-process "$SIM" "$BUNDLE" "${BASE[@]}" "$@" >/dev/null
  sleep "$wait"
  xcrun simctl io "$SIM" screenshot --type=png "$OUT/$name.png" >/dev/null
  echo "  $name"
}

# by_hand NAME HINT [launch arguments…]
by_hand() {
  local name="$1" hint="$2"; shift 2
  xcrun simctl launch --terminate-running-process "$SIM" "$BUNDLE" "${BASE[@]}" "$@" >/dev/null
  read -r -p "  $name: $hint, then press Return. " _
  xcrun simctl io "$SIM" screenshot --type=png "$OUT/$name.png" >/dev/null
  echo "  $name"
}

echo "Capturing ($LANG_CODE) into $OUT"
shot home 4
by_hand games "Scroll home down to the rows of games"
shot adaptive 9 -debug.game flight -debug.autoplay YES
shot 3d 7 -debug.game spin -debug.autoplay YES
shot puzzle 3 -debug.puzzle YES
shot streak 8 -debug.finale YES
shot neuron 3 -debug.sheet progress
by_hand progress "Scroll the progress sheet to the Neiro score and the skills" -debug.sheet progress
shot duel 3 -debug.duel ink

xcrun simctl status_bar "$SIM" clear
python3 "$SITE/tools/make-screens.py" "$LANG_CODE" "$OUT"
echo "Done. Look the screens over in tools/raw/$LANG_CODE, then commit assets/screens/$LANG_CODE and assets/js/screens.js."

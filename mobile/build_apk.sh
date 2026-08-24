#!/bin/bash

# MiChat APK Build Script
# Usage: ./build_apk.sh [dev|staging|prod]

set -e

FLAVOR=${1:-prod}
BUILD_TYPE="release"

echo "================================"
echo "🚀 MiChat APK Builder"
echo "================================"
echo "Flavor: $FLAVOR"
echo "Build Type: $BUILD_TYPE"
echo ""

# Check if Flutter is installed
if ! command -v flutter &> /dev/null
then
    echo "❌ Flutter is not installed. Please install Flutter first."
    exit 1
fi

echo "📦 Getting dependencies..."
flutter pub get

echo "🔨 Building APK for $FLAVOR..."
flutter build apk \
    --flavor $FLAVOR \
    --target=lib/main.dart \
    --release \
    --dart-define=FLAVOR=$FLAVOR

echo ""
echo "✅ APK build completed!"
echo ""

APK_PATH="build/app/outputs/flutter-apk/app-$FLAVOR-release.apk"

if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "📁 APK saved to: $APK_PATH"
    echo "📊 APK Size: $APK_SIZE"
    echo ""
    echo "✨ Ready to install!"
    echo "   Command: adb install -r $APK_PATH"
else
    echo "❌ APK not found at expected location"
    exit 1
fi

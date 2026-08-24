#!/bin/bash

# MiChat IPA Build Script for iOS
# Usage: ./build_ios.sh [dev|staging|prod]

set -e

FLAVOR=${1:-prod}

echo "================================"
echo "🍎 MiChat iOS Builder"
echo "================================"
echo "Flavor: $FLAVOR"
echo ""

if ! command -v flutter &> /dev/null
then
    echo "❌ Flutter is not installed. Please install Flutter first."
    exit 1
fi

echo "📦 Getting dependencies..."
flutter pub get

echo "🔨 Building iOS for $FLAVOR..."
flutter build ios \
    --flavor $FLAVOR \
    --target=lib/main.dart \
    --release \
    --dart-define=FLAVOR=$FLAVOR

echo ""
echo "✅ iOS build completed!"
echo ""
echo "📁 Build output: build/ios/iphoneos/Runner.app"
echo ""
echo "📝 Next steps:"
echo "   1. Open Xcode: open ios/Runner.xcworkspace"
echo "   2. Set signing certificates in Xcode"
echo "   3. Archive and upload to App Store"

# MiChat APK Build Guide

## 📱 Android APK Build

### Prerequisites
- Flutter SDK
- Android SDK (API level 21 and above)
- JDK 11 or higher
- Git

### Quick Build

```bash
cd mobile
./build_apk.sh prod
```

### Manual Build

```bash
flutter clean
flutter pub get
flutter build apk --release
```

### Build Flavors

```bash
# Development build
./build_apk.sh dev

# Staging build
./build_apk.sh staging

# Production build
./build_apk.sh prod
```

### APK Output Locations

- **Release APK**: `build/app/outputs/flutter-apk/app-release.apk`
- **Debug APK**: `build/app/outputs/flutter-apk/app-debug.apk`
- **Flavor APKs**: `build/app/outputs/flutter-apk/app-{flavor}-release.apk`

### Install APK on Device

```bash
# Install APK
adb install -r build/app/outputs/flutter-apk/app-release.apk

# Uninstall
adb uninstall com.michat.app

# Run with logs
adb logcat
```

## 🍎 iOS IPA Build

### Prerequisites
- macOS
- Xcode 12 or higher
- iOS Deployment Target: 11.0+
- Apple Developer Account

### Quick Build

```bash
cd mobile
./build_ios.sh prod
```

### Manual Build

```bash
flutter clean
flutter pub get
flutter build ios --release
```

### Create IPA for App Store

```bash
open ios/Runner.xcworkspace
```

Then in Xcode:
1. Product → Scheme → Runner
2. Product → Destination → Generic iOS Device
3. Product → Archive
4. Organizer → Distribute App

## 🔑 Code Signing (Android)

### Create Keystore

```bash
keytool -genkey -v -keystore ~/michat-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias michat-key
```

### Configure Gradle

Set environment variables:

```bash
export KEYSTORE_PATH=/path/to/michat-key.jks
export KEYSTORE_PASSWORD=your_password
export KEY_ALIAS=michat-key
export KEY_PASSWORD=your_key_password
```

## 📊 Build Configuration

### Debug vs Release

| Feature | Debug | Release |
|---------|-------|----------|
| Minification | No | Yes |
| Optimization | None | Full |
| App Size | Larger | Smaller |
| Performance | Slower | Faster |
| Debugging | Enabled | Disabled |

### API Configuration

**Debug Mode**: Uses local backend (192.168.1.100:5000)
**Release Mode**: Uses production API (api.michat.app)

Edit in `android/app/build.gradle`

## 🚀 Distribution

### Google Play Store

1. Create Google Play Developer Account
2. Upload signed APK
3. Add store listing details
4. Review and publish

### Apple App Store

1. Create Apple Developer Account
2. Create App ID and certificate
3. Archive in Xcode
4. Upload to App Store Connect
5. Submit for review

### Direct APK Distribution

```bash
# Host APK on your server
cp build/app/outputs/flutter-apk/app-release.apk ~/public_html/

# Users can download and install
adb install -r app-release.apk
```

## 🐛 Troubleshooting

### APK Build Fails

```bash
# Clean build
flutter clean
flutter pub get

# Check Flutter version
flutter --version

# Check Android SDK
flutter doctor -v
```

### Code Signing Issues

```bash
# List keystores
keytool -list -v -keystore ~/michat-key.jks

# Verify APK signature
jarsigner -verify -verbose build/app/outputs/flutter-apk/app-release.apk
```

### Size Issues

```bash
# Enable ProGuard minification
# Edit: android/app/build.gradle
# Set minifyEnabled = true

# Analyze APK
gunzip -c app-release.apk > app.zip
unzip -l app.zip | head -20
```

## 📈 Performance Optimization

1. **Enable ProGuard**: Reduces APK size
2. **Split APKs**: Build by ABI (arm64-v8a, armeabi-v7a)
3. **Lazy Loading**: Load resources on demand
4. **Code Stripping**: Remove unused code

### Build Split APKs

```bash
flutter build apk --split-per-abi
```

Output:
- `app-armeabi-v7a-release.apk` (~25-30 MB)
- `app-arm64-v8a-release.apk` (~30-35 MB)
- `app-x86-release.apk` (~25-30 MB)
- `app-x86_64-release.apk` (~30-35 MB)

## 📋 Checklist Before Release

- [ ] Update version number
- [ ] Update CHANGELOG.md
- [ ] Test on real devices
- [ ] Check all permissions
- [ ] Verify API endpoints
- [ ] Test offline functionality
- [ ] Check crashes with Crashlytics
- [ ] Performance profiling
- [ ] Update privacy policy
- [ ] Create app store listing
- [ ] Prepare screenshots
- [ ] Set release notes

## 🔗 Useful Links

- [Flutter Build Documentation](https://flutter.dev/docs/deployment/android)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

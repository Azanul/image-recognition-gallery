ARCHS_IOS = aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
ARCHS_ANDROID = aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
LIB = libimage_processing.a
XCFRAMEWORK = ImageProcessing.xcframework

all: ios android

ios: $(XCFRAMEWORK)

android: $(ARCHS_ANDROID)
	sh copy_android.sh

.PHONY: $(ARCHS_IOS)
$(ARCHS_IOS): %:
	cargo build --target $@ --release

.PHONY: $(ARCHS_ANDROID)
$(ARCHS_ANDROID): %:
	cargo build --target $@ --release

$(XCFRAMEWORK): $(ARCHS_IOS)
	lipo -create $(wildcard target/x86_64-apple-ios/release/$(LIB)) $(wildcard target/aarch64-apple-ios-sim/release/$(LIB)) -output simulator_fat/$(LIB)
	xcodebuild -create-xcframework -library $(wildcard target/aarch64-apple-ios/release/$(LIB)) -headers include -library simulator_fat/$(LIB) -headers include -output $@

ARCHS_IOS = aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
ARCHS_ANDROID = aarch64-linux-android x86_64-linux-android i686-linux-android arm-linux-androideabi
LIB = libimage_processing.a
XCFRAMEWORK = ImageProcessing.xcframework

all: ios android

ios: $(XCFRAMEWORK)

android: GENERATE_ANDROID

.PHONY: $(ARCHS_IOS)
$(ARCHS_IOS): %:
	cargo build --target $@ --release

.PHONY: $(ARCHS_ANDROID)
$(ARCHS_ANDROID): %:
	./build-android.sh $@

.PHONY: GENERATE_ANDROID
GENERATE_ANDROID: $(ARCHS_ANDROID)
	./copy-android.sh

$(XCFRAMEWORK): $(ARCHS_IOS)
	lipo -create $(wildcard target/x86_64-apple-ios/release/$(LIB)) $(wildcard target/aarch64-apple-ios-sim/release/$(LIB)) -output simulator_fat/$(LIB)
	xcodebuild -create-xcframework -library $(wildcard target/aarch64-apple-ios/release/$(LIB)) -headers include -library simulator_fat/$(LIB) -headers include -output $@

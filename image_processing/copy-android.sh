#!/bin/bash
mkdir -p ../android/app/src/main/jniLibs ..
mkdir -p ../android/app/src/main/jniLibs/x86
mkdir -p ../android/app/src/main/jniLibs/arm64-v8a
mkdir -p ../android/app/src/main/jniLibs/armeabi-v7a
# missing arm-linux-androideabi here, don't know the name of the arch?

cp ./target/i686-linux-android/release/libimage_processing.so ../android/app/src/main/jniLibs/x86/libimage_processing.so
cp ./target/aarch64-linux-android/release/libimage_processing.so ../android/app/src/main/jniLibs/arm64-v8a/libimage_processing.so
cp ./target/arm-linux-androideabi/release/libimage_processing.so ../android/app/src/main/jniLibs/armeabi-v7a/libimage_processing.so
# missing x86_64-linux-androideabi here, don't know the name of the arch?

echo "Dynamic libraries copied!"
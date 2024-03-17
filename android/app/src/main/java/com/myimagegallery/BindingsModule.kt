package com.myimagegallery

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.util.RNLog

class BindingsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        init {
            System.loadLibrary("image_processing")
        }
    }

    override fun getName(): String {
        return "Bindings"
    }

    @ReactMethod
    fun init(apiKey: String) {
        RNLog.w(this.reactApplicationContext, "BindingsModule.init() called with apiKey: $apiKey")
        val result = helloWorld()
        RNLog.w(this.reactApplicationContext, "Rust says: $result")
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun list(folderPath: String): String {
        RNLog.w(this.reactApplicationContext, "BindingsModule.listImages() called with folderPath: $folderPath")
        val result = listImages(folderPath)
        RNLog.w(this.reactApplicationContext, "Rust says: $result")
        return result
    }

    private external fun helloWorld(): String
    private external fun listImages(path: String): String
}

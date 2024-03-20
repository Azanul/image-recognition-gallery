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

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun create(tag: String): String {
        RNLog.w(this.reactApplicationContext, "BindingsModule.createTag() called with tag: $tag")
        val result = createTag(tag, this.reactApplicationContext.filesDir.getPath())
        return result
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun tag(filePath: String, tag: String): String {
        RNLog.w(this.reactApplicationContext, "BindingsModule.addImageToTag() called with filePath $filePath & tag: $tag")
        val result = addImageToTag(filePath, tag)
        return result
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun list(pathOrTag: String): String {
        RNLog.w(this.reactApplicationContext, "BindingsModule.listImages() called with pathOrTag: $pathOrTag")
        val result = if (folderPath.isEmpty()) {
            listTags(this.reactApplicationContext.filesDir.getPath())
        } else if (!pathOrTag.startsWith("/storage/emulated/0")) {
            listTaggedImages(this.reactApplicationContext.filesDir.getPath()+"/"+pathOrTag)
        } else {
            listImages(pathOrTag)
        }
        RNLog.w(this.reactApplicationContext, "Rust says: $result")
        return result
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun get(filePath: String): String {
        RNLog.w(this.reactApplicationContext, "BindingsModule.getImage() called with folderPath: $filePath")
        val result = getImage(filePath)
        return result
    }

    private external fun listImages(path: String): String
    private external fun getImage(path: String): String
    private external fun listTags(path: String): String
    private external fun listTaggedImages(path: String): String
}

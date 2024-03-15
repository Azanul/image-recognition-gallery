use std::ffi::CString;
use libc::c_char;

#[no_mangle]
pub unsafe extern fn hello_world() -> *const c_char {
    let s = CString::new("Hello World!").expect("CString new");
    s.into_raw()
}

pub mod android {
    extern crate jni;

    use self::jni::JNIEnv;
    use self::jni::objects::JClass;
    use self::jni::sys::jstring;

    #[no_mangle]
    pub unsafe extern fn Java_com_myimagegallery_BindingsModule_helloWorld (env: JNIEnv, _: JClass) -> jstring {
        let output: jni::objects::JString<'_> = env.new_string("Hello from Rust!").expect ("Couldn't create java string!");
        **output
    }
}
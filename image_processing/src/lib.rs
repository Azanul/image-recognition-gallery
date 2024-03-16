use libc::c_char;
use std::ffi::CString;

#[no_mangle]
pub unsafe extern "C" fn hello_world() -> *const c_char {
    let s = CString::new("Hello World!").expect("CString new");
    s.into_raw()
}

pub mod android {
    extern crate jni;

    use std::fs;

    use self::jni::objects::{JClass, JString};
    use self::jni::sys::jstring;
    use self::jni::JNIEnv;

    #[no_mangle]
    pub unsafe extern "C" fn Java_com_myimagegallery_BindingsModule_helloWorld(
        env: JNIEnv,
        _: JClass,
    ) -> jstring {
        let output: JString<'_> = env
            .new_string("Hello from Rust!")
            .expect("Couldn't create java string!");
        **output
    }    

    #[no_mangle]
    pub unsafe extern "C" fn Java_com_myimagegallery_BindingsModule_listImages(mut env: JNIEnv, _: JClass, folder_path: JString) -> jstring {
        // Convert jstring to Rust String
        let folder_path = env.get_string(&folder_path);
        let binding = env.new_string("").expect("Couldn't create java string!");
        let folder_path = match folder_path {
            Ok(s) => s.into(),
            Err(_) => env.get_string(&binding).unwrap(),
        };

        // Convert JString to Rust String
        let folder_path: String = folder_path.to_string_lossy().into_owned();

        // Get a list of files in the folder
        let files = fs::read_dir(&folder_path)
            .expect("Unable to read directory")
            .map(|entry| entry.expect("Error reading entry").path())
            .filter(|path| path.is_file())
            .filter(|path| {
                if let Some(extension) = path.extension() {
                    if let Some(ext) = extension.to_str() {
                        ext.eq_ignore_ascii_case("png") || ext.eq_ignore_ascii_case("jpg") || ext.eq_ignore_ascii_case("jpeg") || ext.eq_ignore_ascii_case("svg")
                    } else {
                        false
                    }
                } else {
                    false
                }
            })
            .collect::<Vec<_>>();
        

        // Convert list of file paths to a single string
        let result = files.iter()
            .map(|path| path.to_str().unwrap_or_default())
            .collect::<Vec<_>>()
            .join("\n");

        let output: JString = env.new_string(&result).expect("Couldn't create java string!");
        **output
    }
}

use libc::c_char;
use std::ffi::CString;

#[no_mangle]
pub unsafe extern "C" fn hello_world() -> *const c_char {
    let s = CString::new("Hello World!").expect("CString new");
    s.into_raw()
}

pub mod android {
    extern crate jni;

    use base64::engine::general_purpose;
    use base64::Engine;
    use image::io::Reader as ImageReader;
    use std::fs::{self};
    use std::io::Cursor;

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
    pub unsafe extern "C" fn Java_com_myimagegallery_BindingsModule_listImages(
        mut env: JNIEnv,
        _: JClass,
        folder_path: JString,
    ) -> jstring {
        // Convert jstring to Rust String
        let folder_path = env.get_string(&folder_path);
        let binding = env.new_string("").expect("Couldn't create java string!");
        let folder_path = match folder_path {
            Ok(s) => s.into(),
            Err(_) => env.get_string(&binding).unwrap(),
        };

        // Convert JString to Rust String
        let folder_path: String = folder_path.to_string_lossy().into_owned();

        // Get a list of files & folders in the folder
        let fnfs = fs::read_dir(folder_path)
            .unwrap()
            .filter_map(|entry| {
                entry.ok().and_then(|e| {
                    let path = e.path();
                    if path.is_file() {
                        if let Some(extension) = path.extension() {
                            if let Some(ext) = extension.to_str() {
                                if ext.eq_ignore_ascii_case("png")
                                    || ext.eq_ignore_ascii_case("jpg")
                                    || ext.eq_ignore_ascii_case("jpeg")
                                {
                                    let image_format =
                                        image::ImageFormat::from_extension(ext).unwrap();
                                    let img = ImageReader::open(&path).unwrap().decode().unwrap();
                                    let mut image_data: Vec<u8> = Vec::new();
                                    img.thumbnail(100, 100)
                                        .write_to(&mut Cursor::new(&mut image_data), image_format)
                                        .unwrap();
                                    return Some(format!(
                                        "{{\"type\":\"{}\",\"data\":\"{}\"}}",
                                        ext.to_lowercase().as_str(),
                                        general_purpose::STANDARD.encode(image_data)
                                    ));
                                }
                            }
                        }
                    } else {
                        return Some(format!(
                            "{{\"type\":\"folder\",\"data\":\"{}\"}}",
                            path.display()
                        ));
                    }
                    None
                })
            })
            .collect::<Vec<_>>();

        // Construct the JSON array
        let json_result = format!("[{}]", fnfs.join(","));

        let output: JString = env
            .new_string(&json_result)
            .expect("Couldn't create java string!");
        **output
    }
}

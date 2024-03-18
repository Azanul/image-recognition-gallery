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
    use std::path::PathBuf;
    use std::str::FromStr;

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
        let folder_path = env.get_string(&folder_path).unwrap();
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
                                        "{{\"type\":\"{}\",\"path\":\"{}\",\"data\":\"{}\"}}",
                                        ext.to_lowercase().as_str(),
                                        path.display(),
                                        general_purpose::STANDARD.encode(image_data)
                                    ));
                                }
                            }
                        }
                    } else {
                        return Some(format!(
                            "{{\"type\":\"folder\",\"path\":\"{}\"}}",
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

    #[no_mangle]
    pub unsafe extern "C" fn Java_com_myimagegallery_BindingsModule_getImage(
        mut env: JNIEnv,
        _: JClass,
        file_path: JString,
    ) -> jstring {
        let file_path = env.get_string(&file_path).unwrap();
        let file_path: String = file_path.to_string_lossy().into_owned();

        // Open the image
        let img = ImageReader::open(file_path.clone())
            .unwrap()
            .decode()
            .unwrap();

        let image_format = image::ImageFormat::from_path(file_path.clone()).unwrap();

        let mut image_data: Vec<u8> = Vec::new();
        img.write_to(&mut Cursor::new(&mut image_data), image_format)
            .unwrap();

        // Construct image response
        let path = PathBuf::from_str(&file_path).unwrap();

        let json_result = format!(
            "{{\"type\":\"{}\",\"path\":\"{}\",\"data\":\"{}\"}}",
            path.extension().unwrap().to_str().unwrap(),
            path.display(),
            general_purpose::STANDARD.encode(image_data)
        );

        let output: JString = env
            .new_string(&json_result)
            .expect("Couldn't create java string!");
        **output
    }
}

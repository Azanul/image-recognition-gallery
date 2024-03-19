use base64::engine::general_purpose;
use base64::Engine;
use image::io::Reader as ImageReader;
use serde::{Deserialize, Serialize};

use std::fs::{self};
use std::io::Cursor;
use std::path::PathBuf;
use std::str::FromStr;

const SUPPORTED_FORMATS: [&str; 3] = ["png", "jpg", "jpeg"];

// An item can be an image or a folder
#[derive(Serialize, Deserialize)]
pub struct ItemInfo {
    pub r#type: String,
    pub path: String,
    pub data: String,
}

fn list_images(folder_path: &str) -> Result<Vec<ItemInfo>, std::io::Error> {
    let fnfs = fs::read_dir(folder_path)?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();
            if path.is_file() {
                if let Some(extension) = path.extension() {
                    if let Some(ext) = extension.to_str() {
                        if SUPPORTED_FORMATS.contains(&&*ext.to_lowercase()) {
                            let image_format = image::ImageFormat::from_extension(ext).unwrap();
                            let img = ImageReader::open(&path).unwrap().decode().unwrap();
                            let mut image_data: Vec<u8> = Vec::new();
                            img.thumbnail(100, 100)
                                .write_to(&mut Cursor::new(&mut image_data), image_format)
                                .unwrap();
                            return Some(ItemInfo {
                                r#type: ext.to_lowercase().to_owned(),
                                path: path.display().to_string(),
                                data: general_purpose::STANDARD.encode(image_data),
                            });
                        }
                    }
                }
            } else {
                return Some(ItemInfo {
                    r#type: "folder".to_owned(),
                    path: path.display().to_string(),
                    data: String::new(),
                });
            }
            None
        })
        .collect();

    Ok(fnfs)
}

fn get_image(file_path: &str) -> Result<ItemInfo, std::io::Error> {
    let img = ImageReader::open(file_path).unwrap().decode().unwrap();

    let image_format = image::ImageFormat::from_path(file_path).unwrap();

    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), image_format)
        .unwrap();

    let path = PathBuf::from_str(file_path).unwrap();

    Ok(ItemInfo {
        r#type: path.extension().unwrap().to_str().unwrap().to_string(),
        path: file_path.to_owned(),
        data: general_purpose::STANDARD.encode(image_data),
    })
}

pub mod android {
    extern crate jni;

    use serde_json::json;

    use crate::{get_image, list_images};

    use self::jni::objects::{JClass, JString};
    use self::jni::sys::jstring;
    use self::jni::JNIEnv;

    #[no_mangle]
    pub unsafe extern "C" fn Java_com_myimagegallery_BindingsModule_listImages(
        mut env: JNIEnv,
        _: JClass,
        folder_path: JString,
    ) -> jstring {
        let folder_path = env.get_string(&folder_path).unwrap();
        let folder_path: String = folder_path.to_string_lossy().into_owned();

        let image_infos = match list_images(&folder_path) {
            Ok(infos) => infos,
            Err(err) => {
                let error_msg = format!("Error listing images: {}", err);
                return **env
                    .new_string(&error_msg)
                    .expect("Couldn't create java string!");
            }
        };

        let json_result = json!(image_infos).to_string();

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

        let image_info = match get_image(&file_path) {
            Ok(info) => info,
            Err(err) => {
                let error_msg = format!("Error getting image: {}", err);
                return **env
                    .new_string(&error_msg)
                    .expect("Couldn't create java string!");
            }
        };

        let json_result = json!(image_info).to_string();

        let output: JString = env
            .new_string(&json_result)
            .expect("Couldn't create java string!");
        **output
    }
}

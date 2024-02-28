use std::ffi::CString;
use std::fs;
use std::path::PathBuf;
use libc::c_char;

#[no_mangle]
pub unsafe extern fn hello_world() -> *const c_char {
    let s = CString::new("Hello World!").expect("CString new");
    s.into_raw()
}

#[repr(C)]
pub struct FetchResult {
    pub success: bool,
    pub error_message: *const c_char,
    pub paths: *mut PathBuf,
    pub path_count: usize,
}

impl FetchResult {
    fn success(paths: Vec<PathBuf>) -> Self {
        Self {
            success: true,
            error_message: std::ptr::null(),
            paths: paths.as_ptr() as *mut PathBuf,
            path_count: paths.len(),
        }
    }

    fn error(message: &str) -> Self {
        let error_message = CString::new(message).expect("CString::new failed");
        Self {
            success: false,
            error_message: error_message.into_raw(),
            paths: std::ptr::null_mut(),
            path_count: 0,
        }
    }
}

impl Drop for FetchResult {
    fn drop(&mut self) {
        if !self.error_message.is_null() {
            unsafe { let _ = CString::from_raw(self.error_message as *mut c_char); };
        }
        if !self.paths.is_null() {
            unsafe {
                Vec::from_raw_parts(self.paths, self.path_count, self.path_count);
            }
        }
    }
}

#[no_mangle]
pub unsafe extern "C" fn fetch_images_from_folder(c_path: *const c_char) -> FetchResult {
    let path: &str = match std::ffi::CStr::from_ptr(c_path).to_str() {
        Ok(s) => s,
        Err(e) => {
            let err = format!("FFI string conversion failed: {}", e);
            eprintln!("{}", err);
            return FetchResult::error(&format!("FFI string conversion failed: {}", e));
        }
    };

    // Read the contents of the folder
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(err) => return FetchResult::error(&format!("Error reading folder: {}", err)),
    };

    let image_files: Vec<PathBuf> = entries
        .filter_map(|entry| {
            let entry = match entry {
                Ok(entry) => entry,
                Err(_) => return None,
            };
            let path = entry.path();
            if path.is_file() && path.extension().map_or(false, |ext| ext == "jpg" || ext == "jpeg" || ext == "png") {
                Some(path)
            } else {
                None
            }
        })
        .collect();

    FetchResult::success(image_files)
}

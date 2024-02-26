use std::ffi::CString;

use libc::c_char;

#[no_mangle]
pub unsafe extern fn hello_world() -> *const c_char {
    let s = CString::new("Hello World!").expect("CString new");
    s.into_raw()
}

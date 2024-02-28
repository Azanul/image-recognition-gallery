#include <cstdarg>
#include <cstdint>
#include <cstdlib>
#include <ostream>
#include <new>

extern "C" {

const char *hello_world();

struct FetchResult {
    bool success;
    const char* error_message;
    const char* paths;
    size_t path_count;
};

FetchResult fetch_images_from_folder(const char* c_path);

} // extern "C"

//
//  Bindings.h
//  ImageRecognitionGallery
//
//  Created by Azanul Haque on 26/02/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "Bindings.h"
#import "libimage_processing.h"

@implementation Bindings

RCT_EXPORT_MODULE ()

RCT_EXPORT_METHOD (init: (NSString *)apiKey) {
  RCT LogInfo(@"Received apiKey %@, calling rust next", apikey);
  const char *myRustStr = hello_world();
  NSString *myObjCStr = [NSString stringWithUTF8String: myRustStr];
  RCT LogInfo(@"Received string from rust %@", myObjCStr);
}
@end

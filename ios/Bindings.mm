//
//  Bindings.m
//  ImageRecognitionGallery
//
//  Created by Azanul Haque on 26/02/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "Bindings.h"
#import "image_processing.h"

@implementation Bindings

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(init: (NSString *) apiKey) {
  RCTLogInfo(@"Received apiKey %@, calling rust next", apiKey);
  const char *myRustStr = hello_world();
  NSString *myObjCStr = [NSString stringWithUTF8String: myRustStr];
  RCTLogInfo(@"Received string from rust %@", myObjCStr);
}
@end

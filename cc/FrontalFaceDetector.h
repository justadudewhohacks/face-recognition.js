#include "Converters.h"
#include "dlib/image_processing/frontal_face_detector.h"

#ifndef __FACEREC_FRONTALFACEDETECTOR_H__
#define __FACEREC_FRONTALFACEDETECTOR_H__

class FrontalFaceDetector : public Nan::ObjectWrap {
public:
	dlib::frontal_face_detector detector;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);
	static NAN_METHOD(Detect);

	static Nan::Persistent<v8::FunctionTemplate> constructor;

	dlib::frontal_face_detector* getNativeObjectPtr() { return &detector; }
	dlib::frontal_face_detector getNativeObject() { return detector; }

	typedef InstanceConverter<FrontalFaceDetector, dlib::frontal_face_detector> Converter;

	static const char* getClassName() {
		return "FrontalFaceDetector";
	}
};

#endif
#include "converters/Converters.h"
#include <dlib/gui_widgets.h>
#include <dlib/image_processing/render_face_detections.h>

#ifndef __FACEREC_IMAGEWINDOW_H__
#define __FACEREC_IMAGEWINDOW_H__

class ImageWindow : public Nan::ObjectWrap {
public:
	dlib::image_window win;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);
	static NAN_METHOD(SetImage);
	static NAN_METHOD(SetSize);
	static NAN_METHOD(ClearOverlay);
	static NAN_METHOD(AddOverlay);
	static NAN_METHOD(RenderFaceDetections);

	static Nan::Persistent<v8::FunctionTemplate> constructor;
};

#endif
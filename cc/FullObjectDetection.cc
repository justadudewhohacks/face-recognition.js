#include "FullObjectDetection.h"
#include "Point.h"

Nan::Persistent<v8::FunctionTemplate> FullObjectDetection::constructor;

NAN_MODULE_INIT(FullObjectDetection::Init) {
	v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(FullObjectDetection::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FullObjectDetection").ToLocalChecked());
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rect").ToLocalChecked(), GetRect);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("numParts").ToLocalChecked(), GetNumParts);
	Nan::SetPrototypeMethod(ctor, "getParts", GetParts);
	target->Set(Nan::New("FullObjectDetection").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(FullObjectDetection::New) {
	FullObjectDetection* self = new FullObjectDetection();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

NAN_METHOD(FullObjectDetection::GetParts) {
	dlib::full_object_detection detection = FullObjectDetection::Converter::unwrap(info.This());
	std::vector<dlib::point> parts;
	for (int i = 0; i < (int)detection.num_parts(); i++) {
		parts.push_back(detection.part(i));
	}
	info.GetReturnValue().Set(ObjectArrayConverter<Point, dlib::point>::wrap(parts));
};
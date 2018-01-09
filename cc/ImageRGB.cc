#include "ImageRGB.h"

Nan::Persistent<v8::FunctionTemplate> ImageRGB::constructor;

NAN_MODULE_INIT(ImageRGB::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(ImageRGB::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("ImageRGB").ToLocalChecked());

	Nan::SetPrototypeMethod(ctor, "toGray", ToGray);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rows").ToLocalChecked(), GetRows);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("cols").ToLocalChecked(), GetCols);

  target->Set(Nan::New("ImageRGB").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(ImageRGB::New) {
	ImageRGB* self = new ImageRGB();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

NAN_METHOD(ImageRGB::ToGray) {
	dlib::matrix<unsigned char> outGray;
	dlib::assign_image(outGray, ImageRGB::Converter::unwrap(info.This()));
	info.GetReturnValue().Set(ImageGray::Converter::wrap(outGray));
};
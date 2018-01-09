#include "ImageGray.h"

Nan::Persistent<v8::FunctionTemplate> ImageGray::constructor;

NAN_MODULE_INIT(ImageGray::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(ImageGray::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("ImageGray").ToLocalChecked());
  Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rows").ToLocalChecked(), GetRows);
  Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("cols").ToLocalChecked(), GetCols);

  target->Set(Nan::New("ImageGray").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(ImageGray::New) {
	ImageGray* self = new ImageGray();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};
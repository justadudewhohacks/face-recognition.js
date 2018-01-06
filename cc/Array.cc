#include "Array.h"

Nan::Persistent<v8::FunctionTemplate> Array::constructor;

NAN_MODULE_INIT(Array::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(Array::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("Array").ToLocalChecked());
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("length").ToLocalChecked(), GetLength);
  target->Set(Nan::New("Array").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(Array::New) {
	Array* self = new Array();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};

NAN_METHOD(Array::GetData) {
	info.GetReturnValue().Set(DoubleArrayConverter::wrap(Array::toVec(Array::Converter::unwrap(info.This()))));
};
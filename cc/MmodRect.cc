#include "MmodRect.h"

Nan::Persistent<v8::FunctionTemplate> MmodRect::constructor;

NAN_MODULE_INIT(MmodRect::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(MmodRect::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("MmodRect").ToLocalChecked());
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rect").ToLocalChecked(), GetRect);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("confidence").ToLocalChecked(), GetConfidence);
  target->Set(Nan::New("MmodRect").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(MmodRect::New) {
	MmodRect* self = new MmodRect();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};
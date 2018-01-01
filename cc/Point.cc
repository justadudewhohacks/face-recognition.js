#include "Point.h"

Nan::Persistent<v8::FunctionTemplate> Point::constructor;

NAN_MODULE_INIT(Point::Init) {
	v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(Point::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Point").ToLocalChecked());
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("x").ToLocalChecked(), GetX);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("y").ToLocalChecked(), GetY);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("z").ToLocalChecked(), GetZ);
	target->Set(Nan::New("Point").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(Point::New) {
	Point* self = new Point();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};
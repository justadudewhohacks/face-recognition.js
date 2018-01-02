#include "ChipDetails.h"
#include "Point.h"

Nan::Persistent<v8::FunctionTemplate> ChipDetails::constructor;

NAN_MODULE_INIT(ChipDetails::Init) {
	v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(ChipDetails::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("ChipDetails").ToLocalChecked());
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rect").ToLocalChecked(), GetRect);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rows").ToLocalChecked(), GetRows);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("cols").ToLocalChecked(), GetCols);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("angle").ToLocalChecked(), GetAngle);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("size").ToLocalChecked(), GetSize);
	target->Set(Nan::New("ChipDetails").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(ChipDetails::New) {
	ChipDetails* self = new ChipDetails();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};
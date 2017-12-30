#include "Rect.h"

Nan::Persistent<v8::FunctionTemplate> Rect::constructor;

NAN_MODULE_INIT(Rect::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(Rect::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("Rect").ToLocalChecked());
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("left").ToLocalChecked(), GetLeft);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("right").ToLocalChecked(), GetRight);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("top").ToLocalChecked(), GetTop);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("bottom").ToLocalChecked(), GetBottom);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("area").ToLocalChecked(), GetArea);
  target->Set(Nan::New("Rect").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(Rect::New) {
	Rect* self = new Rect();
	if (info.Length() > 0) {
		double l, t, r, b;
		FF_TRY_UNWRAP_ARGS(
			"Rect::New",
			DoubleConverter::arg(0, &l, info)
			|| DoubleConverter::arg(1, &t, info)
			|| DoubleConverter::arg(2, &r, info)
			|| DoubleConverter::arg(3, &b, info)
		);
		self->rect = dlib::rectangle((long)l, (long)t, (long)r, (long)b);
	}
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};
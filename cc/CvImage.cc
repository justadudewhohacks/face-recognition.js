#include "CvImage.h"

Nan::Persistent<v8::FunctionTemplate> CvImage::constructor;

NAN_MODULE_INIT(CvImage::Init) {
  v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(CvImage::New);
  constructor.Reset(ctor);
  ctor->InstanceTemplate()->SetInternalFieldCount(1);
  ctor->SetClassName(Nan::New("CvImageWrap").ToLocalChecked());
  Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rows").ToLocalChecked(), GetRows);
  Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("cols").ToLocalChecked(), GetCols);
  target->Set(Nan::New("CvImageWrap").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(CvImage::New) {
	if (info.Length() > 0) {
		int rows, cols, widthStep, elemsize;
		FF_TRY_UNWRAP_ARGS(
			"CvImageWrap::New",
			IntConverter::arg(0, &rows, info)
			|| IntConverter::arg(1, &cols, info)
			|| IntConverter::arg(2, &widthStep, info)
			|| IntConverter::arg(3, &elemsize, info)
		);

		if (!info[4]->IsUint8Array()) {
			FF_RETHROW("CvImageWrap::New - expected arg 4 to be a node buffer");
		}

		char *data = static_cast<char *>(node::Buffer::Data(info[4]->ToObject()));

		CvImage* self = new CvImage(rows, cols, widthStep, elemsize, data);
		self->Wrap(info.Holder());
		return info.GetReturnValue().Set(info.Holder());
	}

	CvImage* self = new CvImage();
	self->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
};
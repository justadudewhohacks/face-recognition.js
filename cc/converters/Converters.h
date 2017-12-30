#include "TypeConverters.h"
#include "ArrayConverters.h"

#define FF_TRY_UNWRAP_ARGS(ff_methodName, applyUnwrappers)\
	Nan::TryCatch tryCatch;\
	if (applyUnwrappers) {\
		std::string err = std::string(*Nan::Utf8String(tryCatch.Exception()->ToString()));\
		tryCatch.Reset();\
		Nan::ThrowError(\
			Nan::New(\
				std::string(ff_methodName)\
				+ std::string(" - ")\
				+ err\
			).ToLocalChecked()\
		);\
		tryCatch.ReThrow();\
		return;\
	}
#include "TypeConverters.h"
#include "ArrayConverters.h"

#define FF_RETHROW(ff_err) \
	tryCatch.Reset();\
	Nan::ThrowError(ff_err);\
	tryCatch.ReThrow();\
	return;\

#define FF_TRY_UNWRAP_ARGS(ff_methodName, applyUnwrappers)\
	Nan::TryCatch tryCatch;\
	if (applyUnwrappers) {\
		std::string err = std::string(*Nan::Utf8String(tryCatch.Exception()->ToString()));\
		FF_RETHROW(\
			Nan::New(\
				std::string(ff_methodName)\
				+ std::string(" - ")\
				+ err\
			).ToLocalChecked()\
		);\
	}
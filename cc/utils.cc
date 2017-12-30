#include "utils.h"
#include "ImageRGB.h"
#include "ImageGray.h"
#include <iostream>

NAN_MODULE_INIT(Utils::Init) {
	Nan::SetMethod(target, "loadImage", Load_Image);
	Nan::SetMethod(target, "pyramidUp", PyramidUp);
	Nan::SetMethod(target, "hitEnterToContinue", HitEnterToContinue);
};

NAN_METHOD(Utils::Load_Image) {
	std::string imgPath;
	FF_TRY_UNWRAP_ARGS(
		"Load_Image",
		StringConverter::arg(0, &imgPath, info)
	);

	dlib::matrix<dlib::rgb_pixel> img;
	try {
		dlib::load_image(img, imgPath);
	} catch (std::exception ex) {
		tryCatch.Reset();
		Nan::ThrowError(std::string(std::string("load_image failed to open file: ") + ex.what()).c_str());
		tryCatch.ReThrow();
		return;
	}

	info.GetReturnValue().Set(ImageRGB::Converter::wrap(img));
};

NAN_METHOD(Utils::PyramidUp) {
	bool isGray = ImageGray::Converter::hasInstance(info[0]);

	dlib::matrix<unsigned char> imgGray;
	dlib::matrix<dlib::rgb_pixel> img;
	FF_TRY_UNWRAP_ARGS(
		"PyramidUp",
		(isGray && ImageGray::Converter::arg(0, &imgGray, info))
		|| ImageRGB::Converter::arg(0, &img, info)
	);

	if (isGray) {
		dlib::matrix<unsigned char> outGray;
		dlib::assign_image(outGray, imgGray);
		dlib::pyramid_up(outGray);
		info.GetReturnValue().Set(ImageGray::Converter::wrap(outGray));
	} else {
		dlib::matrix<dlib::rgb_pixel> out;
		dlib::assign_image(out, img);
		dlib::pyramid_up(out);
		info.GetReturnValue().Set(ImageRGB::Converter::wrap(out));
	}
};

NAN_METHOD(Utils::HitEnterToContinue) {
	std::cin.get();
};
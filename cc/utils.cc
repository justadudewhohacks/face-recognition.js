#include "utils.h"
#include "ImageRGB.h"
#include "ImageGray.h"
#include "FullObjectDetection.h"
#include "ChipDetails.h"
#include <iostream>

NAN_MODULE_INIT(Utils::Init) {
	Nan::SetMethod(target, "loadImage", Load_Image);
	Nan::SetMethod(target, "pyramidUp", PyramidUp);
	Nan::SetMethod(target, "resizeImage", ResizeImage); 
	Nan::SetMethod(target, "hitEnterToContinue", HitEnterToContinue);
	Nan::SetMethod(target, "getFaceChipDetails", GetFaceChipDetails);
	Nan::SetMethod(target, "extractImageChips", ExtractImageChips);
	Nan::SetMethod(target, "tileImages", TileImages);
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

NAN_METHOD(Utils::ResizeImage) {
	bool isGray = ImageGray::Converter::hasInstance(info[0]);

	dlib::matrix<unsigned char> imgGray;
	dlib::matrix<dlib::rgb_pixel> img;
	double scale;
	FF_TRY_UNWRAP_ARGS(
		"ResizeImage",
		(isGray && ImageGray::Converter::arg(0, &imgGray, info))
		|| ImageRGB::Converter::arg(0, &img, info)
		|| DoubleConverter::arg(1, &scale, info)
	);

	if (isGray) {
		dlib::matrix<unsigned char> outGray;
		dlib::assign_image(outGray, imgGray);
		dlib::resize_image(scale, outGray);
		info.GetReturnValue().Set(ImageGray::Converter::wrap(outGray));
	}
	else {
		dlib::matrix<dlib::rgb_pixel> out;
		dlib::assign_image(out, img);
		dlib::resize_image(scale, out);
		info.GetReturnValue().Set(ImageRGB::Converter::wrap(out));
	}
};

NAN_METHOD(Utils::HitEnterToContinue) {
	std::cin.get();
};

NAN_METHOD(Utils::GetFaceChipDetails) {
	std::vector<dlib::full_object_detection> detections;
	int size = 200;
	double padding = 0.2;

	bool didThrow = 
		ObjectArrayConverter<FullObjectDetection, dlib::full_object_detection>::arg(0, &detections, info)
		|| IntConverter::optArg(1, &size, info)
		|| DoubleConverter::optArg(2, &padding, info);

	FF_TRY_UNWRAP_ARGS(
		"GetFaceChipDetails",
		didThrow
	);
	std::vector<dlib::chip_details> details = dlib::get_face_chip_details(detections, (unsigned long)size, padding);
	info.GetReturnValue().Set(ObjectArrayConverter<ChipDetails, dlib::chip_details>::wrap(details));
};

NAN_METHOD(Utils::ExtractImageChips) {
	dlib::matrix<dlib::rgb_pixel> img;
	std::vector<dlib::chip_details> details;

	bool didThrow = 
		ImageRGB::Converter::arg(0, &img, info)
		||ObjectArrayConverter<ChipDetails, dlib::chip_details>::arg(1, &details, info);

	FF_TRY_UNWRAP_ARGS(
		"GetFaceChipDetails",
		didThrow
	);

	dlib::array<dlib::matrix<dlib::rgb_pixel>> face_chips;
	dlib::extract_image_chips(img, details, face_chips);

	std::vector<dlib::matrix<dlib::rgb_pixel>> face_chips_vec;
	for (auto chip : face_chips) face_chips_vec.push_back(chip);
	info.GetReturnValue().Set(ObjectArrayConverter<ImageRGB, dlib::matrix<dlib::rgb_pixel>>::wrap(face_chips_vec));
};

NAN_METHOD(Utils::TileImages) {
	std::vector<dlib::matrix<dlib::rgb_pixel>> face_chips;
	bool didThrow = ObjectArrayConverter<ImageRGB, dlib::matrix<dlib::rgb_pixel>>::arg(0, &face_chips, info);
	FF_TRY_UNWRAP_ARGS(
		"TileImages",
		didThrow
	);
	dlib::matrix<dlib::rgb_pixel> tileImages = dlib::tile_images(face_chips);
	info.GetReturnValue().Set(ImageRGB::Converter::wrap(tileImages));
};

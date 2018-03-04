#include "utils.h"
#include "ImageRGB.h"
#include "ImageGray.h"
#include "CvImage.h"
#include "FullObjectDetection.h"
#include "ChipDetails.h"
#include "Array.h"
#include <iostream>

NAN_MODULE_INIT(Utils::Init) {
	Nan::SetMethod(target, "loadImage", Load_Image);
	Nan::SetMethod(target, "saveImage", Save_Image);
	Nan::SetMethod(target, "pyramidUp", PyramidUp);
	Nan::SetMethod(target, "resizeImage", ResizeImage);
	Nan::SetMethod(target, "cvImageToImageRGB", CvImageToImageRGB);
	Nan::SetMethod(target, "hitEnterToContinue", HitEnterToContinue);
	Nan::SetMethod(target, "getFaceChipDetails", GetFaceChipDetails);
	Nan::SetMethod(target, "extractImageChips", ExtractImageChips);
	Nan::SetMethod(target, "tileImages", TileImages);
	Nan::SetMethod(target, "jitterImage", JitterImage);
	Nan::SetMethod(target, "mean", Mean);
	Nan::SetMethod(target, "distance", Distance);
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

NAN_METHOD(Utils::Save_Image) {
	bool isGray = ImageGray::Converter::hasInstance(info[1]);

	std::string imgPath;
	dlib::matrix<unsigned char> imgGray;
	dlib::matrix<dlib::rgb_pixel> img;
	bool isJpeg = false;
	FF_TRY_UNWRAP_ARGS(
		"Save_Image",
		StringConverter::arg(0, &imgPath, info)
		|| (isGray && ImageGray::Converter::arg(1, &imgGray, info))
		|| (!isGray && ImageRGB::Converter::arg(1, &img, info))
		|| BoolConverter::optArg(2, &isJpeg, info)
	);

	if (isGray) {
		if (isJpeg) {
			dlib::save_jpeg(imgGray, imgPath);
		}
		else {
			dlib::save_png(imgGray, imgPath);
		}
	}
	else {
		if (isJpeg) {
			dlib::save_jpeg(img, imgPath);
		}
		else {
			dlib::save_png(img, imgPath);
		}
	}
};

template<class PT, class CT>
void Utils::pyramidUp(Nan::NAN_METHOD_ARGS_TYPE info) {
	dlib::matrix<PT> img;
	FF_TRY_UNWRAP_ARGS(
		"PyramidUp",
		CT::Converter::arg(0, &img, info)
	);

	dlib::matrix<PT> out;
	dlib::assign_image(out, img);
	dlib::pyramid_up(out);
	info.GetReturnValue().Set(CT::Converter::wrap(out));
};

NAN_METHOD(Utils::PyramidUp) {
	if (ImageGray::Converter::hasInstance(info[0])) {
		pyramidUp<unsigned char, ImageGray>(info);
	}
	else if (CvImage::Converter::hasInstance(info[0])) {
		pyramidUp<dlib::bgr_pixel, CvImage>(info);
	}
	else {
		pyramidUp<dlib::rgb_pixel, ImageRGB>(info);
	}
};


template<class PT, class CT>
void Utils::resizeImage(Nan::NAN_METHOD_ARGS_TYPE info) {
	dlib::matrix<PT> img;
	double scale;
	FF_TRY_UNWRAP_ARGS(
		"ResizeImage",
		CT::Converter::arg(0, &img, info)
		|| DoubleConverter::arg(1, &scale, info)
	);
	dlib::matrix<PT> out;
	dlib::assign_image(out, img);
	dlib::resize_image(scale, out);
	info.GetReturnValue().Set(CT::Converter::wrap(out));
};

NAN_METHOD(Utils::ResizeImage) {
	if (ImageGray::Converter::hasInstance(info[0])) {
		resizeImage<unsigned char, ImageGray>(info);
	}
	else if (CvImage::Converter::hasInstance(info[0])) {
		resizeImage<dlib::bgr_pixel, CvImage>(info);
	}
	else {
		resizeImage<dlib::rgb_pixel, ImageRGB>(info);
	}
};

NAN_METHOD(Utils::CvImageToImageRGB) {
	dlib::matrix<dlib::bgr_pixel> img;
	FF_TRY_UNWRAP_ARGS(
		"CvImageToImageRGB",
		CvImage::Converter::arg(0, &img, info)
	);
	dlib::matrix<dlib::rgb_pixel> out;
	dlib::assign_image(out, img);
	info.GetReturnValue().Set(ImageRGB::Converter::wrap(out));
};

NAN_METHOD(Utils::HitEnterToContinue) {
	std::getchar();
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
		"ExtractImageChips",
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

NAN_METHOD(Utils::JitterImage) {
	dlib::matrix<dlib::rgb_pixel> img;
	int numJitters;
	FF_TRY_UNWRAP_ARGS(
		"JitterImage",
		ImageRGB::Converter::arg(0, &img, info)
		|| IntConverter::arg(1, &numJitters, info)
	);

	dlib::rand rnd;
	std::vector<dlib::matrix<dlib::rgb_pixel>> out;
	for (int i = 0; i < numJitters; i++)
		out.push_back(dlib::jitter_image(img, rnd));
	info.GetReturnValue().Set(ObjectArrayConverter<ImageRGB, dlib::matrix<dlib::rgb_pixel>>::wrap(out));
};

NAN_METHOD(Utils::Mean) {
	std::vector<dlib::matrix<double>> arr;
	bool didThrow = ObjectArrayConverter<Array, dlib::matrix<double>>::arg(0, &arr, info);
	FF_TRY_UNWRAP_ARGS(
		"Mean",
		didThrow
	);

	dlib::matrix<double> mean = dlib::matrix_cast<double>(dlib::mean(dlib::mat(arr)));
	info.GetReturnValue().Set(Array::Converter::wrap(mean));
};

NAN_METHOD(Utils::Distance) {
	dlib::matrix<double> arr1, arr2;
	FF_TRY_UNWRAP_ARGS(
		"Distance",
		Array::Converter::arg(0, &arr1, info)
		|| Array::Converter::arg(1, &arr2, info)
	);

	if (arr1.size() != arr2.size()) {
		FF_RETHROW("Utils::Distance - arrays must have same size");
	}

	std::vector<double> vec1 = Array::toVec(arr1), vec2 = Array::toVec(arr2);
	double distance = 0.0;
	for (int i = 0; i < (int)vec1.size(); i++) {
		double diff = vec1.at(i) - vec2.at(i);
		distance += diff * diff;
	}
	info.GetReturnValue().Set(std::sqrt(distance));
};

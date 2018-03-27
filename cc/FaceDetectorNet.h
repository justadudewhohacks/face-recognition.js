#include "Converters.h"
#include <dlib/dnn.h>
#include "CvImage.h"
#include "ImageRGB.h"

#ifndef __FACEREC_FACEDETECTORNET_H__
#define __FACEREC_FACEDETECTORNET_H__

class FaceDetectorNet : public Nan::ObjectWrap {
public:
	// definitions from https://github.com/davisking/dlib/blob/master/examples/dnn_mmod_face_detection_ex.cpp
	template <long num_filters, typename SUBNET> using con5d = dlib::con<num_filters, 5, 5, 2, 2, SUBNET>;
	template <long num_filters, typename SUBNET> using con5 = dlib::con<num_filters, 5, 5, 1, 1, SUBNET>;

	template <typename SUBNET> using downsampler = dlib::relu<dlib::affine<con5d<32, dlib::relu<dlib::affine<con5d<32, dlib::relu<dlib::affine<con5d<16, SUBNET>>>>>>>>>;
	template <typename SUBNET> using rcon5 = dlib::relu<dlib::affine<con5<45, SUBNET>>>;

	using net_type = dlib::loss_mmod<dlib::con<1, 9, 9, 1, 1, rcon5<rcon5<rcon5<downsampler<dlib::input_rgb_image_pyramid<dlib::pyramid_down<6>>>>>>>>;
	

	net_type net;

	static NAN_MODULE_INIT(Init);
	static NAN_METHOD(New);

	template<class PT, class CT>
	struct DetectWorker;
	static NAN_METHOD(Detect);
	static NAN_METHOD(DetectAsync);

	typedef FaceDetectorNet::DetectWorker<dlib::bgr_pixel, CvImage> DetectWorkerBGR;
	typedef FaceDetectorNet::DetectWorker<dlib::rgb_pixel, ImageRGB> DetectWorkerRGB;


	static Nan::Persistent<v8::FunctionTemplate> constructor;

	net_type* getNativeObjectPtr() { return &net; }
	net_type getNativeObject() { return net; }

	typedef InstanceConverter<FaceDetectorNet, net_type> Converter;

	static const char* getClassName() {
		return "FaceDetectorNet";
	}
};

#endif
#include "GenericImageBase.h"

#ifndef __FACEREC_GENERICIMAGE_H__
#define __FACEREC_GENERICIMAGE_H__

template <typename pixel_type>
class GenericImage {
public:
	typedef pixel_type type;

	std::shared_ptr<GenericImageBase<pixel_type>> pBase;

	GenericImage() {
	}

	GenericImage(dlib::matrix<pixel_type> img) {
		this->img = img;
	}

	GenericImage(int rows, int cols, int widthStep, int elemSize, const char* data) {
		pBase = std::make_shared<GenericImageBase<pixel_type>>(rows, cols, widthStep, elemSize, data);
		this->img = dlib::mat(*pBase.get());
	}

	dlib::matrix<pixel_type>* getImagePtr() {
		return &(this->img);
	}

	dlib::matrix<pixel_type> getImage() {
		return this->img;
	}

private:
	dlib::matrix<pixel_type> img;
};

#endif
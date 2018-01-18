#include "Converters.h"
#include "dlib/matrix.h"

#ifndef __FACEREC_GENERICIMAGEBASE_H__
#define __FACEREC_GENERICIMAGEBASE_H__

template <typename pixel_type>
class GenericImageBase {
public:
	typedef pixel_type type;
	typedef dlib::default_memory_manager mem_manager_type;

	GenericImageBase(int rows, int cols, int widthStep, int elemSize, const char* data) {
		this->rows = rows;
		this->cols = cols;
		this->widthStep = widthStep;

		size_t dataSize = elemSize * rows * cols;
		this->data = new char[dataSize];
		memcpy(this->data, data, dataSize);
	}

	~GenericImageBase() {
		delete[] this->data;
	}

	unsigned long size() const {
		return static_cast<unsigned long>(rows*cols);
	}

	inline pixel_type* operator[](const long row) {
		return reinterpret_cast<pixel_type*>(this->data + this->widthStep * row);
	}

	inline const pixel_type* operator[](const long row) const {
		return reinterpret_cast<const pixel_type*>(this->data + this->widthStep * row);
	}

	inline const pixel_type& operator()(const long row, const long column) const {
		return (*this)[row][column];
	}

	inline pixel_type& operator()(const long row, const long column) {
		return (*this)[row][column];
	}

	long nr() const {
		return (long)rows;
	}

	long nc() const {
		return (long)cols;
	}

	long width_step() const {
		return (long)widthStep;
	}

private:
	int rows;
	int cols;
	int widthStep;
	char* data = 0;
};

namespace dlib {

	template <typename T>
	const matrix_op<op_array2d_to_mat<GenericImageBase<T> > > mat(const GenericImageBase<T>& m) {
		typedef op_array2d_to_mat<GenericImageBase<T> > op;
		return matrix_op<op>(op(m));
	}

	template <typename T>
	struct image_traits<GenericImageBase<T> > {
		typedef T pixel_type;
	};

	template <typename T>
	inline long num_rows(const GenericImageBase<T>& img) {
		return img.nr();
	}

	template <typename T>
	inline long num_columns(const GenericImageBase<T>& img) {
		return img.nc();
	}

	template <typename T>
	inline void* image_data(GenericImageBase<T>& img) {
		if (img.size() != 0)
			return &img[0][0];
		else
			return 0;
	}

	template <typename T> inline const void* image_data(const GenericImageBase<T>& img) {
		if (img.size() != 0)
			return &img[0][0];
		else
			return 0;
	}

	template <typename T>
	inline long width_step(const GenericImageBase<T>& img) {
		return img.width_step();
	}

}

#endif
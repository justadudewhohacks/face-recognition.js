{
	"targets": [{
		"target_name": "facerec",
		"win_delay_load_hook": "false", # fix for LNK1194
		# TODO: from config.h
		"defines": [
			"DLIB_PNG_SUPPORT",
			"DLIB_JPEG_SUPPORT"
		],
		"include_dirs" : [
			"<!(node -e \"require('nan')\")",
			"<!(node -e \"require('native-node-utils')\")",
			"<!@(node ./lib/includes.js)",
			"cc"
		],
		"libraries": [
			"<!@(node ./lib/libs.js)"
		],
		"sources": [
			"cc/index.cc",
			"cc/ImageRGB.cc",
			"cc/ImageGray.cc",
			"cc/CvImage.cc",
			"cc/Rect.cc",
			"cc/MmodRect.cc",
			"cc/FullObjectDetection.cc",
			"cc/Point.cc",
			"cc/Array.cc",
			"cc/ChipDetails.cc",
			"cc/utils.cc",
			"cc/ImageWindow.cc",
			"cc/ShapePredictor.cc",
			"cc/FrontalFaceDetector.cc",
			"cc/FaceDetectorNet.cc",
			"cc/FaceRecognizerNet.cc"
		],

		"cflags" : [
			"-std=c++11"
		],
		"cflags!" : [
			"-fno-exceptions"
		],
		"cflags_cc!": [

			# dlib requires run-time type information
			"-fno-rtti",

			"-fno-exceptions"
		],
		"xcode_settings": {
			"OTHER_CFLAGS": [
				"-std=c++11",
				"-stdlib=libc++"
			],
			"GCC_ENABLE_CPP_EXCEPTIONS": "YES",
			"GCC_ENABLE_CPP_RTTI": "YES"
		},

		"conditions": [
			[ "OS==\"win\"", {
				"cflags": [
					"-Wall"
				],
				"defines": [
					"WIN",
					"_HAS_EXCEPTIONS=1"
				],
				"msvs_settings": {
					"VCCLCompilerTool": {
						"ExceptionHandling": "2",
						"RuntimeLibrary": "2",
						#"RuntimeTypeInfo": "true",
						"AdditionalOptions": [
							"/MD",

							# dlib requires run-time type information
							"/GR"


						]
					},
				}
			}]
		]
	}]
}

{
	"targets": [{
		"target_name": "dfacejs",
		# TODO: from config.h
		"defines": [
			"DLIB_PNG_SUPPORT",
			"DLIB_JPEG_SUPPORT"
		],
		"include_dirs" : [
			"<!(node -e \"require('nan')\")",
			"<!@(node ./lib/includes.js)",
			"cc"
		],
		"libraries": [
			"<!@(node ./lib/libs.js)"
		],
		"sources": [
			"cc/dfacejs.cc",
			"cc/ImageRGB.cc",
			"cc/ImageGray.cc",
			"cc/Rect.cc",
			"cc/utils.cc",
			"cc/ImageWindow.cc",
			"cc/facedetection.cc",
			"cc/FrontalFaceDetector.cc"
		],

		"cflags" : [
			"-std=c++11"
		],
		"cflags!" : [
			"-fno-exceptions"
		],
		"cflags_cc!": [
			"-fno-rtti",
			"-fno-exceptions"
		],
		"xcode_settings": {
			"OTHER_CFLAGS": [
				"-std=c++11",
				"-stdlib=libc++"
			],
			"GCC_ENABLE_CPP_EXCEPTIONS": "YES"
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
						# TODO: figure out how to link with static lib without overriding linker flags
						# "AdditionalOptions": [
							# "/MD"
						# ]
					},
				}
			}]
		]
	}]
}

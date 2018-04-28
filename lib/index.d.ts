/**
 * A wrapper on an array of floats/doubles
 * @export
 * @class Array
 */
export class Array {

    /**
     * Create an instance of Array
     * @param  {number[]} data a javascript array of doubles/floats
     */
    constructor(data: number[]);

    /**
     * Get the underlying javascript array
     * @returns number[] the data
     */
    getData(): number[];

    /**
     * The lenght of the underlying data
     */
    readonly length:number;
}

/**
 * Represents the ImageGray object
 * @export
 * @interface ImageGray
 */
export interface ImageGray {

    /**
     * Get the number of columns
     * @type {number}
     * @memberof ImageGray
     */
    readonly cols: number;

    /**
     * Get the number of rows
     * @type {number}
     * @memberof ImageGray
     */
    readonly rows: number;
}

/**
 * Represents the ImageRGB object
 * @export
 * @interface ImageRGB
 */
export interface ImageRGB {

    /**
     * Get the number of columns
     * @type {number}
     * @memberof ImageRGB
     */
    readonly cols: number;

    /**
     * Get the number of rows
     * @type {number}
     * @memberof ImageRGB
     */
    readonly rows: number;

    /**
     * Convert the image to ImageGray
     * @returns {ImageGray} the new ImageGray
     * @memberof ImageRGB
     */
    toGray(): ImageGray;
}

/**
 * Represents the CvImageWrap object
 * @export
 * @interface CvImage
 */
export class CvImage {
    /**
     * Get the number of columns
     * @type {number}
     * @memberof ImageRGB
     */
    readonly cols: number;

    /**
     * Get the number of rows
     * @type {number}
     * @memberof ImageRGB
     */
    readonly rows: number;

    constructor(cvMat: any);
}

/**
 * Represents the region in the image using a rectangle
 * @export
 * @class Rect
 */
export class Rect {

    /**
     * Creates an instance of Rect.
     * @param {number} left
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     * @memberof Rect
     */
    constructor(left: number, top: number, right: number, bottom: number);

    /**
     * Get the left coordinate of the rectangle
     * @type {number}
     * @memberof Rect
     */
    readonly left: number;

    /**
     * Get the top coordinate of the rectangle
     * @type {number}
     * @memberof Rect
     */
    readonly top: number;

    /**
     * Get the right coordinate of the rectangle
     * @type {number}
     * @memberof Rect
     */
    readonly right: number;

    /**
     * Get the bottom coordinate of the rectangle
     * @type {number}
     * @memberof Rect
     */
    readonly bottom: number;

    /**
     * Get the area of the rectangle
     * @type {number}
     * @memberof Rect
     */
    readonly area: number;
}

/**
 * Represents a point in the image
 * @export
 * @interface Point
 */
export interface Point {

    /**
     * Get the z coordinate of the Point
     * @type {number}
     * @memberof Point
     */
    readonly z: number;

    /**
     * Get the y coordinate of the Point
     * @type {number}
     * @memberof Point
     */
    readonly y: number;

    /**
     * Get the x coordinate of the Point
     * @type {number}
     * @memberof Point
     */
    readonly x: number;
}

/**
 * Represents a rectangle with the confidence score
 * @export
 * @interface MmodRect
 */
export interface MmodRect {

    /**
     * Get the confidence score
     * @type {number}
     * @memberof MmodRect
     */
    readonly confidence: number;

    /**
     * Get the rectangle
     * @type {Rect}
     * @memberof MmodRect
     */
    readonly rect: Rect;
}

/**
 * Represents the FaceDescriptorState object
 * @export
 * @interface FaceDescriptorState
 */
export interface FaceDescriptorState {

    /**
     * Get the className/label for the faces
     * @type {string}
     * @memberof FaceDescriptorState
     */
    className: string;

    /**
     * Get the number of faces
     * @type {number}
     * @memberof FaceDescriptorState
     */
    numFaces: number;
}

/**
 * Represents the FaceDescriptor object
 * @export
 * @interface FaceDescriptor
 */
export interface FaceDescriptor {

    /**
     * Get the className/label for the descriptors
     * @type {string}
     * @memberof FaceDescriptor
     */
    className: string;

    /**
     * Get the array of FaceDescriptors
     * @type {number[][]}
     * @memberof FaceDescriptor
     */
    faceDescriptors: number[][];
}

/**
 * Represents the FacePrediction for a className
 * @export
 * @interface FacePrediction
 */
export interface FacePrediction {

    /**
     * Get the className/label for which the prediction is provided
     * @type {string}
     * @memberof FacePrediction
     */
    className: string;

    /**
     * Get the prediction in terms of distance
     * @type {number}
     * @memberof FacePrediction
     */
    distance: number;
}

/**
 * This object describes where an image chip is to be extracted from within
 * another image. In particular, it specifies that the image chip is
 * contained within the rectangle rect and that prior to extraction the
 * image should be rotated counter-clockwise by angle radians.  Finally,
 * the extracted chip should have rows and columns in it
 * regardless of the shape of rect.  This means that the extracted chip
 * will be stretched to fit via bilinear interpolation when necessary.
 * @export
 * @interface ChipDetails
 */
export interface ChipDetails {
    readonly rect: Rect;
    readonly size: number;
    readonly angle: number;
    readonly cols: number;
    readonly rows: number;
}

/**
 * Provide methods to detect and locate the faces in the image
 * @export
 * @interface FaceDetector
 */
export interface FaceDetector {

    /**
     * Detect the faces in the image and return them as a set of images
     * @param {ImageRGB} img the image in which to look for the faces
     * @param {number} [faceSize] the optional size of the face
     * @returns {ImageRGB[]} an array of images that contain the faces
     * @memberof FaceDetector
     */
    detectFaces(img: ImageRGB, faceSize?: number): ImageRGB[];

    /**
     * Get the region/rectangles for the faces in the provided image
     * @param {ImageRGB} img the image in which to look for the faces
     * @returns {MmodRect[]} the region/rectangle with confidence score
     * @memberof FaceDetector
     */
    locateFaces(img: ImageRGB): MmodRect[];

    /**
     * Get the faces from the image and supplied regions
     * @param {ImageRGB} img the image in which to look for the faces
     * @param {Rect[]} rects the regions where the faces are
     * @param {number} [faceSize] an optional minimum size for the facec
     * @returns {ImageRGB[]} an array of images contains the faces
     * @memberof FaceDetector
     */
    getFacesFromLocations(img: ImageRGB, rects: Rect[], faceSize?: number): ImageRGB[];
}

/**
 * Provide methods to asynchronously detect and locate the faces in the image
 * @export
 * @interface AsyncFaceDetector
 */
export interface AsyncFaceDetector {
    /**
     * Detect the faces in the image and return them as a set of images
     * @param {ImageRGB} img the image in which to look for the faces
     * @param {number} [faceSize] the optional size of the face
     * @returns {Promise<ImageRGB[]>} an array of images that contain the faces
     * @memberof AsyncFaceDetector
     */
    detectFaces(img: ImageRGB, faceSize?: number): Promise<ImageRGB[]>;

    /**
    * Get the region/rectangles for the faces in the provided image
    * @param {ImageRGB} img the image in which to look for the faces
    * @returns {Promise<MmodRect[]>} the region/rectangle with confidence score
    * @memberof AsyncFaceDetector
    */
    locateFaces(img: ImageRGB): Promise<MmodRect[]>;

    /**
     * Get the faces from the image and supplied regions
     * @param {ImageRGB} img the image in which to look for the faces
     * @param {Rect[]} rects the regions where the faces are
     * @param {number} [faceSize] an optional minimum size for the facec
     * @returns {Promise<ImageRGB[]>} an array of images contains the faces
     * @memberof AsyncFaceDetector
     */
    getFacesFromLocations(img: ImageRGB, rects: Rect[], faceSize?: number): Promise<ImageRGB[]>;
}

/**
 * Provide methods to perform Face Recognition
 * @export
 * @interface FaceRecognizer
 */
export interface FaceRecognizer {

    /**
     * Given an image provide the FacePrediction
     * @param {ImageRGB} image the image to be analyzed
     * @returns {FacePrediction[]} the face predictions
     * @memberof FaceRecognizer
     */
    predict(image: ImageRGB): FacePrediction[];

    /**
     *  Given an image provide the best FacePrediction
     * @param {ImageRGB} image the image to be analyzed
     * @param {number} [unknownThreshold] the threshold for the unknown
     * @returns {FacePrediction} the best FacePrediction
     * @memberof FaceRecognizer
     */
    predictBest(image: ImageRGB, unknownThreshold?: number): FacePrediction;

    /**
     * Load the provided descriptors
     * @param {FaceDescriptor[]} descriptors the descriptors to be loaded
     * @memberof FaceRecognizer
     */
    load(descriptors: FaceDescriptor[]): void;

    /**
     * Get the descriptor states
     * @returns {FaceDescriptorState[]} the face descriptor states
     * @memberof FaceRecognizer
     */
    getDescriptorState(): FaceDescriptorState[];

    /**
     * Serializes the FaceDescription
     * @returns {FaceDescriptor[]} an array of FaceDescriptor objects
     * @memberof FaceRecognizer
     */
    serialize(): FaceDescriptor[];

    /**
     * Add the faces for a give class with optional jittering
     * @param {ImageRGB[]} faces the faces to be added to the test data
     * @param {string} className the label/class of for the faces
     * @param {number} [numJitters] the number of jitters to be applied to each face
     * @memberof FaceRecognizer
     */
    addFaces(faces: ImageRGB[], className: string, numJitters?: number): void;

    /**
     * Clears the descriptors
     * @memberof FaceRecognizer
     */
    clear(): void;

    /**
     * Get the 128 representative descriptors for a supplied face
     * @param {ImageRGB | CvImage} face image of the face to evaluate
     * @returns {Number[]} an array of 128 representative descriptors
     */
    getFaceDescriptors(face: ImageRGB | CvImage): Number[];
}

/**
 * Provide methods to asynchrnously perform Face Recognition
 * @export
 * @interface AsyncFaceRecognizer
 */
export interface AsyncFaceRecognizer {

    /**
     * Given an image provide the FacePrediction
     * @param {ImageRGB} image the image to be analyzed
     * @returns {Promise<FacePrediction[]>} the promise containing the FacePredictions
     * @memberof AsyncFaceRecognizer
     */
    predict(image: ImageRGB): Promise<FacePrediction[]>;

    /**
     * Given an image provide the best FacePrediction
     * @param {ImageRGB} image the image to be analyzed
     * @param {number} [unknownThreshold] the threshold for the unknown
     * @returns {Promise<FacePrediction>} the promise containig the best FacePrediction
     * @memberof AsyncFaceRecognizer
     */
    predictBest(image: ImageRGB, unknownThreshold?: number): Promise<FacePrediction>;

    /**
     * Load the raw FaceDescriptors
     * @param {*} rawDescriptors
     * @memberof AsyncFaceRecognizer
     */
    load(rawDescriptors: any): void;

    /**
     * Get the descriptor states
     * @returns {FaceDescriptorState[]} the face descriptor states
     * @memberof AsyncFaceRecognizer
     */
    getDescriptorState(): FaceDescriptorState[];

    /**
     * Serializes the FaceDescription
     * @returns {FaceDescriptor[]} an array of FaceDescriptor objects
     * @memberof AsyncFaceRecognizer
     */
    serialize(): FaceDescriptor[];

    /**
     * Add the faces for a give class with optional jittering
     * @param {ImageRGB[]} faces the faces to be added to the test data
     * @param {string} className the label/class of for the faces
     * @param {number} [numJitters] the number of jitters to be applied to each face
     * @returns {Promise<void>}
     * @memberof AsyncFaceRecognizer
     */
    addFaces(faces: ImageRGB[], className: string, numJitters?: number): Promise<void>;

    /**
     * Clears the descriptors
     * @memberof AsyncFaceRecognizer
     */
    clear(): void;
}

/**
 * Represents the point locations obtained after predicting using the FaceLandmarkPredictor
 * @export
 * @interface FullObjectDetection
 */
export interface FullObjectDetection {

    /**
     *
     * @type {number}
     * @memberof FullObjectDetection
     */
    readonly numParts: number;

    /**
     *
     * @type {Rect}
     * @memberof FullObjectDetection
     */
    readonly rect: Rect;

    /**
     *
     * @returns {Point[]}
     * @memberof FullObjectDetection
     */
    getParts(): Point[];
}

/**
 * Provides methods to get set of point locations that define the pose of the object (face).
 * @export
 * @interface FaceLandmarkPredictor
 */
export interface FaceLandmarkPredictor {

    /**
     * Get the location of important facial landmarks
     * such as the corners of the mouth and eyes, tip of the nose, and so forth.
     * @param {ImageRGB} img the image
     * @param {Rect} rect the region of the image from which to get the landmarks
     * @returns {FullObjectDetection}
     * @memberof FaceLandmarkPredictor
     */
    predict(img: ImageRGB, rect: Rect): FullObjectDetection;

    /**
     * Asynchronously get the location of important facial landmarks
     * such as the corners of the mouth and eyes, tip of the nose, and so forth.
     * @param {ImageRGB} img the image
     * @param {Rect} rect the region of the image from which to get the landmarks
     * @returns {Promise<FullObjectDetection>}
     * @memberof FaceLandmarkPredictor
     */
    predictAsync(img: ImageRGB, rect: Rect): Promise<FullObjectDetection>;
}

/**
 * Provides methods to find human faces that are more or less looking towards the camera.
 *
 * @export
 * @class FrontalFaceDetector
 */
export class FrontalFaceDetector {

    /**
     * Creates an instance of FrontalFaceDetector.
     * @memberof FrontalFaceDetector
     */
    constructor();

    /**
     * Detect the faces in the supplied image
     *
     * See more example related to adjustThreshold parameter here
     * http://dlib.net/face_detector.py.html
     *
     * @param {ImageRGB} img the image in which to detect the faces
     * @param {number} adjustThreshold this optional argument provides the flexibility of detecting more faces by upscaling if value is > 0
     * @returns {Rect[]} the regions for the faces
     * @memberof FrontalFaceDetector
     */
    detect(img: ImageRGB, adjustThreshold?: number): Rect[];
}

/**
 * Helper utility to help exit the process
 * cleanly when it was terminated by Ctrl-C etc
 * @export
 */
export function winKillProcessOnExit(): void;

/**
 * Listen for a keyboard event
 * @export
 */
export function hitEnterToContinue(): void;

/**
 * Load the image from the provide path
 * @export
 * @param {string} path the path to the image file
 * @returns {ImageRGB} the image object
 */
export function loadImage(path: string): ImageRGB;

/**
 * Save the image to the provided path
 * @export
 * @param {string} path the path of the image file
 * @param {(ImageRGB | ImageGray)} image the image to be saved
 * @param {boolean} [isJpeg] true if the image is JPEG
 */
export function saveImage(path: string, image: ImageRGB | ImageGray, isJpeg?: boolean): void;

/**
 * Generate an image that has the input images tiled
 * @export
 * @param {ImageRGB[]} images the images to be put in the tiles
 * @returns {ImageRGB} the tiled image
 */
export function tileImages(images: ImageRGB[]): ImageRGB;

/**
 * Get the upscaled version of the supplied image
 * @export
 * @param {ImageRGB} image the image to be upscaled
 * @returns {ImageRGB} the upscaled image
 */
export function pyramidUp(image: ImageRGB): ImageRGB;

/**
 * Resize the image using the provide scale
 * @export
 * @param {ImageRGB} image the image to be resized
 * @param {number} scale the scale to reize
 * @returns {ImageRGB} the resized image
 */
export function resizeImage(image: ImageRGB, scale: number): ImageRGB;

/**
 * Converts an CvImage wrap to an ImageRGB
 * @export
 * @param {CvImage} image the image to be converted
 * @returns {ImageRGB} the converted image
 */
export function cvImageToImageRGB(image: CvImage): ImageRGB;

/**
 * Jitter the images. This may help create more training data for your images
 * @export
 * @param {ImageRGB} image the image on which jittering is applied
 * @param {number} numJitters the number of jitters
 * @returns {ImageRGB[]} the array of images returned after applying the jitters
 */
export function jitterImage(image: ImageRGB, numJitters: number): ImageRGB[];

/**
 * This function assumes detections contains a human face detection with face parts
 * annotated using the annotation scheme from the iBUG 300-W face landmark
 * dataset or a 5 point face annotation.  Given these assumptions, it creates a
 * ChipDetails object that will extract a copy of the face that has been
 * rotated upright, centered, and scaled to a standard size when given to
 * extractImageChips()
 * @export
 * @param {FullObjectDetection[]} detections an array of FullObjectDetection
 * @returns {ChipDetails[]} an array of ChipDetails
 */
export function getFaceChipDetails(detections: FullObjectDetection[], faceSize?: number, padding?: number): ChipDetails[];

/**
 * This function extracts "chips" from an image. That is, it takes a list of
 * rectangular sub-windows (i.e. chips) within an image and extracts those
 * sub-windows, storing each into its own image.  It also scales and rotates the
 * image chips according to the instructions inside each chip_details object.
 * @export
 * @param {ImageRGB} image the image from which to extract the chips
 * @param {ChipDetails[]} chipDetails the details of the chip
 * @returns {ImageRGB[]} an array of images
 */
export function extractImageChips(image: ImageRGB, chipDetails: ChipDetails[]): ImageRGB[];

/**
 * Compute the mean of the provide array of Array
  * @export
 * @param {Array[]} input the array of Array on which to compute the mean
 * @returns {Array} the mean
 */
export function mean(input:Array[]): Array;

/**
 * Compute the distance between two Array
 * @export
 * @param {Array} input1 the first input
 * @param {Array} input2 the second input
 * @returns {number} the distance between input1 and input2
 */
export function distance(input1:Array, input2:Array): number;

/**
 * Get the FaceDetector object
 * @export
 * @returns {FaceDetector}
 */
export function FaceDetector(useFaceLandmarks68Model?: boolean): FaceDetector;

/**
 * Get the FaceRecognizer object
 * @export
 * @returns {FaceRecognizer}
 */
export function FaceRecognizer(): FaceRecognizer;

/**
 * Get the FaceLandmark5Predictor object
 * @export
 * @returns {FaceLandmarkPredictor}
 */
export function FaceLandmark5Predictor(): FaceLandmarkPredictor;

/**
 * Get the FaceLandmark68Predictor object
 * @export
 * @returns {FaceLandmarkPredictor}
 */
export function FaceLandmark68Predictor(): FaceLandmarkPredictor;

/**
 * Get the Asynchronous FaceDetector object
 * @export
 * @returns {AsyncFaceDetector}
 */
export function AsyncFaceDetector(useFaceLandmarks68Model?: boolean): AsyncFaceDetector;

/**
 * Get the Asynchronous FaceRecoginzer object
 * @export
 * @returns {AsyncFaceRecognizer}
 */
export function AsyncFaceRecognizer(): AsyncFaceRecognizer;

/**
 * Creates a window that can display an image
 * @export
 * @class ImageWindow
 */
export class ImageWindow {

    /**
     * Creates an instance of ImageWindow.
     * @memberof ImageWindow
     */
    constructor();

    /**
     * Close the window
     * @memberof ImageWindow
     */
    close(): void;

    /**
     * Sets the image to be displayed in the window
     * @param {(ImageRGB | ImageGray)} image the image to be displayed
     * @memberof ImageWindow
     */
    setImage(image: ImageRGB | ImageGray): void;

    /**
     * Adds an overlay on the top of the image
     *
     * @param {Rect} rect specify the dimensions of the overlay
     * @param {string} [label] specify the (optional) label to be displayed
     * @memberof ImageWindow
     */
    addOverlay(rect: Rect, label?: string): void;

    /**
     * Remove/Clear the overlay
     * @memberof ImageWindow
     */
    clearOverlay(): void;

    /**
     * Set the size of the window
     * @param {number} width width of the window
     * @param {number} height height of the window
     * @memberof ImageWindow
     */
    setSize(width: number, height: number): void;

    /**
     * Display all the detected faces
     * @param {FullObjectDetection[]} shapes
     * @memberof ImageWindow
     */
    renderFaceDetections(shapes: FullObjectDetection[]): void;
}

export class ShapePredictor {
    constructor(faceLandmarksModelFilePath: string);

    predict(image: ImageRGB, rect: Rect): FullObjectDetection
    predictAsync(image: ImageRGB, rect: Rect): Promise<FullObjectDetection>
}

export class FaceDetectorNet {
    constructor(faceDetectionModelFilePath: string);

    detect(image: ImageRGB): MmodRect
    detectAsync(image: ImageRGB): Promise<MmodRect>
}

export class FaceRecognizerNet {
    constructor(faceRecognitionModelFilePath: string);

    computeFaceDescriptor(faceImage: ImageRGB): Array
    computeFaceDescriptorAsync(faceImage: ImageRGB): Promise<Array>
}

export const models: {
    faceLandmarks5Model: string;
    faceLandmarks68Model: string;
    faceDetectionModel: string;
    faceRecognitionModel: string;
}

export function withCv(cv: any): void;
export function toCvRect(dlibRect: Rect): any;
export function fromCvRect(cvRect: any): Rect;
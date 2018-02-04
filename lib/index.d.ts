// TODO : add the documentation

export interface ImageGray {
    readonly cols: number;
    readonly rows: number;
}

export interface ImageRGB {
    readonly cols: number;
    readonly rows: number;
    toGray(): ImageGray;
}

export class Rect {
    constructor(left: number, top: number, right: number, bottom: number);
    readonly left: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly area: number;
}

export interface Point {
    readonly z: number;
    readonly y: number;
    readonly x: number;
}

export interface MmodRect {
    readonly confidence: number;
    readonly rect: Rect;
}

export interface FaceDescriptorState {
    className: string;
    numFaces: number;
}

export interface FaceDescriptor {
    className: string;
    faceDescriptors: any[];
}

export interface FacePrediction {
    className: string;
    distance: number;
}

export interface ChipDetails {
    readonly rect: Rect;
    readonly size: number;
    readonly angle: number;
    readonly cols: number;
    readonly rows: number;
}

export interface FaceDetector {
    detectFaces(img: ImageRGB, faceSize?: number): ImageRGB[];
    locateFaces(img: ImageRGB): MmodRect[];
    getFacesFromLocations(img: ImageRGB, rects: Rect[], faceSize?: number): ImageRGB[];
}

export interface AsyncFaceDetector {
    detectFaces(img: ImageRGB, faceSize?: number): Promise<ImageRGB[]>;
    locateFaces(img: ImageRGB): Promise<MmodRect[]>;
    getFacesFromLocations(img: ImageRGB, rects: Rect[], faceSize?: number): Promise<ImageRGB[]>;
}

export interface FaceRecognizer {
    predict(image: ImageRGB): FacePrediction[];
    predictBest(image: ImageRGB, unknownThreshold?: number): FacePrediction;
    load(rawDescriptors: any): void;
    getDescriptorState(): FaceDescriptorState[];
    serialize(): FaceDescriptor[];
    addFaces(faces: ImageRGB[], className: string, numJitters?: number): void;
}

export interface AsyncFaceRecognizer {
    predict(image: ImageRGB): Promise<FacePrediction[]>;
    predictBest(image: ImageRGB, unknownThreshold?: number): Promise<FacePrediction>;
    load(rawDescriptors: any): void;
    getDescriptorState(): FaceDescriptorState[];
    serialize(): FaceDescriptor[];
    addFaces(faces: ImageRGB[], className: string, numJitters?: number): Promise<void>;
}

export interface FullObjectDetection {
    readonly numParts: number;
    readonly rect: Rect;
    getParts(): Point[];
}

export interface FaceLandmarkPredictor {
    predict(img: ImageRGB, rect: Rect): FullObjectDetection;
    predictAsync(img: ImageRGB, rect: Rect): Promise<FullObjectDetection>;
}

export class FrontalFaceDetector {
    constructor();
    detect(img: ImageRGB): Rect[];
}

export function winKillProcessOnExit(): void;
export function hitEnterToContinue(): void;

export function loadImage(path: string): ImageRGB;
export function saveImage(path: string, image: ImageRGB | ImageGray, isJpeg?: boolean): void;
export function tileImages(images: ImageRGB[]): ImageRGB;
export function pyramidUp(image: ImageRGB): ImageRGB;
export function resizeImage(image: ImageRGB, scale: number): ImageRGB;
export function jitterImage(image: ImageRGB, numJitters: number): ImageRGB[];
export function getFaceChipDetails(detections: FullObjectDetection[]): ChipDetails[];
export function extractImageChips(image: ImageRGB, chipDetails: ChipDetails[]): ImageRGB[];

export function FaceDetector(): FaceDetector;
export function FaceRecognizer(): FaceRecognizer;
export function FaceLandmark5Predictor(): FaceLandmarkPredictor;
export function FaceLandmark68Predictor(): FaceLandmarkPredictor;
export function AsyncFaceDetector(): AsyncFaceDetector;
export function AsyncFaceRecognizer(): AsyncFaceRecognizer;

export class ImageWindow {
    constructor();
    setImage(image: ImageRGB): void;
    addOverlay(rect: Rect, label?: string): void;
    renderFaceDetections(shapes: FullObjectDetection[]): void;
}
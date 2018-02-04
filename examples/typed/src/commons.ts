import * as path from 'path';
import * as fs from 'fs';
import fr = require('../../../');

export function drawRects(win: fr.ImageWindow, rects: fr.Rect[]) {
    return rects.forEach((rect) => win.addOverlay(rect));
}

export function rescaleRect(rect: fr.Rect, f: number): fr.Rect {
    return new fr.Rect(rect.left * f, rect.top * f, rect.right * f, rect.bottom * f);
}

const dataPath = path.resolve(__dirname, '../../data');
const appdataPath = path.resolve(__dirname, '../../appdata');

export function getDataPath() {
    return dataPath;
}

export function getAppdataPath() {
    return appdataPath;
}

export function ensureAppdataDirExists() {
    if (!fs.existsSync(appdataPath)) {
        fs.mkdirSync(appdataPath);
    }
}

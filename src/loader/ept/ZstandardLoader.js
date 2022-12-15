import {EptBinaryLoader} from "./BinaryLoader.js";
import * as Globals from "../../Globals.js";

export class EptZstandardLoader extends EptBinaryLoader {
    extension() {
        return '.zst';
    }

    workerPath() {
        return Globals.scriptPath + '/workers/EptZstandardDecoderWorker.js';
    }
};


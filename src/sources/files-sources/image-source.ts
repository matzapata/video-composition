import { readFileSync } from "fs";
import { VideoSpecLayout, VideoSpecTransform } from "../../types";
import { Source, SourceProps, SourceType } from "../source";


export class ImageSource implements Source {
    type: SourceType.IMAGE = SourceType.IMAGE
    srcPath: string
    fps: number
    layout: VideoSpecLayout | null
    transformations: VideoSpecTransform[];

    image: Buffer

    constructor(props: SourceProps) {
        this.srcPath = props.srcPath;
        this.layout = props.layout;
        this.transformations = props.transformations;
        this.fps = props.fps

        this.image = readFileSync(this.srcPath)
    }

    getFrameN(frame: number, format: string = "png"): Promise<Buffer | null> {
        // TODO: implement different formats

        // not a function of frame
        return Promise.resolve(this.image)
    }

    getTotalFrames(): number { 
        return 1;
    }

    getAudio(): Promise<Buffer | null> { 
        return Promise.resolve(null);
     }

    getLayout(): VideoSpecLayout | null {
        return this.layout
    }

    getTransformations(): VideoSpecTransform[] {
        return this.transformations
    }
}

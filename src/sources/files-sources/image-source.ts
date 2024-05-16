import { VideoSpecLayout, VideoSpecTransform } from "../../types";
import { FrameFormat, Source, SourceProps, SourceType } from "../source";
import sharp from "sharp";


export class ImageSource implements Source {
    type: SourceType.IMAGE = SourceType.IMAGE
    srcPath: string
    fps: number
    layout: VideoSpecLayout | null
    transformations: VideoSpecTransform[];

    constructor(props: SourceProps) {
        this.srcPath = props.srcPath;
        this.layout = props.layout;
        this.transformations = props.transformations;
        this.fps = props.fps
    }

    getFrameN(frame: number, format: FrameFormat = "png"): Promise<Buffer | null> {
        

        // not a function of frame
        return sharp(this.srcPath).toFormat(format).toBuffer()
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

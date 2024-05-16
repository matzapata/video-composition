import { FfmpegFrameExtractor } from "../../lib/ffmpg-frame-extractor";
import { VideoSpecLayout, VideoSpecTransform } from "../../types";
import { Source, SourceProps, SourceType } from "../source";


export class VideoSource implements Source {
    type: SourceType.VIDEO = SourceType.VIDEO
    srcPath: string
    fps: number
    layout: VideoSpecLayout | null
    transformations: VideoSpecTransform[]

    framesExtractor: FfmpegFrameExtractor

    constructor(props: SourceProps) {
        this.srcPath = props.srcPath;
        this.layout = props.layout;
        this.transformations = props.transformations;
        this.fps = props.fps

        this.framesExtractor = new FfmpegFrameExtractor({
            fps: this.fps,
            source: this.srcPath,
        })
    }

    getFrameN(n: number, format: string = "png"): Promise<Buffer | null> {
        return this.framesExtractor.getFrameN(n)
            .catch((err) => {
                console.error(`Error getting frame ${n} from ${this.srcPath}: ${err}`)
                return null
            })
    }

    getTotalFrames(): number {
        return this.framesExtractor.getTotalFrames()
    }

    getAudio(): Promise<Buffer | null> {
        throw new Error("Method not implemented.")
    }

    getLayout(): VideoSpecLayout | null {
        return this.layout
    }

    getTransformations(): VideoSpecTransform[] {
        return this.transformations
    }
}

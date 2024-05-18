import { FfmpegFrameExtractor } from "../../lib/ffmpeg-frame-extractor";
import { VideoSpecLayout, VideoSpecTransform } from "../../types";
import { FrameFormat, Source, SourceProps, SourceType } from "../source";


export class VideoSource implements Source {
    name: string;
    type: SourceType.VIDEO = SourceType.VIDEO
    srcPath: string
    fps: number
    layout: VideoSpecLayout
    transformations: VideoSpecTransform[]

    framesExtractor: FfmpegFrameExtractor

    constructor(props: SourceProps) {
        this.name = props.name
        this.srcPath = props.srcPath;
        this.layout = props.layout;
        this.transformations = props.transformations;
        this.fps = props.fps

        this.framesExtractor = new FfmpegFrameExtractor({
            fps: this.fps,
            source: this.srcPath,
        })
    }

    getFrameNumber(n: number, format: FrameFormat = "png"): Promise<Buffer | null> {
        return this.framesExtractor.getFrameN(n, format)
            .catch((err) => {
                console.error(`Error getting frame ${n} from ${this.srcPath}: ${err}`)
                return null
            })
    }

    getFramesCount(): number {
        return this.framesExtractor.getTotalFrames()
    }

    getAudio(): Promise<Buffer | null> {
        throw new Error("Method not implemented.")
    }

    getLayout(): VideoSpecLayout {
        return this.layout
    }

    getTransformations(): VideoSpecTransform[] {
        return this.transformations
    }
}

import { VideoSpecLayout, VideoSpecTransform } from "../../types";
import { Source, SourceType } from "../source";


export class ImageSource implements Source {
    type: SourceType
    totalFrames: number
    framesPath: string // where all the frames, audio, etc are stored
    audioPath: string | null // audio path
    layout: VideoSpecLayout | null
    transformations: VideoSpecTransform[];

    constructor(props: {
        type: SourceType,
        totalFrames: number,
        framesPath: string,
        audioPath: string | null,
        layout: VideoSpecLayout ,
        transformations: VideoSpecTransform[]
    }) {
        this.type = props.type;
        this.totalFrames = props.totalFrames;
        this.framesPath = props.framesPath;
        this.audioPath = props.audioPath;
        this.layout = props.layout;
        this.transformations = props.transformations;
    }

    getPath(): string { throw new Error("Method not implemented.") }
    getFrame(frame: number): string { throw new Error("Method not implemented.") }
    getFrames(): string[] { throw new Error("Method not implemented.") }

    getAudio(): string { throw new Error("Method not implemented.") }
    getLayout(): any { throw new Error("Method not implemented.") }

    getTransformations(): VideoSpecTransform[] {
        return this.transformations
    }
}

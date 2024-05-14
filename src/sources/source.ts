import { VideoSpecLayout, VideoSpecTransform } from "../types"

export enum SourceType {
    IMAGE = "image",
    VIDEO = "video",
}

// Essentially a reference to a source of data that holds frames, audio, layout, etc
export abstract class Source {
    abstract type: SourceType
    abstract totalFrames: number
    abstract framesPath: string // where all the frames, audio, etc are stored
    abstract audioPath: string | null // audio path
    abstract layout: VideoSpecLayout | null 
    abstract transformations: VideoSpecTransform[]

    abstract getPath(): string
    abstract getFrame(frame: number): string
    abstract getFrames(): string[]
    abstract getAudio(): string
    abstract getLayout(): any
    abstract getTransformations(): VideoSpecTransform[]
}

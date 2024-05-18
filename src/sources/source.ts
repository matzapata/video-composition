import { FormatEnum } from "sharp"
import { VideoSpecLayout, VideoSpecTransform } from "../types"

export enum SourceType {
    IMAGE = "image",
    VIDEO = "video",
}

export interface SourceProps {
    fps: number,
    name: string,
    srcPath: string,
    layout: VideoSpecLayout,
    transformations: VideoSpecTransform[]
}

export type FrameFormat = keyof FormatEnum

// Essentially a reference to a source of data that holds frames, audio, layout, etc
export abstract class Source {
    abstract name: string
    abstract type: SourceType
    abstract srcPath: string
    abstract fps: number
    abstract layout: VideoSpecLayout
    abstract transformations: VideoSpecTransform[]

    // get the total number of frames in the source
    abstract getFramesCount(): number
    
    // get a specific frame from the source
    abstract getFrameNumber(n: number, format?: FrameFormat): Promise<Buffer | null>

    // get the audio from the source
    abstract getAudio(): Promise<Buffer | null>

    // get the layout of the source
    abstract getLayout(): VideoSpecLayout

    // get the transformations of the source
    abstract getTransformations(): VideoSpecTransform[]
}

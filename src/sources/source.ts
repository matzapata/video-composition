import { FormatEnum } from "sharp"
import { VideoSpecLayout, VideoSpecTransform } from "../types"

export enum SourceType {
    IMAGE = "image",
    VIDEO = "video",
}

export interface SourceProps {
    srcPath: string,
    fps: number,
    layout: VideoSpecLayout,
    transformations: VideoSpecTransform[]
}

export type FrameFormat = keyof FormatEnum

// Essentially a reference to a source of data that holds frames, audio, layout, etc
export abstract class Source {
    abstract type: SourceType
    abstract srcPath: string
    abstract fps: number
    abstract layout: VideoSpecLayout | null
    abstract transformations: VideoSpecTransform[]

    abstract getTotalFrames(): number
    abstract getFrameN(n: number, format?: FrameFormat): Promise<Buffer | null>

    abstract getAudio(): Promise<Buffer | null>

    abstract getLayout(): VideoSpecLayout | null

    abstract getTransformations(): VideoSpecTransform[]
}

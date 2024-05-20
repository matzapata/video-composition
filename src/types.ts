import { SourceType } from "./sources/source"
import { TransformationData } from "./transformations/transformation"

export interface VideoSpecTransform {
    type: string,
    data: TransformationData, 
}

export interface VideoSpecLayout {
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius?: number,
    borderWidth?: number,
    borderColor?: string,
    zIndex?: number,
}

export interface VideoSpecSource {
    name: string,
    type: SourceType,
    src: string,
    start_at?: number,
    layout: VideoSpecLayout,
    transform: VideoSpecTransform[],
}

export interface VideoSpec {
    fps: number
    duration: number,
    sources: VideoSpecSource[]
}
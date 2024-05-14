import { SourceType } from "./sources/source"

export interface VideoSpecTransform {
    type: string,
    data: any, // TODO: add types
}

export interface VideoSpecLayout {
    x: number,
    y: number,
    width: number,
    height: number,
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
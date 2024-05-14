
export enum TransformationType {
    CROP = "crop",
    ZOOM = "zoom",
}

export abstract class FrameTransformationStrategy {
    abstract type: TransformationType

    abstract apply(src: string, dst: string, data: any): Promise<void>
}
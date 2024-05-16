
export enum TransformationType {
    CROP = "crop",
    ZOOM = "zoom",
}

export abstract class FrameTransformationStrategy {
    abstract type: TransformationType

    abstract apply(src: Buffer, data: any): Promise<Buffer>
}
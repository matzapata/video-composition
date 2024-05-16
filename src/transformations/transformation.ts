import { CropStrategyData } from "./strategies/crop-strategy"
import { ZoomStrategyData } from "./strategies/zoom-strategy";

export enum TransformationType {
    CROP = "crop",
    ZOOM = "zoom",
}

export type TransformationData = CropStrategyData | ZoomStrategyData;

export interface TransformationCtx { 
    currentFrame: number,
    totalFrames: number,
}

export abstract class FrameTransformationStrategy {
    abstract type: TransformationType

    abstract apply(src: Buffer, data: TransformationData, ctx?: TransformationCtx): Promise<Buffer>
}
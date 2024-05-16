import { FrameTransformationStrategy, TransformationCtx, TransformationType } from "../transformation";

export interface ZoomStrategyData {
    factor: number
}

export class ZoomStrategy implements FrameTransformationStrategy {
    type = TransformationType.ZOOM

    apply(src: Buffer, data: ZoomStrategyData, ctx?: TransformationCtx): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
}
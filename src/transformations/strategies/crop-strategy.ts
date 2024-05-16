import sharp from "sharp";
import { FrameTransformationStrategy, TransformationCtx, TransformationType } from "../transformation";

export interface CropStrategyData {
    left: number,
    top: number,
    width: number,
    height: number,
}

export class CropStrategy implements FrameTransformationStrategy {
    type = TransformationType.CROP

    apply(src: Buffer, data: CropStrategyData, ctx?: TransformationCtx): Promise<Buffer> {
        return sharp(src).extract(data).toBuffer()
    }
}

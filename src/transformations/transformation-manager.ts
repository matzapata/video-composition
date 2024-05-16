import { ZoomStrategy } from "./strategies/zoom-strategy";
import { CropStrategy } from "./strategies/crop-strategy";
import { FrameTransformationStrategy, TransformationCtx, TransformationType } from "./transformation";
import { VideoSpecTransform } from "../types";

class TransformationsManager {

    constructor(private readonly strategies: { 
        [key in TransformationType]: FrameTransformationStrategy
    }) {}

   async  apply(frame: Buffer, transformations: VideoSpecTransform[], ctx?: TransformationCtx): Promise<Buffer> {
        for (const transformation of transformations) {
            const strategy = this.strategies[transformation.type as TransformationType]
            frame = await strategy.apply(frame, transformation.data, ctx)
        }

        return frame
    }

}

export const transformationsManager = new TransformationsManager({
    [TransformationType.CROP]: new CropStrategy(),
    [TransformationType.ZOOM]: new ZoomStrategy(),
})

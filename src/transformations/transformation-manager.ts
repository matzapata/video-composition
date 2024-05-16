import { ZoomStrategy } from "./strategies/zoom-strategy";
import { CropStrategy } from "./strategies/crop-strategy";
import { FrameTransformationStrategy, TransformationType } from "./transformation";
import { Source } from "../sources/source";
import { SourcesFactory } from "../sources/source-factory";

class TransformationsManager {

    constructor(private readonly strategies: { 
        [key in TransformationType]: FrameTransformationStrategy
    }) {}

   async  apply(buffer: Buffer, frameN: number, transformations: any[]): Promise<Buffer> {
       // TODO: Implement a better path generation

        // TODO: use promise.all
        // apply transformations per frame and store in outPath
        // for (const frame of source.getFrames()) {
        //     for (const transformation of source.transformations) {
        //         const strategy = this.strategies[transformation.type as TransformationType]
        //         await strategy.apply(frame, outPath, transformation.data)
        //     }
        // }

        throw new Error("Method not implemented.");
    }

}

export const transformationsManager = new TransformationsManager({
    [TransformationType.CROP]: new CropStrategy(),
    [TransformationType.ZOOM]: new ZoomStrategy(),
})

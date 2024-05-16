import { FrameTransformationStrategy, TransformationType } from "../transformation";


export class CropStrategy implements FrameTransformationStrategy {
    type = TransformationType.CROP

    apply(src: Buffer, data: any): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
}

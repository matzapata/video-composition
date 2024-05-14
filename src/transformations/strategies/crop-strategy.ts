import { FrameTransformationStrategy, TransformationType } from "../transformation";


export class CropStrategy implements FrameTransformationStrategy {
    type = TransformationType.CROP

    apply(src: string, dst: string, data: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

import { FrameTransformationStrategy, TransformationType } from "../transformation";


export class ZoomStrategy implements FrameTransformationStrategy {
    type = TransformationType.ZOOM

    apply(src: Buffer, data: any): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
}
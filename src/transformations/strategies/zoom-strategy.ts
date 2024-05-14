import { FrameTransformationStrategy, TransformationType } from "../transformation";


export class ZoomStrategy implements FrameTransformationStrategy {
    type = TransformationType.ZOOM

    apply(src: string, dst: string, data: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
import sharp from "sharp";
import { FrameTransformationStrategy, TransformationCtx, TransformationType } from "../transformation";

export interface ZoomStrategyData {
    factor: number
    x?: number
    y?: number
}

export class ZoomStrategy implements FrameTransformationStrategy {
    type = TransformationType.ZOOM


    // TODO: Add animation support
    async apply(src: Buffer, data: ZoomStrategyData, ctx?: TransformationCtx): Promise<Buffer> {
        const frame = await sharp(src)
        const metadata = await frame.metadata()
        if (!metadata.width || !metadata.height) {
            throw new Error("Failed to read metadata")
        }

        // By default, zoom in the center of the image
        const zoomCenterX = data.x ?? metadata.width / 2;
        const zoomCenterY = data.y ?? metadata.height / 2;
    
        // Calculate the width and height of the zoomed region
        const zoomedWidth = metadata.width / data.factor;
        const zoomedHeight = metadata.height / data.factor;
    
        // Calculate the left and top coordinates of the zoomed region
        const left = Math.max(0, zoomCenterX - zoomedWidth / 2);
        const top = Math.max(0, zoomCenterY - zoomedHeight / 2);
    
        // Ensure the zoomed region does not exceed the image boundaries
        const width = Math.min(metadata.width - left, zoomedWidth);
        const height = Math.min(metadata.height - top, zoomedHeight);
    
        return frame.extract({ left, top, width, height }).toBuffer()
    }
}
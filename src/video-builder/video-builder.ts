import { FfmpegVideoBuilder } from "../lib/ffmpeg-video-builder";
import { Source } from "../sources/source";
import { SourcesFactory } from "../sources/source-factory";
import { transformationsManager } from "../transformations/transformation-manager";
import { VideoSpecSource } from "../types";
import { createCanvas, loadImage } from "canvas";

export class VideoBuilder {
    private width: number;
    private height: number;
    private fps: number;
    private outputFile: string;
    private sources: Source[] = [];

    constructor(props: { width: number, height: number, fps: number, outputFile: string }) {
        this.width = props.width;
        this.height = props.height;
        this.fps = props.fps;
        this.outputFile = props.outputFile;
    }

    addSource(source: VideoSpecSource): void {
        this.sources.push(SourcesFactory.create(source.type, {
            name: source.name,
            fps: this.fps,
            srcPath: source.src,
            layout: source.layout,
            transformations: source.transform,
        }));
    }

    async build(): Promise<void> {
        const time = Date.now();
        // start video building
        const video = new FfmpegVideoBuilder({
            fps: this.fps,
            width: this.width,
            height: this.height,
            outputFile: this.outputFile,
        });

        // get largest frame size
        const largestFramesCount = this.sources.reduce((prev, curr) => {
            const totalFrames = curr.getFramesCount();
            console.log('totalFrames', totalFrames);
            return Math.max(prev, totalFrames);
        }, 0);

        const frame = createCanvas(this.width, this.height)
        const ctx = frame.getContext('2d');

        // for each frame transform and draw all sources
        for (let frameN = 0; frameN < largestFramesCount; frameN++) {
            const ft = Date.now();

            const transformedFrames = await Promise.all(this.sources.map(async (source) => {
                const sourceFrame = await source.getFrameNumber(frameN);
                if (!sourceFrame) {
                    console.error('SourceFrame is null', source.name);
                    return { image: null, layout: source.getLayout() };
                }

                // apply transformations to source
                const transformedFrame = await transformationsManager.apply(sourceFrame, source.getTransformations())

                return { image: await loadImage(transformedFrame), layout: source.getLayout() }
            }))

            // sort by z-index
            transformedFrames.sort((a, b) => (a.layout.zIndex ?? 0) - (b.layout.zIndex ?? 0));

            // draw all sources on frame
            transformedFrames.forEach(({ image, layout }) => {
                if (!image) {
                    return;
                }

                const borderRadius = layout.borderRadius ?? 0;
                const borderWidth = layout.borderWidth ?? 0;
                const borderColor = layout.borderColor ?? 'transparent';

                // create layout
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth; 
                ctx.beginPath();
                ctx.moveTo(layout.x + borderRadius, layout.y);
                ctx.lineTo(layout.x + layout.width - borderRadius, layout.y);
                ctx.quadraticCurveTo(layout.x + layout.width, layout.y, layout.x + layout.width, layout.y + borderRadius);
                ctx.lineTo(layout.x + layout.width, layout.y + layout.height - borderRadius);
                ctx.quadraticCurveTo(layout.x + layout.width, layout.y + layout.height, layout.x + layout.width - borderRadius, layout.y + layout.height);
                ctx.lineTo(layout.x + borderRadius, layout.y + layout.height);
                ctx.quadraticCurveTo(layout.x, layout.y + layout.height,layout.x, layout.y + layout.height - borderRadius);
                ctx.lineTo(layout.x, layout.y + borderRadius);
                ctx.quadraticCurveTo(layout.x, layout.y, layout.x + borderRadius, layout.y);
                ctx.closePath();
                ctx.stroke()
                
                // Draw the image inside the layout
                ctx.clip();
                ctx.drawImage(image, layout.x, layout.y, layout.width, layout.height);
                ctx.restore();
            });

            // Add frame to video
            video.addFrame(frame.toBuffer('image/jpeg'));
            console.log(`frame ${frameN} took ${Date.now() - ft} ms to process`);
        }



        console.log('Video built in', (Date.now() - time) / 1000, 'segs');
        await video.end();
        console.log('Video built in', (Date.now() - time) / 1000, 'segs');
    }
}

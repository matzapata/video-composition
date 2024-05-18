import { FfmpegVideoBuilder } from "../lib/ffmpeg-video-builder";
import { Source } from "../sources/source";
import { SourcesFactory } from "../sources/source-factory";
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
        // start video building
        const video = new FfmpegVideoBuilder({
            fps: this.fps,
            width: this.width,
            height: this.height,
            outputFile: this.outputFile,
        });

        // get largest frame size
        console.log('sources', this.sources);
        const largestFramesCount = this.sources.reduce((prev, curr) => {
            const totalFrames = curr.getFramesCount();
            console.log('totalFrames', totalFrames);
            return Math.max(prev, totalFrames);
        }, 0);
        console.log('largestFramesCount', largestFramesCount);


        // for each frame transform and draw all sources
        for (let frameN = 0; frameN < largestFramesCount; frameN++) {
            const frame = createCanvas(this.width, this.height)
            const ctx = frame.getContext('2d');

            for (const source of this.sources) {
                const sourceFrame = await source.getFrameNumber(frameN);
                if (!sourceFrame) {
                    console.log('sourceFrame is null', source.name);
                    continue;
                }

                // TODO: apply transformations

                const image = await loadImage(sourceFrame);
                const layout = source.getLayout();
                ctx.drawImage(image, layout.x, layout.y, layout.width, layout.height);
            }

            // Add frame to video
            video.addFrame(frame.toBuffer());
        }

        video.end();
    }
}

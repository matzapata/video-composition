import { Source } from "../sources/source";
import { SourcesFactory } from "../sources/source-factory";
import { transformationsManager } from "../transformations/transformation-manager";
import { VideoSpecSource } from "../types";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";

export class VideoBuilder {
    private sources: Source[] = [];

    constructor(private fps: number, private duration: number, private width: number, private height: number) { }

    async addSource(source: VideoSpecSource): Promise<void> {
        this.sources.push(await SourcesFactory.create(source.type, {
            fps: this.fps,
            srcPath: source.src,
            layout: source.layout,
            transformations: source.transform,
        }));
    }

    async build(): Promise<void> {

        // TODO: change, iterate over total number of frames
        for (let frame_n = 0; frame_n < this.duration * this.fps; frame_n++) {
            const frame = createCanvas(this.width, this.height)
            const ctx = frame.getContext('2d');

            // TODO: for source of sources
            // TODO: get frame at frame_n
            // TODO: transform
            // TODO: draw

            // for (const source of transformedSources) {
            //     const image = await loadImage(source.getFrame(frame_n));
            //     const layout = source.getLayout();
            //     ctx.drawImage(image, layout.x, layout.y, layout.width, layout.height);
            // }

            // save to file
            const buf = frame.toBuffer();
            writeFileSync(`frame_${frame_n}.png`, buf);
        }

        // TODO: compile frames to video
    }
}

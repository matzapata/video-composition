import { Source } from "../sources/source";
import { transformationsManager } from "../transformations/transformation-manager";
import { VideoSpecSource } from "../types";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";
import { sourceLoader } from "../sources/source-loader";

export class VideoBuilder {
    private sources: Source[] = [];

    constructor(private fps: number, private duration: number, private width: number, private height: number) { }

    async addSource(source: VideoSpecSource): Promise<void> {
        this.sources.push(await sourceLoader.load(
            source.type, {
            src: source.src,
            out: `.tmp/${source.name}`, // TODO: improve name
            fps: this.fps,
            layout: source.layout,
            transformations: source.transform,
        }));
    }

    async build(): Promise<void> {
        // Apply transformations to sources
        const transformedSources = await Promise.all(
            this.sources.map(source => transformationsManager.apply(source))
        );

        // render in canvas
        for (let frame_n = 0; frame_n < this.duration * this.fps; frame_n++) {
            const frame = createCanvas(this.width, this.height)
            const ctx = frame.getContext('2d');

            for (const source of transformedSources) {
                const image = await loadImage(source.getFrame(frame_n));
                const layout = source.getLayout();
                ctx.drawImage(image, layout.x, layout.y, layout.width, layout.height);
            }

            // save to file
            const buf = frame.toBuffer();
            writeFileSync(`frame_${frame_n}.png`, buf);
        }

        // TODO: compile frames to video
    }
}

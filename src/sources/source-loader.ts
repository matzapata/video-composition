
import { VideoSpecLayout, VideoSpecTransform } from "../types";
import { ImageLoader } from "./loaders/image-loader";
import { VideoLoader } from "./loaders/video-loader";
import { Source, SourceType } from "./source";

export interface SourceLoaderProps {
    src: string,
    out: string,
    fps: number,
    layout: VideoSpecLayout,
    transformations: VideoSpecTransform[]
}

export abstract class SourceLoader {
    abstract load(props: SourceLoaderProps): Promise<Source>;
}

// create a source from a video, image, etc
class SourceLoaderManager {

    constructor(private readonly loaders: { [key in SourceType]: SourceLoader }) {
    }

    load(type: SourceType, props: SourceLoaderProps): Promise<Source> {
        const loader = this.loaders[type];
        if (!loader) {
            throw new Error(`No loader for source type ${type}`);
        }

        return loader.load(props);
    }
}

export const sourceLoader = new SourceLoaderManager({
    [SourceType.VIDEO]: new VideoLoader(),
    [SourceType.IMAGE]: new ImageLoader(),
});
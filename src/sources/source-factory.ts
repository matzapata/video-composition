

// copy image to dist folder
// split video in frames, audio, etc

import { ImageSource } from "./files-sources/image-source";
import { VideoSource } from "./files-sources/video-source";
import { Source, SourceProps, SourceType } from "./source";

export class SourcesFactory {
    static create(type: SourceType, props: SourceProps): Source {
        switch (type) {
            case SourceType.IMAGE:
                return new ImageSource(props);
            case SourceType.VIDEO:
                return new VideoSource(props);
            default:
                throw new Error(`No source for type ${type}`);
        }
    }
}


// copy image to dist folder
// split video in frames, audio, etc

import { VideoSpecLayout, VideoSpecTransform } from "../types";
import { ImageSource } from "./files-sources/image-source";
import { VideoSource } from "./files-sources/video-source";
import { Source, SourceType } from "./source";

export class SourcesFactory {
    static create(props: {
        type: SourceType,
        totalFrames: number,
        framesPath: string,
        audioPath: string | null,
        layout: VideoSpecLayout,
        transformations: VideoSpecTransform[]
    }): Source {
        switch (props.type) {
            case SourceType.IMAGE:
                return new ImageSource(props);
            case SourceType.VIDEO:
                return new VideoSource(props);
            default:
                throw new Error(`No source for type ${props.type}`);
        }
    }
}
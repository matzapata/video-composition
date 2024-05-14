import { copyFile, copyFileSync } from "fs";
import { Source, SourceType } from "../source";
import { SourceLoader, SourceLoaderProps } from "../source-loader";
import { ImageSource } from "../files-sources/image-source";

export class ImageLoader implements SourceLoader {
    async load(props: SourceLoaderProps): Promise<Source> {
        // copy source to out folder with fs
        copyFileSync(props.src, props.out + "/frame_01.png");

        return new ImageSource({
            type: SourceType.IMAGE,
            audioPath: null,
            framesPath: props.out,
            layout: props.layout,
            totalFrames: 1,
            transformations: props.transformations
        })
    }
}
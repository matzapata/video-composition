import { VideoSource } from "../files-sources/video-source";
import { Source, SourceType } from "../source";
import { SourceLoader, SourceLoaderProps } from "../source-loader";
import ffmpeg from 'ffmpeg';

export class VideoLoader implements SourceLoader {
    async load(props: SourceLoaderProps): Promise<Source> {
       const files = await this.extractFrames(props.src, props.out, props.fps)

        // extract frames in out folder
        return new VideoSource({
            type: SourceType.VIDEO,
            audioPath: null,
            framesPath: props.out,
            layout: props.layout,
            totalFrames: files.length,
            transformations: props.transformations
        })
    }


    private extractFrames(src: string, out: string, fps: number) {
        return new Promise<string[]>(async (resolve, reject) => {
            const process = new ffmpeg(src);
            const video = await process;

            video.fnExtractFrameToJPG(out, {
                frame_rate: fps,
                file_name: 'frame_%s'
            }, function (error, files) {
                if (error) reject(error);
                else resolve(files);
            });
        })
    }
}


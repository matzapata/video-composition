import { Source } from "../source";
import { SourceLoader } from "../source-loader";

export class ImageLoader implements SourceLoader {
    load(src: string, out: string, fps: number): Promise<Source> {
        throw new Error("Method not implemented.");
    }
}
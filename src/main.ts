import { writeFileSync } from "fs";
import { SourceType } from "./sources/source";
import { SourcesFactory } from "./sources/source-factory";
import path from "path";

// TODO: manage uniform file format

const srcPath = path.join(__dirname, '../tests/movie.mp4');

const src = SourcesFactory.create(SourceType.VIDEO, {
    fps: 32,
    layout: { x: 0, y: 0, width: 1920, height: 1080 },
    srcPath:srcPath ,
    transformations: []
})

src.getFrameN(10).then((frame) => {
    // write to test.png
    if (!frame) {
        console.error('Frame is null')
        return
    }
    writeFileSync('test.jpg', frame)
})

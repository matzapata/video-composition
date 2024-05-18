import { writeFileSync } from "fs";
import { SourceType } from "./sources/source";
import { SourcesFactory } from "./sources/source-factory";
import path from "path";
import { transformationsManager } from "./transformations/transformation-manager";
import { TransformationType } from "./transformations/transformation";
import { VideoBuilder } from "./video-builder/video-builder";

// TODO: manage uniform file format and paths

const srcPath = path.join(__dirname, '../tests/movie.mp4');

const videoBuilder = new VideoBuilder({
    fps: 30,
    height: 1080,
    width: 1920,
    outputFile: 'output.mp4'
})
videoBuilder.addSource({
    name: "screen",
    layout: { x: 0, y: 0, width: 1920, height: 1080 },
    src: srcPath,
    transform: [],
    type: SourceType.VIDEO
})

videoBuilder.build().then(() => {
    console.log('Video built')
})

// const src = SourcesFactory.create(SourceType.VIDEO, {
//     fps: 32,
//     layout: { x: 0, y: 0, width: 1920, height: 1080 },
//     srcPath:srcPath ,
//     transformations: []
// })

// src.getFrameNumber(10).then((frame) => {
//     // write to test.png
//     if (!frame) {
//         console.error('Frame is null')
//         return
//     }
//     transformationsManager.apply(frame, [
//         {
//             type: TransformationType.CROP,
//             data: {
//                 height: 100,
//                 width: 100,
//                 left: 0,
//                 top: 0,
//             }
//         }

//     ]).then((frame) => {
//         writeFileSync('test.png', frame)
//     })
// })

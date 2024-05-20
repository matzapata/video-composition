import { SourceType } from "./sources/source";
import path from "path";
import { TransformationType } from "./transformations/transformation";
import { VideoBuilder } from "./video-builder/video-builder";


const screenVideoPath = path.join(__dirname, '../tests/movie.mp4');
const bgImagePath = path.join(__dirname, '../tests/bg.jpg');

const videoBuilder = new VideoBuilder({
    fps: 30,
    height: 1080,
    width: 1920,
    outputFile: 'output.mp4'
})
videoBuilder.addSource({
    name: "background",
    layout: { x: 0, y: 0, width: 1920, height: 1080, zIndex: 10 },
    src: bgImagePath,
    transform: [],
    type: SourceType.IMAGE
})
videoBuilder.addSource({
    name: "screen",
    layout: { 
        x: 20, 
        y: 20, 
        width: 1420 - 40, 
        height: 1080 - 40, 
        borderColor: 'red',
        borderRadius: 20,
        borderWidth: 10,
    },
    src: screenVideoPath,
    transform: [
        {
            type: TransformationType.CROP,
            data: {
                left: 500,
                top: 500, 
                width: 500,
                height: 500
            }
        }, 
        // {
        //     type: TransformationType.ZOOM,
        //     data: {
        //         factor: 2,
        //     }
        // }
    ],
    type: SourceType.VIDEO
})


videoBuilder.build().then(() => {
    console.log('Video built successfully')
    process.exit(0)
})

import { execSync, spawn } from "child_process"
import { existsSync, mkdirSync, mkdtempSync } from "fs"
import { readFile } from "fs/promises"
import path from "path"
import os from "os"
import { rimraf } from "rimraf"


export class FfmpegFrameExtractor {
    private fps: number
    private durationMs: number
    private width: number
    private height: number
    private source: string
    private framesOffsetMs: number
    private totalFrames: number
    private framesDir: string

    constructor(props: {
        fps: number,
        source: string
    }) {
        this.fps = props.fps
        this.source = props.source

        // get video metadata
        const metadata = this.getVideoMetadata(this.source)
        this.durationMs = metadata.durationMs
        this.width = metadata.width
        this.height = metadata.height

        // calculate frames offset in ms
        this.framesOffsetMs = 1000 / this.fps
        this.totalFrames = Math.floor(this.durationMs / this.framesOffsetMs)

        // create directory for frames
        this.framesDir = mkdtempSync(path.join(os.tmpdir(), 'frames-'));

        process.on('exit', () => {
            console.log('Cleaning up temporary folder:', this.framesDir);
            try {
                rimraf.sync(this.framesDir);
                console.log('Temporary folder deleted');
            } catch (err) {
                console.error('Error deleting temporary folder:', err);
            }
        });
    }

    getFrameN(frameN: number, format: string = "png"): Promise<Buffer> {
        if (frameN < 0 || frameN >= this.totalFrames) {
            throw new Error(`Invalid frame number: ${frameN}`)
        }


        return new Promise((resolve, reject) => {
            const frameOffset = frameN * this.framesOffsetMs
            const time = this.formatMilliseconds(frameOffset);

            // Spawn ffmpeg process
            const ffmpeg = spawn('ffmpeg', [
                '-i', this.source,
                '-ss', time,
                '-vframes', '1',
                '-f', 'image2pipe',
                '-c:v', format,
                'pipe:1',
                "-hwaccel", "none",
                '-y'
            ]);

            let frameBuffer = Buffer.alloc(0);

            // Capture stdout data
            ffmpeg.stdout.on('data', (data) => {
                console.log("OK")
                frameBuffer = Buffer.concat([frameBuffer, data]);
            });

            // Capture stderr data
            ffmpeg.stderr.on('data', (data) => {
                console.log("ERROR capturing frame")
                console.error(`ffmpeg stderr: ${data}`);
            });

            // Capture error event
            ffmpeg.on('error', (error) => {
                console.log("ERROR capturing frame")
                console.error(`ffmpeg error: ${error.message}`);
            });

            // Capture process exit
            ffmpeg.on('close', (code) => {
                if (code === 0) resolve(frameBuffer);
                else reject(`ffmpeg process exited with code ${code}`);
            });
        })
    }

    async getFrameNumber(n: number, format: string = "png"): Promise<Buffer> {
        const frameFileName = path.join(this.framesDir, `frame_${String(n).padStart(4, '0')}.png`);

        // Check if the frame already exists
        if (!existsSync(frameFileName)) {
            // Extract the batch of frames
            await this.extractBatch(n, this.totalFrames);
        }

        // Read and return the frame
        return readFile(frameFileName);
    }

    private extractBatch(startFrame: number, batchSize: number): Promise<void> {
        return new Promise((resolve, reject) => {
            // extract batch of frames
            const ffmpeg = spawn('ffmpeg', [
                '-i', this.source, // Replace with your source video path
                '-vf', `fps=${this.fps},select='between(n\\,${startFrame}\\,${startFrame + batchSize - 1})'`, // Set frame rate and select frames
                '-vsync', 'vfr', // Variable frame rate
                '-frame_pts', '1', // Use frame timestamps as output filenames
                path.join(this.framesDir, 'frame_%04d.png'), // Output path for frames
                '-y' // Overwrite output files if they exist
            ]);


            // Capture stderr data
            ffmpeg.stderr.on('data', (data) => {
                console.log("ERROR capturing frame")
                console.error(`ffmpeg stderr: ${data}`);
            });

            // Capture error event
            ffmpeg.on('error', (error) => {
                console.log("ERROR capturing frame")
                console.error(`ffmpeg error: ${error.message}`);
            });

            // Capture process exit
            ffmpeg.on('close', (code) => {
                if (code === 0) resolve();
                else reject(`ffmpeg process exited with code ${code}`);
            });
        })
    }

    getTotalFrames(): number {
        return this.totalFrames
    }

    getDimensions(): { width: number, height: number } {
        return {
            width: this.width,
            height: this.height
        }
    }


    private getVideoMetadata(source: string): { durationMs: number, width: number, height: number } {
        const probeOutput = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=s=x:p=0 ${source}`);
        const [width, height, duration] = probeOutput.toString().trim().split('x');

        return {
            durationMs: Math.floor(parseFloat(duration.toString().trim()) * 1000),
            height: Number(height),
            width: Number(width)
        }
    }

    private formatMilliseconds(milliseconds: number): string {
        // Convert milliseconds to seconds
        let totalSeconds = milliseconds / 1000;

        // Extract hours
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;

        // Extract minutes
        const minutes = Math.floor(totalSeconds / 60);

        // Extract remaining seconds and milliseconds
        const seconds = Math.floor(totalSeconds % 60);
        const ms = Math.floor((milliseconds % 1000));

        // Format the time components
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(ms).padStart(3, '0');

        // Construct and return the formatted time string
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
    }

}

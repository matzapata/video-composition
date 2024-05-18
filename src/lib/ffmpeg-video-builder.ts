import { ChildProcess, spawn } from "child_process";

export class FfmpegVideoBuilder {
    private fps: number;
    private ffmpeg: ChildProcess;
    private finished: boolean = false;

    constructor(props: { fps: number, outputFile: string, width: number, height: number }, options: { log?: boolean } = { log: false }) {
        this.fps = props.fps;

        // Create FFmpeg process
        this.ffmpeg = spawn('ffmpeg', [
            '-y', // Overwrite output file if exists
            '-f', 'image2pipe', // Input format is image
            '-r', `${this.fps}`, // Set input frame rate
            '-i', '-', // Read from stdin
            '-c:v', 'libx264', // Video codec
            '-pix_fmt', 'yuv420p', // Pixel format
            "-vf", `scale=${props.width}:${props.height}`,
            props.outputFile // Output file path
        ]);

        if (options.log) {
            console.log("Logging ON")
            this.ffmpeg.stdout?.on('data', (data) => {
                console.log(`FFmpeg stdout: ${data}`);
            });
            this.ffmpeg.stderr?.on('data', (data) => {
                console.error(`FFmpeg stderr: ${data}`);
            });
        }
    }

    addFrame(frame: Buffer) {
        if (this.finished) {
            throw new Error('Video building already finished');
        }

        return this.ffmpeg.stdin?.write(frame);
    }

    end(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ffmpeg.stdin?.end();
            this.ffmpeg.on('close', (code) => {
                this.finished = true;

                if (code === 0) {
                    console.log('FFmpeg process finished successfully.');
                    resolve();
                } else {
                    console.error(`FFmpeg process exited with code ${code}`);
                    reject();
                }
            });
        });
    }

}
import { execSync, spawn } from "child_process"


export class FfmpegFrameExtractor {
    private fps: number
    private durationMs: number
    private width: number
    private height: number
    private source: string
    private framesOffsetMs: number
    private totalFrames: number

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
                '-y'
            ]);

            let frameBuffer = Buffer.alloc(0);

            // Capture stdout data
            ffmpeg.stdout.on('data', (data) => {
                frameBuffer = Buffer.concat([frameBuffer, data]);
            });

            // Capture stderr data
            ffmpeg.stderr.on('data', (data) => {
                console.error(`ffmpeg stderr: ${data}`);
            });

            // Capture error event
            ffmpeg.on('error', (error) => {
                console.error(`ffmpeg error: ${error.message}`);
            });

            // Capture process exit
            ffmpeg.on('close', (code) => {
                if (code === 0) resolve(frameBuffer);
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

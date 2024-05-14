All from yaml or json file specification


spec file

```json
{
  "fps": 32,
  "duration": 10,
  "sources":
    [
      {
        "name": "background",
        "type": "image",
        "url": "background.png",
        "layout": { "x": 0, "y": 0, "width": 1920, "height": 1080 },
        "transform": [],
      },
      {
        "name": "screen",
        "type": "video",
        "url": "screen.mp4",
        "layout": { "x": 10, "y": 20, "width": 1920, "height": 1080 },
        "start_at": 1,
        "transform":
          [
            {
              "type": "crop",
              "data": { "x": 0, "y": 0, "width": 1920, "height": 1080 },
            },
            { "type": "border", "data": { "width": 10, "color": "#000000" } },
            {
              "type": "zoom",
              "data": { "x": 1920, "y": 1080, "percent": 0.5 },
            },
          ],
      },
    ],
}
```

classes

```ts
// ====================================================================================================
// Sources

// sources
abstract class Source {
    abstract getFrame(frame: number): string
    abstract getAudio(): string
    abstract getLayout(): any
    abstract applyTransformations(): Promise<void>
    // extracts frames, audio, layout, etc
    // apply transformations for each frame
    abstract compile(): void // Can make the video
}

class SourcesFactory {
    static async create(source: { name: string, /* etc */ }, fps: number, duration: number): Promise<Source> {
        // create the source
        const s = new Source();
    }
}

// ====================================================================================================
// Transformations strategies

// selects the right strategy
class TransformationsManager {
    apply() {}
}

interface TransformStrategy {
    apply(image_path: string, data: any): void;
}

class CropStrategy implements TransformStrategy {

    // extra data?
    apply(image_path: string, data: any): void {
        // Apply cropping transformation to source
    }
}

class BorderStrategy implements TransformStrategy {
    apply(image_path: string, data: any): void {
        // Apply border transformation to source
    }
}

class ZoomStrategy implements TransformStrategy {
    apply(image_path: string, data: any): void {
        // Apply zoom transformation to source
    }
}

// ====================================================================================================
// Video builder

class VideoBuilder {
    private sources: Source[] = [];

    constructor(private fps: number, private duration: number) { }

   async  addSource(source: { name: string, /* etc */ }): Promise<void> {
        this.sources.push(SourcesFactory.create(source, this.fps, this.duration));
    }

    async build(): Promise<void> {
        // Apply transformations to sources
        await Promise.all(this.sources.forEach(source => source.applyTransformations()));

        // render in canvas
        for (let frame_n = 0; frame_n < this.duration * this.fps; frame_n++) {
            const frame = new Canvas();
            this.sources.forEach(source => {
                frame.draw(source.getFrame(frame_n), source.getLayout());
            });
            frame.save();
        }

    }
}


const videoBuilder = new VideoBuilder(32, 10);
// load up sources
videoBuilder.addSource({url: "", transformations: [], layout: {}});
videoBuilder.addSource({url: "", transformations: [], layout: {}});
// build video
videoBuilder.build();
```

.tmp
- sources
    frames
        background
        screen_1
        screen_2
    audio

extractor -> turn sources into frames

for i = 0; i<duration*fps; i++
  - sources = sources.map(s => transform(s, transformations))
  - frame = renderInLayout(sources)
  - frame.save()


  - for transform in transformations
        frame = transform(frame, current_frame_n, total_frames)

// transform specification in frames actions
compileFramesActions(source, time) // constant for images, unless has zoom also, can be
- cropCompileFrame(current, total) // constant
- borderCompileFrame(current, total) // constant
- zoomCompileFrame(current, total) // variant

frames specs

framesRenderer
- applyTransformation
    - CropTransformation.apply()
    - BorderTransformation.apply()
    - ZoomTransformation.apply()
- renderOnLayout()
- return image

VideoCompiler.compile(frames, audio)

# Setup

Install ffmpeg 

```
brew update
brew upgrade
brew install ffmpeg
```


# Compose videos layouts

# Add zoom effects

# Crop videos

# Add clips

# Include or remove audio

# Transitions

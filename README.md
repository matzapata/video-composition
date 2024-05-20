

# TODO:

- Add audio to video
- Preserve image aspect radio
- Create example layouts -> functions that create config objects 
- Zoom animation
- Manage videos with different lengths appropriately
- Add flexibility around loading, don't use temp folder, use known folder, maybe in temp directory but that you can reuse. 
- CLI 

# Setup

Install ffmpeg 

```
brew update
brew upgrade
brew install ffmpeg
```


# Compose videos layouts

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


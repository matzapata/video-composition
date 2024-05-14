const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

// Write "Awesome!"
ctx.font = '30px Impact'
ctx.rotate(0.1)
ctx.fillText('Awesome!', 50, 100)

// Draw line under text
var text = ctx.measureText('Awesome!')
ctx.strokeStyle = 'rgba(0,0,0,0.5)'
ctx.beginPath()
ctx.lineTo(50, 102)
ctx.lineTo(50 + text.width, 102)
ctx.stroke()

const buf = canvas.toBuffer()

fs.writeFile('image.png', buf, (err) => {
    if (err) {
        console.error('Error writing file:', err);
        return;
    }
    console.log('Image saved successfully.');
});
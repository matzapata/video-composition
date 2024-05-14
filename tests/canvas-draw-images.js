const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

async function main() {
    const bg = await loadImage('bg.jpg');
    const cat = await loadImage('lime-cat.jpg');

    ctx.drawImage(bg, 0, 0, 200, 200);
    ctx.drawImage(cat, 50, 50, 100, 100);

    const buf = canvas.toBuffer();
    fs.writeFile('image.png', buf, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Image saved successfully.');
    });
}

main();
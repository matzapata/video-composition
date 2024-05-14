var ffmpeg = require('ffmpeg');

try {
	var process = new ffmpeg('./movie.mp4');
    console.log('process:', process);
	process.then(function (video) {
        console.log('video:', video);

		// Callback mode
		video.fnExtractFrameToJPG('./frames', {
			frame_rate : 1,
			number : 5,
			file_name : 'my_frame_%t_%s'
		}, function (error, files) {
            console.log('error:', error);
			if (!error)
				console.log('Frames: ' + files);
		});
	}, function (err) {
		console.log('Error: ' + err);
	});
} catch (e) {
	console.log(e.code);
	console.log(e.msg);
}
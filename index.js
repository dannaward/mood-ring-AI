// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = './my_model/';

let model, webcam, labelContainer, maxPredictions;
const photos = [
	'"ring_images/violet.png"',
	'"ring_images/blue.png"',
	'"ring_images/blue green.png"',
	'"ring_images/green.png"',
	'"ring_images/amber.png"',
	'"ring_images/gray.png"',
	'"ring_images/black.png"',
];

const emotions = ['happy', 'neutral', 'disgusted', 'sad', 'fearful', 'angry', 'surprise'];
// Load the image model and setup the webcam
async function init() {
	const modelURL = URL + 'model.json';
	const metadataURL = URL + 'metadata.json';

	// load the model and metadata
	// Refer to tmImage.loadFromFiles() in the API to support files from a file picker
	// or files from your local hard drive
	// Note: the pose library adds "tmImage" object to your window (window.tmImage)
	model = await tmImage.load(modelURL, metadataURL);
	maxPredictions = model.getTotalClasses();

	// Convenience function to setup a webcam
	const flip = true; // whether to flip the webcam
	webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
	await webcam.setup(); // request access to the webcam
	await webcam.play();
	window.requestAnimationFrame(loop);

	// append elements to the DOM
	document.getElementById('webcam-container').appendChild(webcam.canvas);
	labelContainer = document.getElementById('label-container');
	for (let i = 0; i < maxPredictions; i++) {
		// and class labels
		labelContainer.appendChild(document.createElement('div'));
	}
	return true;
}

async function loop() {
	webcam.update(); // update the webcam frame
	const prediction = await predict();
	await getEmotionImage(prediction);
	window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
	// predict can take in an image, video or canvas html element
	const prediction = await model.predict(webcam.canvas);
	return prediction;
}

function getEmotion(emotion) {
	let idx;
	switch (emotion) {
		case 'happy':
			idx = 0;
			break;
		case 'neutral':
			idx = 1;
			break;
		case 'disgusted':
			idx = 2;
			break;
		case 'sad':
			idx = 3;
			break;
		case 'fearful':
			idx = 4;
			break;
		case 'angry':
			idx = 5;
			break;
		case 'surprise':
			idx = 6;
			break;
		default: 
			idx = 3;
			break;
	}
	return idx;
}

async function getEmotionImage(prediction) {
	let max=0
	for (let i = 0; i < maxPredictions; i++) {
		const classPrediction =
			prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
		labelContainer.childNodes[i].innerHTML = classPrediction;
		const arr = classPrediction.split(': ');
		const idx = getEmotion(arr[0])
		if(parseFloat(arr[1])>max){
			max = parseFloat(arr[1]);
			const selected = photos [idx];
			console.log('selected', selected);
			console.log('img',document.getElementById('img').src);
			document.getElementById('img').src = selected;
		} else{
			document.getElementById('img').src = "green.png";
		}
		
		// console.log('&&&&&&&', arr);
		// console.log("classPrediction",classPrediction);
		// const selected = photos[Math.floor(Math.random() * photos.length)];
		// console.log('selected', selected);
		// const selected =
		// document.getElementById('img').src = selected;
	}
}

let isSetWebcam = false;

async function isLoading() {
	isSetWebcam = await init();
	if (isSetWebcam) {
		document.getElementById('spinner__icon').style = 'display:none;';
	}
}

isLoading();
// getLandomImage();

// 자기야 안녕 :)
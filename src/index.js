import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import gestureModel from './assets/gesture_recognizer.task';

const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: gestureModel,
    delegate: "GPU"
  },
  numHands: 2,
})
gestureRecognizer.setOptions({runningMode: "video"})

/**
 * 
 * @param {WebGL2RenderingContext} ctx 
 * @param {import('@mediapipe/tasks-vision').Landmark} landmarks 
 * @param {string} color 
 */
function drawLandmarks(ctx, landmarks, color, canvasWidth, canvasHeight) {
  ctx.fillStyle = color;
  for (let i = 0; i < landmarks.length; i++) {
    const { x, y } = landmarks[i];
    ctx.beginPath();
    ctx.arc(x*canvasWidth, y*canvasHeight, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }
}

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    $canvas.width = video.videoWidth;
    $canvas.height = video.videoHeight;
    video.addEventListener('play', () => {
      const render = () => {
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        ctx.drawImage(video, 0, 0, $canvas.width, $canvas.height);
        const results = gestureRecognizer.recognizeForVideo(video, Date.now());
        if (results.landmarks.length !== 0) {
          drawLandmarks(ctx, results.landmarks[0], "#c82124", $canvas.width, $canvas.height);
        }
        requestAnimationFrame(render);
      }
      render()
    })
    video.play();
  };
})
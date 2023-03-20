import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: 'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task',
  },
  numHands: 2,
})
gestureRecognizer.setOptions({runningMode: "video"})

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
    $canvas.width = video.videoWidth;
    $canvas.height = video.videoHeight;
    video.addEventListener('play', () => {
      const render = () => {
        ctx.drawImage(video, 0, 0, $canvas.width, $canvas.height);
        requestAnimationFrame(render);
      }
      render()
    })
  };
})
const canvas = document.getElementById("canvas");
const audio = document.getElementById("audio-player");

function playAudio() {
  if (Math.random() < 0.5) {
    audio.src = "/Only Faith and Hope.mp3";
  } else {
    audio.src = "/spring.mp3";
  }

  audio.load();
  audio.play();
}

const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");

// create Web Audio API context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create analyser node
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

// connect audio source to analyser node
let source = null;
function connectAudioSource() {
  if (source !== null) {
    source.disconnect();
  }
  source = audioCtx.createMediaElementSource(document.getElementById("audio-player"));
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
}

// load selected audio file
function loadAudio() {
  const file = fileInput.files[0];
  const url = URL.createObjectURL(file);
  audio.src = url;
  audio.load();
  audio.play();
  connectAudioSource();
}

// get frequency data and draw on canvas
function draw() {
  requestAnimationFrame(draw);
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  const width = canvas.width;
  const height = canvas.height;
  const barWidth = width / bufferLength;
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 255 * height;
    const x = i * barWidth;
    const y = height - barHeight;
    ctx.fillStyle = `rgb(${barHeight}, 0, 0)`;
    ctx.fillRect(x, y, barWidth, barHeight);
  }
}

// start visualization
draw();

// play audio when the page has finished loading
window.addEventListener('load', playAudio);
// Get the canvas element and set its dimensions
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.5;

// Create the AudioContext and start playing the audio when canvas is clicked
canvas.addEventListener("click", function() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audio = document.getElementById("audio-player");
  const source = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  let barWidth = canvas.width / bufferLength;
  
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  audio.play();

  function renderBars() {
    const canvasCtx = canvas.getContext("2d");

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    let x = 0;
    let y = 0;
    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i] * canvas.height / 255;
      let hue = i / bufferLength * 360;
      let gradient = canvasCtx.createLinearGradient(x, y, x + barWidth, y + barHeight);
      gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue}, 100%, 25%)`);
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }

    requestAnimationFrame(renderBars);
  }

  renderBars();
});

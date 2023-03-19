const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.5;

const changeBackgroundButton = document.getElementById("change-background-button");
const whiteButton = document.getElementById("white-button");

let isWhite = true;

// Check the current background color and set the isWhite variable accordingly
const bgColor = getComputedStyle(canvas).backgroundColor;
if (bgColor === "rgb(255, 255, 255)") {
  isWhite = true;
} else if (bgColor === "rgb(0, 0, 0)") {
  isWhite = false;
}

// Set the background color based on the initial state of isWhite
if (isWhite) {
  canvas.style.backgroundColor = "white";
  whiteButton.style.color = "black";
  whiteButton.textContent = "black";
} else {
  canvas.style.backgroundColor = "black";
  whiteButton.style.color = "white";
  whiteButton.textContent = "white";
}

const headerText = document.getElementById("header-text");
if (isWhite) {
  headerText.style.color = "black";
  headerText.style.backgroundColor = "transparent";
} else {
  headerText.style.color = "white";
  headerText.style.backgroundColor = "transparent";
}

const frequencyDisplay = document.getElementById("frequency-display");
if (isWhite) {
  frequencyDisplay.style.color = "black";
  frequencyDisplay.style.backgroundColor = "transparent";
} else {
  frequencyDisplay.style.color = "white";
  frequencyDisplay.style.backgroundColor = "transparent";
}

changeBackgroundButton.addEventListener("click", function () {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  let hue = Math.floor(Math.random() * bufferLength);
  if (!isWhite) {
    hue = hue * 2;
  }
  canvas.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

  const currentBgColor = canvas.style.backgroundColor;
  const whiteColor = "rgb(255, 255, 255)";
  const blackColor = "rgb(0, 0, 0)";

  if (currentBgColor === whiteColor || currentBgColor === blackColor) {
    if (isWhite) {
      headerText.style.color = "white";
      headerText.style.backgroundColor = "transparent";
    } else {
      headerText.style.color = "black";
      headerText.style.backgroundColor = "transparent";
    }
  }
});

whiteButton.addEventListener("click", function() {
  if (isWhite) {
    canvas.style.backgroundColor = "black";
    whiteButton.style.color = "white";
    whiteButton.textContent = "white";
  } else {
    canvas.style.backgroundColor = "white";
    whiteButton.style.color = "black";
    whiteButton.textContent = "black";
  }
  isWhite = !isWhite;

  // Store the state of the background color in local storage
  localStorage.setItem("isWhite", isWhite.toString());

  if (isWhite) {
    headerText.style.color = "black";
    headerText.style.backgroundColor = "transparent";
  } else {
    headerText.style.color = "white";
    headerText.style.backgroundColor = "transparent";
  }
});


const backLink = document.getElementById("back-text");
const backParagraph = backLink.querySelector("p");

backLink.addEventListener("click", function() {
  // change the color and background color of the paragraph element
  if (isWhite) {
  backParagraph.style.color = "black";
  backParagraph.style.backgroundColor = "transparent";
  } else {
  backParagraph.style.color = "white";
  backParagraph.style.backgroundColor = "transparent";
  }
  });
  
whiteButton.addEventListener("click", function() {
  if (isWhite) {
    backLink.style.color = "black";
  }
  else {
    backLink.style.color = "white";
  }
}); 

  
  
  // Retrieve the state of the background color from local storage and set the isWhite variable
  const storedIsWhite = localStorage.getItem("isWhite");
  if (storedIsWhite !== null) {
  isWhite = storedIsWhite === "true";
  }
  
// Define the frequency buttons and set the default frequency
const decreaseFrequencyButton = document.getElementById("decrease-frequency");
const increaseFrequencyButton = document.getElementById("increase-frequency");

let frequency = localStorage.getItem("frequency");
if (frequency === null) {
  frequency = 258;
} else {
  frequency = Math.pow(2, Math.floor(Math.log2(frequency)));
  if (frequency > 16384) {
    frequency = 16384;
  }
}

function updateFrequencyDisplay() {
  const frequencyDisplay = document.getElementById("frequency-display");
  frequencyDisplay.textContent = `${frequency} Hz`;
  localStorage.setItem("frequency", frequency);
}

updateFrequencyDisplay();

decreaseFrequencyButton.addEventListener("click", function() {
  if (frequency > 20) {
    frequency = Math.pow(2, Math.round(Math.log2(frequency)) - 1);
    updateFrequencyDisplay();
  }
});

increaseFrequencyButton.addEventListener("click", function() {
  if (frequency < 20000) {
    frequency = Math.pow(2, Math.round(Math.log2(frequency)) + 1);
    if (frequency > 16384) {
      frequency = 16384;
    }
    updateFrequencyDisplay();
  }
});

  // Set up the audio context and analyzer for the equalizer visualization
  let isPlaying = false;

  canvas.addEventListener("click", function() {
    if (!isPlaying) {
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
      
      isPlaying = true;
  
      function renderBars(highEndMultiplier = 1) {
        const canvasCtx = canvas.getContext("2d");
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        analyser.fftSize = frequency * 2; // update the analyzer's frequency value
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        let barWidth = canvas.width / bufferLength;
        let x = 0;
        let y = 0;
      
        for (let i = 0; i < bufferLength; i++) {
          let barHeight = dataArray[i] * canvas.height / 255;
          if (i > bufferLength * 0.75) {
            barHeight *= highEndMultiplier;
          }
          let hue = i / bufferLength * 360;
          let gradient;
          if (isWhite) {
            gradient = canvasCtx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, `hsl(${hue}, 100%, -10%)`);
            gradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
          } else {
            gradient = canvasCtx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, `hsl(${hue}, 200%, 50%)`);
            gradient.addColorStop(1, `hsl(${hue}, 100%, 0%)`);
          }
          canvasCtx.fillStyle = gradient;
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth;
        }
      
        requestAnimationFrame(() => renderBars(highEndMultiplier));
      }
      
  
      renderBars(2);
    }
  });
  

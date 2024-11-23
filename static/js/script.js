const video = document.getElementById('video');
const output = document.getElementById('output');

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();

    video.addEventListener('loadedmetadata', () => {
      processFrames();
    });
  })
  .catch(err => {
    console.error("Error accessing the webcam: " + err);
  });

function processFrames() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  async function sendFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL('image/jpeg', 0.5); // Adjust quality if needed

    try {
      const response = await fetch('/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imgData })
      });

      const data = await response.json();
      output.src = data.image;

      // Continue processing frames
      requestAnimationFrame(sendFrame);
    } catch (err) {
      console.error('Error processing frame:', err);
    }
  }

  sendFrame();
}

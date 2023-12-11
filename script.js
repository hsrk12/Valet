var globalBlob = '';
var urlOnly = '';

document.addEventListener("DOMContentLoaded", function() {
    const openCameraButton = document.getElementById("openCameraButton");
    const capturePhotoButton = document.getElementById("capturePhotoButton");
    const videoElement = document.getElementById("videoElement");
    const capturedPhoto = document.getElementById("capturedPhoto");
    let mediaStream = null;

    openCameraButton.addEventListener("click", function() {
     
      // Check if the browser supports getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            // Display the video stream in the video element
            videoElement.srcObject = stream;
            mediaStream = stream;

            // Enable the "Capture Photo" button
            capturePhotoButton.removeAttribute("disabled");
          })
          .catch(function (error) {
            console.error("Error accessing camera:", error);
          });
      } else {
        console.error("getUserMedia is not supported in this browser");
      }
    });


    capturePhotoButton.addEventListener("click", function() {
     
        if (mediaStream) {
          const track = mediaStream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track);

          imageCapture.takePhoto()
            .then(function(blob) {
              // Convert the Blob to a Data URL
              const imageUrl = URL.createObjectURL(blob);

              // Display the captured photo
              capturedPhoto.src = imageUrl;
              globalBlob = imageUrl;
              urlOnly = globalBlob.split('blob:')[1];
              console.log(urlOnly);
              
              capturedPhoto.style.display = "block";
              videoElement.style.display = 'none'; 

            })
            .catch(function(error) {
              console.error("Error capturing photo:", error);
            });
        }
 
      });

      retakePhotoButton.addEventListener("click", function() {
       
        videoElement.style.display = 'block'; 
        imageCapture.takePhoto()
        .then(function(blob) {
          // Convert the Blob to a Data URL
          const imageUrl = URL.createObjectURL(blob);

          // Display the captured photo
          capturedPhoto.src = imageUrl;
          globalBlob = imageUrl;
          console.log(globalBlob);
          capturedPhoto.style.display = "block";
          

        })
        .catch(function(error) {
          console.error("Error capturing photo:", error);
        });
      });
});


$('#submitImage').click(function(){
    $.ajax({
      type: 'POST',
      url: 'https://valetapp.netlify.app/parking',
      data: JSON.stringify({ imageUrl: globalBlob }), 
      contentType: 'application/json',
      dataType: 'json',
      rossDomain: true,
      xhrFields: {
      withCredentials: true,
      },
      success: function(response){
      var descr = $('#parkingDescription');
      descr.empty();
      descr.text = JSON.stringify(response);
      },
    error: function(error){
    console.error('Error:', error);
    }
  })
  })
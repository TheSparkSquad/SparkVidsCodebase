document.getElementById("submit").addEventListener("click", function(event) {
    // Prevent form from submitting the traditional way
    event.preventDefault();

    let videoID = document.getElementsByName("video_id")[0].value;

    fetch("http://localhost:5000/", {
        method: "POST",
        mode: "no-cors",  // Add this line
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "video_id=" + videoID,
    })
    .then(response => {
        if (!response.ok) {
            console.log('Response status:', response.status);
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        // Update the DOM element with the transcript
        document.getElementById("transcriptDisplay").textContent = data.transcript;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

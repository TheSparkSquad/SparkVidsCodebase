function displayURL() {
    var url = document.getElementById('videoURL').value;
    document.getElementById('displayedURL').innerText = 'You entered: ' + url;

    fetchLocalSRT().then(srtContent => {
        document.getElementById('srtContent').innerText = srtContent;
    });
}


function fetchSRT(videoURL) {
    var apiUrl = 'https://videotosrt.api/extract';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoURL: videoURL })
    })
    .then(response => response.text())
    .then(data => {
        // Assuming the API returns the raw .srt file content.
        // Display the SRT content or allow the user to download it.
        document.getElementById('displayedURL').innerText = data;
    })
    .catch(error => {
        console.error('Error fetching SRT:', error);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    var summarizeButton = document.getElementById("summarizeButton");
    summarizeButton.addEventListener("click", displayURL);
});

function fetchLocalSRT() {
    return fetch('example.srt')
        .then(response => response.text())
        .then(data => {
            return data;  // this will be the content of the .srt file
        })
        .catch(error => {
            console.error('Error fetching local SRT:', error);
        });
}

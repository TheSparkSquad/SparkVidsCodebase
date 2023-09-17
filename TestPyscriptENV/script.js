/**
 * SparkVidz A.I. Video Summarizer Script
 * 
 * This script provides functionalities for the video summarizer.
 * It fetches and displays the content of a provided video URL in .srt format.
 * During the prototype phase, it fetches the SRT content from a local file,
 * but can be easily switched to use an actual API in the future.
 * 
 */




/**
 * Displays the entered URL and fetches the .srt content associated with it.
 */
function displayURL() {
    var url = document.getElementById('videoURL').value;
    document.getElementById('displayedURL').innerText = 'You entered: ' + url;

    fetchLocalSRT().then(srtContent => {
        document.getElementById('srtContent').innerText = srtContent;
    });
}

/**
 * Fetches the .srt content of a video from an external API.
 * 
 * @param {string} videoURL - The URL of the video to be summarized.
 */
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

/**
 * Initializes event listeners when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function() {
    var summarizeButton = document.getElementById("summarizeButton");
    summarizeButton.addEventListener("click", displayURL);
});

/**
 * Fetches the .srt content of a video from a local file (for prototype purposes).
 * 
 * @returns {Promise<string>} - A promise that resolves with the .srt content.
 */
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

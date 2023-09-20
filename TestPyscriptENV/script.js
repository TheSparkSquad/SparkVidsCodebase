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
 * Displays the entered URL, fetches the .srt content associated with it, and the summary from a .txt file.
 */
function displayURL() {
    var url = document.getElementById('videoURL').value;
    document.getElementById('displayedURL').innerText = 'You entered: ' + url;

    fetchLocalSRT().then(srtContent => {
        document.getElementById('srtContent').innerText = srtContent;
    });

    fetchLocalSummary().then(summaryContent => {
        document.getElementById('summaryContent').innerText = summaryContent;
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
    return fetch('ExampleSrt.srt')
        .then(response => response.text())
        .then(data => {
            return data;  // this will be the content of the .srt file
        })
        .catch(error => {
            console.error('Error fetching local SRT:', error);
        });
}

/**
 * Fetches the summary of a video from a local .txt file (for prototype purposes).
 * 
 * @returns {Promise<string>} - A promise that resolves with the summary content.
 */
function fetchLocalSummary() {
    return fetch('ExampleSummary.txt')
        .then(response => response.text())
        .then(data => {
            return data;  // this will be the content of the .txt file
        })
        .catch(error => {
            console.error('Error fetching local summary:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    const pyscriptContent = document.getElementById('pyscriptContent');

    toggleButton.addEventListener('click', () => {
        if (pyscriptContent.style.display === 'none') {
            pyscriptContent.style.display = 'block';
        } else {
            pyscriptContent.style.display = 'none';
        }
    });
});

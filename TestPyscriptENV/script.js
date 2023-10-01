/**
 * SparkVidz A.I. Video Summarizer Script
 * 
 * This script provides functionalities for the video summarizer.
 * It fetches and displays the content of a provided video URL in .srt format.
 * During the prototype phase, it fetches the SRT content from a local file,
 * but can be easily switched to use an actual API in the future.
 * 
 */





// Global variable to track the Pyodide loaded state
let pyodideLoaded = false;

/**
 * Helper function to dynamically load a JS script
 * @param {string} src - Script source URL
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Initialize Pyodide environment
 */
async function loadPyodideAndPackages() {
    if (pyodideLoaded) {
        return;
    }

    // Load the Pyodide JavaScript library
    await loadScript('https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js');

    // Initialize Pyodide
    let pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/' });

    // You can also load specific Python packages if needed
    // Example: await pyodide.loadPackage(['numpy', 'pandas']);

    pyodideLoaded = true;
    console.log("Pyodide initialized successfully!");
}

// Call the function directly to initialize Pyodide as soon as the script loads.
loadPyodideAndPackages().catch(error => {
    console.error("Error initializing Pyodide:", error);
});

/**
 * Displays the entered URL, fetches the .srt content associated with it, and the summary from a .txt file.
 */
function extractVideoID(url) {
    let videoID = null;
    const match = url.match(/v=([^&]+)/);  // Regular expression to capture value after 'v=' and before next '&'
    if (match && match[1]) {
        videoID = match[1];
    }
    return videoID;
}

function displayURL() {

    var url = document.getElementById('videoURL').value;
    document.getElementById('displayedURL').innerText = 'You entered: ' + url;

    // Extract video ID from the YouTube URL.
    var videoID = extractVideoID(url);
    
    if (!videoID) {
        console.error("Invalid YouTube URL.");
        document.getElementById('srtContent').innerText = "Invalid YouTube URL.";
        return;
    }

    // Calling the Python function
    pyodide.runPythonAsync(`
        import youtubeTranscript
        transcript = youtubeTranscript.get_video_transcript("${videoID}")
    `).then(transcript => {
        document.getElementById('srtContent').innerText = JSON.stringify(transcript, null, 2); // Formats the JSON for display
        // For the summary, you might want to process the transcript in a different way.
        document.getElementById('summaryContent').innerText = "Summary will go here...";
    }).catch(error => {
        console.error("Error fetching transcript:", error);
        document.getElementById('srtContent').innerText = "Failed to fetch transcript.";
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

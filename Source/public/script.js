// Helper functions
function showError(message) {
    console.error(message);
    alert(message);
}

function showLoading(id) {
    document.getElementById(id).style.display = "flex";
}

function hideLoading(id) {
    document.getElementById(id).style.display = "none";
}

// API interaction functions
class YouTubeAPI {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }

    async fetchFromServer(endpoint, options) {
        try {
            const response = await fetch(this.apiEndpoint + endpoint, options);
            if (!response.ok) {
                throw new Error(`Failed with status: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            showError("Error occurred. Please check the console for more details.");
            throw error;
        }
    }

    async fetchCaptions(videoId, captionType) {
        return this.fetchFromServer(`/captions?videoId=${videoId}&captionType=${captionType}`);
    }

    async generateSummary(captions, videoId, captionType) {
        return this.fetchFromServer('/generateSummary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ captions, videoId, captionType })
        });
    }

    async searchCaptions(captions, keyword) {
        return this.fetchFromServer('/generateSearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ captions, keyword })
        });
    }
}

// Instantiate the API class
const api = new YouTubeAPI('/');

// Event handlers
async function onFetchCaptions() {
    const videoIdInput = document.getElementById("videoId").value;
    const videoId = videoIdInput.includes('youtube.com') || videoIdInput.includes('youtu.be') 
        ? extractVideoId(videoIdInput) 
        : videoIdInput;
    
    if (!videoId) {
        showError("Invalid YouTube Video ID or URL.");
        return;
    }

    showLoading("loading");
    try {
        const captionType = getSelectedCaptionType();
        const srtData = await api.fetchCaptions(videoId, captionType);
        document.getElementById("output").textContent = srtData.replace(/\\n/g, '\n');
    } finally {
        hideLoading("loading");
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Ensure the DOM is fully loaded before binding events

    // Binding the click event to the "Fetch Captions" button
    document.getElementById("fetchCaptionsButton").addEventListener("click", onFetchCaptions);

    // Binding the click event to the "Fetch Summary" button
    document.getElementById("fetchSummaryButton").addEventListener("click", onFetchSummary);

    // Binding the click event to the "Search Captions" button
    document.getElementById("searchCaptionsButton").addEventListener("click", onSearchCaptions);
});

// Function called when "Fetch Summary" button is clicked
async function onFetchSummary() {
    const videoIdInput = document.getElementById("videoId").value;
    const videoId = extractVideoId(videoIdInput);

    if (!videoId) {
        showError("Invalid YouTube Video ID or URL.");
        return;
    }

    showLoading("loadingSummary");
    try {
        const captionType = getSelectedCaptionType();
        const captions = document.getElementById("output").textContent;
        const summary = await api.generateSummary(captions, videoId, captionType);
        document.getElementById("summary").textContent = summary;
    } catch (error) {
        // Error handling is done inside generateSummary()
    } finally {
        hideLoading("loadingSummary");
    }
}

// Function called when "Search Captions" button is clicked
async function onSearchCaptions() {
    const videoIdInput = document.getElementById("videoId").value;
    const keyword = document.getElementById("searchId").value;
    const videoId = extractVideoId(videoIdInput);

    if (!videoId) {
        showError("Invalid YouTube Video ID or URL.");
        return;
    }

    if (!keyword.trim()) {
        showError("Please enter a keyword to search for.");
        return;
    }

    showLoading("loadingSearch");
    try {
        const captionType = getSelectedCaptionType();
        const captions = document.getElementById("output").textContent;
        const searchResult = await api.searchCaptions(captions, keyword);
        document.getElementById("search").textContent = searchResult;
    } catch (error) {
        // Error handling is done inside searchCaptions()
    } finally {
        hideLoading("loadingSearch");
    }
}


function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
}
function getSelectedCaptionType() {
    return document.querySelector('input[name="captionType"]:checked').value;
}


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

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
}
function getSelectedCaptionType() {
    const captionTypeElement = document.querySelector('input[name="captionType"]:checked');
    return captionTypeElement ? captionTypeElement.value : 'SRT'; // Provide a default value if none is selected

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
        console.log(`Fetching captions for videoId: ${videoId}, captionType: ${captionType}`);
        const response = await this.fetchFromServer(`/captions?videoId=${videoId}&captionType=${captionType}`);
        console.log('Response from server:', response);
        return response;
    }
    

    async generateSummary(captions, videoId, captionType) {
        return this.fetchFromServer('/generateSummary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ captions, videoId, captionType })
        });
    }

    async searchCaptions(captions, keyword, videoId, captionType) {
        return this.fetchFromServer('/generateSearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ captions, keyword, videoId, captionType })
        });
    }
}

// Instantiate the API class
const api = new YouTubeAPI('http://localhost:3000');


document.addEventListener('DOMContentLoaded', (event) => {
    // Ensure the DOM is fully loaded before binding events

    // Binding the click event to the "Fetch Captions" button
    const fetchCaptionsButton = document.getElementById("fetchCaptionsButton");
    if (fetchCaptionsButton) {
        fetchCaptionsButton.addEventListener("click", onFetchCaptions);
    }

    // Binding the click event to the "Fetch Summary" button
    const fetchSummaryButton = document.getElementById("fetchSummaryButton");
    if (fetchSummaryButton) {
        fetchSummaryButton.addEventListener("click", onFetchSummary);
    }

    // Binding the click event to the "Search Captions" button, if it exists
    const searchCaptionsButton = document.getElementById("searchCaptionsButton");
    if (searchCaptionsButton) {
        searchCaptionsButton.addEventListener("click", onSearchCaptions);
    }
});

// Event handlers
// Function called when "Fetch Captions" button is clicked
async function onFetchCaptions() {
    const videoIdInput = document.getElementById("videoId").value;
    const videoId = videoIdInput.includes('youtube.com') || videoIdInput.includes('youtu.be') 
        ? extractVideoId(videoIdInput) 
        : videoIdInput;
    
    if (!videoId) {
        showError("Invalid YouTube Video ID or URL.");
        return;
    }
    console.log(videoId)
    try {
        const captionType = getSelectedCaptionType();
        const srtData = await api.fetchCaptions(videoId, captionType);
        document.getElementById("output").textContent = srtData.replace(/\\n/g, '\n');
    } catch (error) {
        // Handle the error, showError has already been called in fetchFromServer
        console.error(error);
    }
}

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

        const searchResult = await api.searchCaptions(captions, keyword, videoId, captionType);

        document.getElementById("search").textContent = searchResult;
    } catch (error) {
        // Error handling is done inside searchCaptions()
    } finally {
        hideLoading("loadingSearch");
    }
}


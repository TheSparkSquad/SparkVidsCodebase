function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
}

function getSelectedCaptionType() {
    return document.querySelector('input[name="captionType"]:checked').value;
}

async function fetchCaptions() {
    document.getElementById("summary").textContent = "";
    document.getElementById("search").textContent = "";
    let input = document.getElementById("videoId").value;
    const captionType = getSelectedCaptionType(); // Get the selected caption type


    if (!input) {
        alert("Please enter a YouTube Video ID or URL.");
        return;
    }

    let videoId = input.includes('youtube.com') || input.includes('youtu.be') ? extractVideoId(input) : input;
    
    if (!videoId) {
        alert("Invalid YouTube Video ID or URL.");
        return;
    }

    try {
        const response = await fetch(`/captions?videoId=${videoId}&captionType=${captionType}`);

        if (!response.ok) {
            throw new Error(`Failed with status: ${response.statusText}`);
        }

        let srtData = await response.text();
        srtData = srtData.replace(/\\n/g, '\n');

        // Update the <pre> tag's content with the fetched SRT data
        document.getElementById("output").textContent = srtData;

    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred. Please check the console for more details.");
    }
}


async function fetchSummary() {
    let captions = document.getElementById("output").textContent;
    let input = document.getElementById("videoId").value;

    if (!input) {
        alert("Please enter a YouTube Video ID or URL.");
        return;
    }

    const videoId = input.includes('youtube.com') || input.includes('youtu.be') ? extractVideoId(input) : input;
    
    if (!videoId) {
        alert("Invalid YouTube Video ID or URL.");
        return;
    }

    try {
        // Show the loading message
        document.getElementById("loading").style.display = "flex";

        const generateResponse = await fetch('/generateSummary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ captions: captions, videoId: videoId }) // Pass the videoId along with captions
        });

        // Hide the loading message
        document.getElementById("loading").style.display = "none";

        const summaryText = await generateResponse.text();
        document.getElementById("summary").textContent = summaryText;

    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred. Please check the console for more details.");
    }
}



async function searchCaptions() {
    document.getElementById("search").textContent = "";
    const input = document.getElementById("videoId").value;
    const keyword = document.getElementById("searchId").value;

    if (!input) {
        alert("Please enter a YouTube Video ID or URL.");
        return;
    }

    if (!keyword) {
        alert("Please enter a keyword to search for.");
        return;
    }

    const videoId = input.includes('youtube.com') || input.includes('youtu.be') ? extractVideoId(input) : input;
    
    if (!videoId) {
        alert("Invalid YouTube Video ID or URL.");
        return;
    }

    try {
        const response = await fetch(`/captions?videoId=${videoId}`);

        if (!response.ok) {
            throw new Error(`Failed with status: ${response.statusText}`);
        }

        let srtData = await response.text();
        srtData = srtData.replace(/\\n/g, '\n');

        // Update the <pre> tag's content with the fetched SRT data
        document.getElementById("output").textContent = srtData;

        // Call the fetchSearch function with the fetched captions
        fetchSearch(srtData, keyword);
    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred. Please check the console for more details.");
    }
}

async function fetchSearch(captions, keyword) {
    try {
        document.getElementById("loadingSearch").style.display = "flex";  // renamed loading id

        const generateResponse = await fetch('/generateSearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ captions: captions, keyword: keyword })
        });

        document.getElementById("loadingSearch").style.display = "none";  // renamed loading id

        const searchText = await generateResponse.text();
        document.getElementById("search").textContent = searchText;

    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred. Please check the console for more details.");
    }
}
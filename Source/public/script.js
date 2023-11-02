// To extract the video ID from a full YouTube link, you can use a regular expression. YouTube links come in the following formats:
// https://www.youtube.com/watch?v=VIDEO_ID
// https://youtu.be/VIDEO_ID
// https://www.youtube.com/embed/VIDEO_ID
// https://m.youtube.com/watch?v=VIDEO_ID
// Also attempts to truncate timestamps from url.
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
}


async function fetchCaptions() {
    
    document.getElementById("summary").textContent = "";
    let input = document.getElementById("videoId").value;

    if (!input) {
        alert("Please enter a YouTube Video ID or URL.");
        return;
    }

    // Check if the input looks like a URL and try extracting the video ID
    let videoId = input.includes('youtube.com') || input.includes('youtu.be') ? extractVideoId(input) : input;
    
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

        // Replace the \n string with actual newlines
        srtData = srtData.replace(/\\n/g, '\n');

        // Update the <pre> tag's content with the fetched SRT data
        document.getElementById("output").textContent = srtData;

        // Show the loading message
        document.getElementById("loading").style.display = "flex";

        const generateResponse = await fetch('/generateSummary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ captions: srtData })
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

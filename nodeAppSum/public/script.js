async function fetchCaptions() {
    const videoId = document.getElementById("videoId").value;
    
    if (!videoId) {
        alert("Please enter a YouTube Video ID.");
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

    } catch (error) {
        console.error("Failed to fetch captions:", error);
        alert("Error fetching captions. Please check the console for more details.");
    }
}

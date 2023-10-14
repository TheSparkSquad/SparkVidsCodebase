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

        // Show the loading message
        document.getElementById("loading").style.display = "flex"; 


        // After fetching captions, now generate the summary
        const generateResponse = await fetch('/generateSummary');
        if (!generateResponse.ok) {
            throw new Error('Failed to generate summary.');
        }

        // After generating summary, retrieve it
        const summaryResponse = await fetch('/getSummary');
        if (!summaryResponse.ok) {
            throw new Error('Failed to retrieve summary.');
        }
        const summaryData = await summaryResponse.text();


        // Hide the loading message
        document.getElementById("loading").style.display = "none";

        // Update the <pre> tag's content with the fetched summary
        document.getElementById("summary").textContent = summaryData;

    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred. Please check the console for more details.");
    }
}
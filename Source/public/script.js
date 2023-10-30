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
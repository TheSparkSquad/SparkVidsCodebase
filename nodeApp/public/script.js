async function fetchCaptions() {
    const videoId = document.getElementById("videoId").value;
    if (!videoId) {
        alert("Please enter a YouTube Video ID");
        return;
    }
    try {
        const response = await fetch(`/captions?videoId=${videoId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error("Failed to fetch captions:", error);
        alert("Failed to fetch captions.");
    }
}

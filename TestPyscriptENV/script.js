function displayURL() {
    var url = document.getElementById('videoURL').value;
    document.getElementById('displayedURL').innerText = 'You entered: ' + url;
}

document.addEventListener("DOMContentLoaded", function() {
    var summarizeButton = document.getElementById("summarizeButton");
    summarizeButton.addEventListener("click", displayURL);
});

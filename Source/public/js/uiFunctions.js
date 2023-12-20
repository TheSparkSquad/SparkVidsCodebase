function copyTextToClipboard() {
    var text = document.getElementById('textToCopy').innerText;
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        var successful = document.execCommand('copy');
        console.log(successful ? 'Text copied to clipboard' : 'Unable to copy');
    } catch (err) {
        console.error('Error in copying text: ', err);
    }

    document.body.removeChild(textarea);
}

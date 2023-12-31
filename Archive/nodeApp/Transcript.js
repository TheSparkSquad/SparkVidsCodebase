const xml2js = require('xml2js');
const fs = require('fs');


class Transcript {
    constructor(httpClient, videoId, url, language, languageCode, isGenerated, translationLanguages) {
        this._httpClient = httpClient;
        this.videoId = videoId;
        this._url = url;
        this.language = language;
        this.languageCode = languageCode;
        this.isGenerated = isGenerated;
        this.translationLanguages = translationLanguages;

        this._translationLanguagesDict = {};
        translationLanguages.forEach(lang => {
            this._translationLanguagesDict[lang.languageCode] = lang.language;
        });
    }
    async fetch(preserveFormatting = false) {
        // Make a fetch request
        const response = await this._httpClient(this._url, {
            headers: { 'Accept-Language': 'en-US' }
        });
    
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`Failed to fetch transcript data: ${response.statusText}`);
        }
    
        // Get the response text
        const rawText = await response.text();
    
        // Parse the raw HTML
        const captions = this._parseCaptionsFromHtml(rawText);
        return captions;
    }
    
    _parseCaptionsFromHtml(html) {
        const splittedHtml = html.split('"captions":');
    
        if (splittedHtml.length <= 1) {
            if (this.videoId.startsWith('http://') || this.videoId.startsWith('https://')) {
                throw new Error("InvalidVideoId");
            }
            if (html.includes('class="g-recaptcha"')) {
                throw new Error("TooManyRequests");
            }
            if (!html.includes('"playabilityStatus":')) {
                throw new Error("VideoUnavailable");
            }
            throw new Error("TranscriptsDisabled");
        }
    
        const jsonEndPosition = splittedHtml[1].indexOf(',"videoDetails"');
        const captionsJsonStr = splittedHtml[1].substring(0, jsonEndPosition).replace('\n', '');
        const captionsJson = JSON.parse(captionsJsonStr);
    
        // Depending on the structure of captionsJson, extract the relevant fields
        // and perform further checks or processing, then return the parsed data.
        // You may need additional logic here based on the exact structure of the data.
        return captionsJson;
    }
    





    // New method to parse and fetch captions using the provided JSON data
    async fetchCaptionsFromData(data) {
        // Extract the baseUrl from the provided data
        if (data.playerCaptionsTracklistRenderer && data.playerCaptionsTracklistRenderer.captionTracks) {
            const baseUrl = data.playerCaptionsTracklistRenderer.captionTracks[0].baseUrl;

            // Fetch the captions using the extracted baseUrl
            return await this.fetchCaptionsFromUrl(baseUrl);
        } else {
            throw new Error("Invalid data structure.");
        }
    }


    async fetchCaptionsFromUrl(baseUrl) {
        const response = await this._httpClient(baseUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch transcript data: ${response.statusText}`);
        }
        const xmlContent = await response.text();
    
        const srtContent = await this._convertXmlToSrt(xmlContent);
        this._saveSrtToFile(srtContent);
    
        return srtContent;  // Return SRT content
    }
    
    _convertXmlToSrt(xmlContent) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xmlContent, (err, result) => {
                if (err) {
                    return reject(err);
                }
    
                const texts = result.transcript.text;
                let srtOutput = '';
                
                texts.forEach((text, index) => {
                    srtOutput += (index + 1) + '\n';
                    
                    const start = parseFloat(text.$.start);
                    const end = start + parseFloat(text.$.dur);
                    
                    srtOutput += this._formatTime(start) + ' --> ' + this._formatTime(end) + '\n';
                    srtOutput += text._ + '\n\n';
                });
                
                resolve(srtOutput);
            });
        });
    }

    _formatTime(seconds) {
        const date = new Date(0);
        date.setSeconds(seconds);
        const hh = date.getUTCHours().toString().padStart(2, '0');
        const mm = date.getUTCMinutes().toString().padStart(2, '0');
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        const ms = (seconds * 1000 % 1000).toString().padStart(3, '0');

        return `${hh}:${mm}:${ss},${ms}`;
    }

    // New method to save only the text content to a .txt file
    _saveTextToFile(textContent) {
        fs.writeFile('captions.txt', textContent, (err) => {
            if (err) {
                console.error("Error writing to text file:", err);
            } else {
                console.log("Text saved to captions.txt");
            }
        });
    }
    
    _saveSrtToFile(srtContent) {
        // Save the SRT content as before
        fs.writeFile('captions.srt', srtContent, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
            } else {
                console.log("SRT saved to captions.srt");
            }
        });

        // Extract text content from the SRT content
        const textContent = srtContent
            .split('\n')
            .filter(line => !(/^\d+$/.test(line) || line.includes('-->')))
            .join('\n')
            .trim();

        // Save the extracted text content to a .txt file
        this._saveTextToFile(textContent);
    }

    toString() {
        return `${this.languageCode} ("${this.language}")${this.isTranslatable ? '[TRANSLATABLE]' : ''}`;
    }

    get isTranslatable() {
        return this.translationLanguages.length > 0;
    }

    translate(languageCode) {
        if (!this.isTranslatable) {
            throw new Error('Not Translatable');
        }

        if (!this._translationLanguagesDict[languageCode]) {
            throw new Error('Translation Language Not Available');
        }

        return new Transcript(
            this._httpClient,
            this.videoId,
            `${this._url}&tlang=${languageCode}`,
            this._translationLanguagesDict[languageCode],
            languageCode,
            true,
            []
        );
    }

}
module.exports = Transcript;

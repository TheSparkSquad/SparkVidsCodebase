
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

    // Use the given URL to fetch the captions directly
    async fetchCaptionsFromUrl(baseUrl) {
        const response = await this._httpClient(baseUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch transcript data: ${response.statusText}`);
        }
        return await response.text();  // Assuming the response contains raw captions text
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

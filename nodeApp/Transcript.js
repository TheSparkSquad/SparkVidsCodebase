
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

        // Get the response text and directly return it without any parsing
        const rawText = await response.text();
        return rawText;
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

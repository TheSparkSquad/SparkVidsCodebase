const ApiEndpoint = require('./apiEndpoint');

class BartApi extends ApiEndpoint {
    constructor(apiToken) {
        super();
        this.apiToken = apiToken;
    }

    async fetchWrapper() {
        if (!this.fetch) {
            const { default: fetch } = await import('node-fetch');
            this.fetch = fetch;
        }
        return this.fetch;
    }

    /**
     * Implements the generateSummary method from ApiEndpoint.
     * Since BART does not use prompting, summaryType is defaulted to 'basic'.
     * 
     * @param {string} transcript - The transcript to be summarized.
     * @param {string} [summaryType='basic'] - Type of summary, defaulted to 'basic'.
     * @returns {Promise<string>} - The summarized text.
     */
    async generateSummary(transcript, summaryType = 'basic') {
        const response = await this.queryBartModel({ inputs: transcript });
        return response[0].summary_text;
    }

    async queryBartModel(data) {
        const fetch = await this.fetchWrapper();

        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
                headers: { Authorization: `Bearer ${this.apiToken}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        return await response.json();
    }
}

module.exports = BartApi;

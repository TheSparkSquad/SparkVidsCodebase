const ApiEndpoint = require('./apiEndpoint');

class PegasusApi extends ApiEndpoint {
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
     * 
     * @param {string} transcript - The transcript to be summarized.
     * @param {string} [summaryType='basic'] - The type of summary (basic or advanced).
     * @returns {Promise<string>} - The summarized text.
     */
    async generateSummary(transcript, summaryType = 'basic') {
        // Example usage of summaryType (This can be adapted based on specific requirements)
        let apiUrl = "https://api-inference.huggingface.co/models/google/pegasus-xsum";


        const response = await this.queryPegasusModel({ inputs: transcript }, apiUrl);
        return response[0].summary_text;
    }

    async queryPegasusModel(data, apiUrl) {
        const fetch = await this.fetchWrapper();

        const response = await fetch(apiUrl, {
            headers: { Authorization: `Bearer ${this.apiToken}` },
            method: "POST",
            body: JSON.stringify(data),
        });
        return await response.json();
    }
}

module.exports = PegasusApi;

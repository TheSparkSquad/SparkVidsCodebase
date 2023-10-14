const { default: OpenAI } = require('openai');

/**
 * OpenAiApi class encapsulates interactions with the OpenAI API.
 */
class OpenAiApi {
    /**
     * Constructor for the OpenAiApi class.
     * Initializes the OpenAI API client.
     * 
     * @param {string} apiKey - API key for the OpenAI API.
     */
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Fetches completions from the OpenAI chat API.
     * 
     * @param {string} inputString - The string input for which the completion is sought.
     * @returns {string} - Completed message content.
     */
    async chatCompletion(inputString) {
        const chatResponse = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: inputString }],
            model: 'gpt-3.5-turbo',
        });

        return chatResponse.choices[0].message.content;
    }

    /**
     * Summarizes a given text using the OpenAI chat API.
     * 
     * @param {string} text - The text that needs to be summarized.
     * @returns {Promise<string>} - The summarized text.
     */
    async summarize(text) {
        const prompt = `Summarize the following text taken from a video, be brief \n\n${text}`;
        return this.chatCompletion(prompt);
    }
}

// Exports the OpenAiApi class to be used in other modules.
module.exports = OpenAiApi;

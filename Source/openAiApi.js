const { default: OpenAI } = require('openai');
const ApiEndpoint = require('./apiEndpoint');
const readline = require('readline');

class OpenAiApi extends ApiEndpoint {
    constructor(apiKey) {
        super();
        this.openai = new OpenAI({ apiKey });
    }

    async generateSummary(captionsData, summaryType) {
        // Build the prompt based on summaryType
        const prompt = this.buildPromptForSummarization(captionsData, summaryType);
        return this.chatCompletion(prompt);
    }

    async generateSearch(text, keyword) {
        if (!text || !keyword) {
            throw new Error('Text and keyword must be provided for search.');
        }

        console.log(`Making search API call with keyword: ${keyword}`);
        const prompt = this.constructSearchPrompt(text, keyword);
        return this.chatCompletion(prompt);
    }

    constructSearchPrompt(text, keyword) {
        return `From the following transcript, identify every major instance where the word '${keyword}' is used. Provide the exact sentence or line with its timestamp. For instance, if the keyword was "apple" and it appeared in the line "I love apple pies at 00:05:00", make sure to include the line with the timestamp.
        Based on this, find the instances of '${keyword}':
        ${text}`;
    }

    async chatCompletion(inputString) {
        console.log(`Making chat completion API call`);
        const chatResponse = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: inputString }],
            model: 'gpt-3.5-turbo-16k',
        });

        return chatResponse.choices[0].message.content;
    }

    buildPromptForSummarization(text, summaryType) {
        switch(summaryType) {
            case 'TXT':
                return `Summarize the following text taken from a video as a numbered list:\n\n${text}`;
            case 'EMOJI':
                return `Summarize the following text taken from a video as bulleted list that incorporates emojis:\n\n${text}`;
            case 'USER':
                return this.getUserInput();
            case 'SIMPLE':
                return `Summarize the following text taken from a video as numbered table of contents:\n\n${text}`;
            default:
                throw new Error('Invalid format specified. Allowed formats are TXT, EMOJI, USER, or SIMPLE.');
        }
    }

    async getUserInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise(resolve => {
            rl.question('Please enter a custom prompt: ', (userInput) => {
                rl.close();
                resolve(userInput);
            });
        });
    }
}

module.exports = OpenAiApi;

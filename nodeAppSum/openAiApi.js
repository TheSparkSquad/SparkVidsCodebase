const { default: OpenAI } = require('openai');

class OpenAiApi {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
    }

    async chatCompletion(inputString) {
        const chatResponse = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: inputString }],
            model: 'gpt-3.5-turbo',
        });

        return chatResponse.choices[0].message.content;
    }

    async summarize(text) {
        const prompt = `Summarize the following text taken from a video, \n\n${text}`;
        return this.chatCompletion(prompt);
    }
}

module.exports = OpenAiApi;

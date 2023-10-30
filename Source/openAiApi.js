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
//        const prompt = `Use the timestamps to correctly summarize the content into chronological subjects in a way that flows nicely. Keep the timestamps in the output and format nicely. Be brief. \n${text}`;
        //const prompt = `Use the timestamps to correctly summarize the content into a table of contents for the video. \n\n${text}`;
        const prompt = `Please try to capture the essence of the transcript from an educational video I have provided. Then give me numbered list of the topics with the timestamps included. I want the topic discussed not the content itself in the bullet points. \n\n${text}`
        //const prompt =  `Use the timestamps to correctly summarize the content into a table of contents for the video.  \n\n${text}`;
        //const prompt = `Summarize the following text taken from a video, \n\n${text}`;
        //const prompt = `Summarize the following text taken from a video and write it in table of contents format. Include the timestamps in bullet points. \n\n${text}`;
        //const prompt = `Summarize the following input from a video output in table of contents format. Make sure to get the subject matter as the title of the numerical bullet point and then a brief description under it. This is a caption track from a youtube video so treat it accordingly. \n\n${text}`;
        return this.chatCompletion(prompt);
    }

// EXAMPLE OF THE OUTPUT I WANT
//     Table of Contents:

// Table of Contents:

// 1. Introduction (00:00:00-00:00:18)
//    - First date nerves and the idea of a PowerPoint presentation

// 2. Antonio's Presentation (00:00:19-00:02:33)
//    - Introduction and name slide
//    - Duplicated slides and confusion
//    - Antonio's best qualities and pictures

// 3. Logan's Presentation (00:02:34-00:04:04)
//    - Introduction and name slide
//    - Twitch streamer and meme enthusiast

    /* Future features and implementations, 
        summarize function that accepts a string to append to the prompt from arguments
        ability to summarize srt content and timestamps
        ability to construct table of contents 
        ability for user to specify a keyword in video and return timestamp and content
    */

}

// Exports the OpenAiApi class to be used in other modules.
module.exports = OpenAiApi;

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
            model: 'gpt-4-1106-preview',
            // model: 'gpt-3.5-turbo-1106',
            // model: 'gpt-3.5-turbo-16k',
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
        // const prompt = `Use the timestamps to correctly summarize the content into chronological subjects in a way that flows nicely. Keep the timestamps in the output and format nicely. Be brief. \n${text}`;
        //const prompt = `Use the timestamps to correctly summarize the content into a table of contents for the video. \n\n${text}`;
        //const prompt = `Please try to capture the essence of the transcript from an educational video I have provided. Then give me numbered list of the topics with the timestamps included. I want the topic discussed not the content itself in the bullet points. \n\n${text}`
        //const prompt =  `Use the timestamps to correctly summarize the content into a table of contents for the video.  \n\n${text}`;
        //const prompt = `Summarize the following text taken from a video, \n\n${text}`;
        /*const prompt = `I have a transcript from an educational video. I need you to process the following text and provide me with a numbered list, acting as a table of contents. Each entry should have a timestamp and capture the main topic being discussed, not the detailed content. Structure it as follows:
        1. Topic Name (timestamp)
           - Brief description or sub-topic
        2. Second Topic
        Here's the transcript:
        ${text}`;*/
        const prompt = `Summarize the following text taken from a video as emojis, \n\n${text}`;

        
        //const prompt = `Summarize the following text taken from a video and write it in table of contents format. Include the timestamps in bullet points. \n\n${text}`;
        //const prompt = `Summarize the following input from a video output in table of contents format. Make sure to get the subject matter as the title of the numerical bullet point and then a brief description under it. This is a caption track from a youtube video so treat it accordingly. \n\n${text}`;
        return this.chatCompletion(prompt);
    }

    async search(text, keyword) {        
        // const prompt = `From the provided video transcript, I'd like you to find all major instances where the word '${keyword}' appears. Use the timestamps to give context. Present your findings as a numbered list. Here's the transcript:
        // ${text}`;
        const prompt = `From the following transcript, identify every major instance where the word '${keyword}' is used. Provide the exact sentence or line with its timestamp. For instance, if the keyword was "apple" and it appeared in the line "I love apple pies at 00:05:00", make absolutely sure that if you output something that it actually has the word specified in it.
        Each numbered output should contain the word light in it, and a couple words before and after the word light comes up.

        you should return:
        Example:
        Number of occurances: 1

        1. 00:05:00 - I love apple pies.
        
        Based on this, find the instances of '${keyword}':
        ${text}`;

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

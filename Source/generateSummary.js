const fs = require('fs');
let SummarizerManager = require("node-summarizer").SummarizerManager;
const OpenAiApi = require('./openAiApi');  // importing the OpenAiApi class from the external module
require("dotenv").config();


class FileReader {
    constructor(fileName) {
        this.fileName = fileName;
    }

    readFile() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.fileName, 'utf8', (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}

class FileWriter {
    constructor(fileName) {
        this.fileName = fileName;
    }
    writeFile(content) {
        return new Promise((resolve, reject) => {
            if (typeof content !== "string") {
                reject(new Error("Content is not a string"));
                return;
            }
            fs.writeFile(this.fileName, content, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
    
}

function decodeHTMLEntities(text) {
    return text.replace(/&#39;/g, "'");
}



function processText(text) {
    // Split the text into lines
    const lines = text.split('\n');

    // Process each line
    const processedLines = lines.map(line => {
        // Decode HTML entities
        line = decodeHTMLEntities(line);

        // Trim spaces and replace multiple spaces with a single one
        return line.trim().replace(/\s+/g, ' ');
    });

    // Combine the processed lines back into a string
    return processedLines.join('\n');
}

function ensureContentSize(fileName, maxSize) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) reject(err);
            
            if (data.length > maxSize) {
                data = data.substring(0, maxSize); // truncate to the first 1000 characters
                fs.writeFile(fileName, data, (err) => {
                    if (err) reject(err);
                    console.warn(`File content exceeded ${maxSize} characters and was truncated.`);
                    resolve(data);
                });
            } else {
                resolve(data);
            }
        });
    });
}


class SummarizerAPI {
    constructor(content, method) {
        this.content = content;
        this.method = method;
    }

    async summarize(numberOfSentences) {
        let Summarizer = new SummarizerManager(this.content, numberOfSentences);
        if (this.method === 'Rank') {
            let test = await Summarizer.getSummaryByRank().then(summary_object => summary_object.summary);
            //console.log(test); // Note: using console.log here
            return test;
        } else if (this.method === 'Frequency') {
            return Promise.resolve(Summarizer.getSummaryByFrequency().summary);
        }
    }
}


class GenerateSummary {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(inputFile, outputFile) {
        try {  
            //wihtout optimizing srt input file, only about 8000 characters are possible.
            await ensureContentSize(inputFile, 15000);
            const openApi = new OpenAiApi(this.apiKey);  
            const fileReader = new FileReader(inputFile);
            let content = await fileReader.readFile();
            content = processText(content);
            //console.log(content);
            const summary = await openApi.summarize(content);
            const fileWriter = new FileWriter(outputFile);
            await fileWriter.writeFile(summary);
            console.log(`Summary written to ${outputFile}!`);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
module.exports = GenerateSummary;
/*
const generateSummary = new GenerateSummary("api key here");
generateSummary.executeFlow('captions.txt', 'summary.txt');
*/

//OLD FREE NODE API
//parent.executeFlow('captions.txt', 'summary.txt', 'Frequency');
//module.exports = GenerateSummary;

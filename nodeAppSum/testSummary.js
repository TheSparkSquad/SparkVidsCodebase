const fs = require('fs');
let SummarizerManager = require("node-summarizer").SummarizerManager;

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

class SummarizerAPI {
    constructor(content, method) {
        this.content = content;
        this.method = method;
    }

    async summarize(numberOfSentences) {
        let Summarizer = new SummarizerManager(this.content, numberOfSentences);
        if (this.method === 'Rank') {
            let abc = await Summarizer.getSummaryByRank().then(summary_object => summary_object.summary);
            console.log(abc); // Note: using console.log here
            return abc;
        } else if (this.method === 'Frequency') {
            return Promise.resolve(Summarizer.getSummaryByFrequency().summary);
        }
    }
    
}

class FileWriter {
    constructor(fileName) {
        this.fileName = fileName;
    }

    writeFile(content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.fileName, content, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

class ParentClass {
    async executeFlow(inputFile, outputFile, summaryMethod) {
        try {
            const fileReader = new FileReader(inputFile);
            const content = await fileReader.readFile();

            const summarizer = new SummarizerAPI(content, summaryMethod);
            const summary = await summarizer.summarize(5);

            const fileWriter = new FileWriter(outputFile);
            await fileWriter.writeFile(summary);
            console.log(`Summary written to ${outputFile}!`);
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

const parent = new ParentClass();
parent.executeFlow('captions.txt', 'summary.txt', 'Rank');

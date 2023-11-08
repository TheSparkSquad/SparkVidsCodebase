// const fetch = require("node-fetch"); // Uncomment this line if you're not using ES6 imports
require("dotenv").config();
const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

query({
  inputs: "The history of the internet dates back significantly further than that of the World Wide Web. It began in the 1960s as a United States government project to build robust, fault-tolerant communication via computer networks. This project led to the development of ARPANET (Advanced Research Projects Agency Network), which became the first major packet-switching network to employ the TCP/IP protocol suite. Throughout the 1970s and 1980s, the network expanded as researchers, universities, and institutions connected to it. The introduction of the Domain Name System (DNS) in 1984 made the network more user-friendly, and the number of users began to explode with the advent of the World Wide Web in the early 1990s, invented by Tim Berners-Lee. The web's growth was further spurred by the development of the Mosaic web browser in 1993, which made the internet more accessible to the general public. The mid-1990s saw the commercialization of the internet, as telecommunications companies moved in to provide private backbones and internet access. By the end of the decade, the internet had become a global phenomenon, reshaping commerce, communication, and entertainment. The early 21st century brought about a new era of connectivity, with the rise of mobile internet access and the proliferation of social media platforms. This has led to significant changes in society, from the way we shop and consume media, to the manner in which we communicate and participate in civic life."
}).then((response) => {
    console.log(JSON.stringify(response));
});

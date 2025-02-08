const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
function generateRandomString(length = 1000) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function encoding_format_float(inputSize) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(inputSize),
        encoding_format: "float"
    });
    // console.log(emb.data[0].embedding);
    // return the length of the stringified object as the benchmark
    return JSON.stringify(emb).length;
}

async function encoding_format_base64(inputSize) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(inputSize),
        encoding_format: "base64"
    });
    // console.log(emb.data[0].embedding);
    // return the length of the stringified object as the benchmark
    return JSON.stringify(emb).length;
}

async function encoding_format_default(inputSize) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(inputSize)
    });
    // console.log(emb.data[0].embedding);
    // return the length of the stringified object as the benchmark
    return JSON.stringify(emb).length;
}

// encoding_format_base64(1_000).then(console.log);
// encoding_format_float(1_000).then(console.log);
// encoding_format_default(1_000).then(console.log);


module.exports.__benchmarks__ = [
    [
        encoding_format_float.bind(null, 1_000),
        encoding_format_base64.bind(null, 1_000),
        `1kb embedding: base64 vs float32`
    ]
];
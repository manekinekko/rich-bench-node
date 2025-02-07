const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: "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",
});
function generateRandomString(length = 1000) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function encoding_format_float(){
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(1000),
        encoding_format: "float"
    });

    // return the length of the stringified object as the benchmark
    return JSON.stringify(emb).length;
}

async function encoding_format_base64(){
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(1000),
        encoding_format: "base64"
    });

    // return the length of the stringified object as the benchmark
    return JSON.stringify(emb).length;
}

async function encoding_format_default() {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(1000),
    });

    // return the length of the stringified object as the benchmark
    return JSON.stringify(emb).length;
}

module.exports.__benchmarks__ = [
    [
        encoding_format_float,
        encoding_format_base64,
        "Size of returned JSON: float vs base64"
    ],
    [

        encoding_format_float,
        encoding_format_default,
        "Size of returned JSON: float vs default"
    ],
    [

        encoding_format_base64,
        encoding_format_default,
        "Size of returned JSON: base64 vs default"
    ]
];
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
function generateRandomString(length = 1000) {
    // 100 tokens (197 chars)
    return "uskaltflczirpnyxkjewssnjrgrtezodofkxljzoywglqvoaltztdbvmaxcogsjauczfbryytqqbibchxosdoelitxpzgvpdjndwvhixxstvkkxfalkdwsbrerukethruskaltflczirpnyxkjewssnjrgrtezodofkxljzoywglqvoaltztdbvmaxcogsjauczfb";
}

async function encoding_format_float(inputSize) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(inputSize),
        encoding_format: "float"
    });
    const bytes = new Blob([emb.data[0].embedding]).size;
    // console.log(bytes);
    // return the length of the stringified object as the benchmark
    return bytes;
}

async function encoding_format_base64(inputSize) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(inputSize),
        encoding_format: "base64"
    });
    const bytes = new Blob([emb.data[0].embedding]).size;
    // console.log(bytes);
    // return the length of the stringified object as the benchmark
    return bytes;
}


module.exports.__benchmarks__ = [
    [
        encoding_format_float.bind(null, 1_000),
        encoding_format_base64.bind(null, 1_000),
        `1kb embedding: base64 vs float32`
    ]
];
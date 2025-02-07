# Rich-Bench for Node.js
*A Tiny Benchmarking Tool for Node.js*  (this is a port of the original python tool [rich-bench](https://github.com/tonybaloney/rich-bench) by [Anthony Shaw](https://github.com/tonybaloney))  

## 🚀 Overview
`rich-bench` is a simple CLI tool that benchmarks JavaScript functions and provides a **richly formatted performance comparison**.  
It measures execution time, computes performance gains, and generates insightful statistics.  

## 📦 Installation

### 1️⃣ Install Locally for Development
```bash
git clone https://github.com/your-username/rich-bench.git
cd rich-bench
npm install
npm link  # Enable CLI usage globally
```

## 🛠 Usage

### Basic Benchmark Execution
```bash
rich-bench benchmarks/
```

### Run a Specific Benchmark
```bash
rich-bench benchmarks/ --benchmark encoding_format
```

### Show Percentage Instead of Multipliers
```bash
rich-bench benchmarks/ --percentage
```

This will show the performance gains as percentages instead of multipliers.
```
┌──────────────────────────────────────────┬──────────┬───────────┬───────────┬─────────────────┬─────────────────────┬────────────────────┐
│ Benchmark                                │ Min (ms) │  Max (ms) │ Mean (ms) │         Min (+) │             Max (+) │           Mean (+) │
├──────────────────────────────────────────┼──────────┼───────────┼───────────┼─────────────────┼─────────────────────┼────────────────────┤
│ Size of returned JSON: float vs base64   │   73.376 │ 19666.000 │  9844.744 │  44.430 (39.4%) │    8351.000 (57.5%) │   4213.139 (57.2%) │
└──────────────────────────────────────────┴──────────┴───────────┴───────────┴─────────────────┴─────────────────────┴────────────────────┘
```

### Repeat Benchmark Execution
```bash
rich-bench benchmarks/ --repeat 100
```

### Run benchmarks N times
```bash
rich-bench benchmarks/ --times 100
```

> [!NOTE]
> 
> If the benchmarked functions returns a value, it will be used as the benchmark value and the function will be called 1 time, but still repeated `--repeat` times.
> If the benchmarked functions does not return a value, the execution time will be used as the benchmark value. `--repeat`and `--times` will be used.

## 📊 Example Output
```bash
┌──────────────────────────────────────────┬──────────┬───────────┬───────────┬───────────────┬──────────────────┬─────────────────┐
│ Benchmark                                │ Min (ms) │  Max (ms) │ Mean (ms) │       Min (+) │          Max (+) │        Mean (+) │
├──────────────────────────────────────────┼──────────┼───────────┼───────────┼───────────────┼──────────────────┼─────────────────┤
│ Size of returned JSON: float vs base64   │   62.825 │ 19651.000 │  9861.410 │ 51.549 (1.2x) │  8351.000 (2.4x) │ 4217.198 (2.3x) │
├──────────────────────────────────────────┼──────────┼───────────┼───────────┼───────────────┼──────────────────┼─────────────────┤
│ Size of returned JSON: float vs default  │   47.765 │ 19633.000 │  9852.893 │ 60.384 (0.8x) │ 19611.000 (1.0x) │ 9841.065 (1.0x) │
├──────────────────────────────────────────┼──────────┼───────────┼───────────┼───────────────┼──────────────────┼─────────────────┤
│ Size of returned JSON: base64 vs default │   44.447 │  8351.000 │  4214.801 │ 45.261 (1.0x) │ 19641.000 (0.4x) │ 9849.066 (0.4x) │
└──────────────────────────────────────────┴──────────┴───────────┴───────────┴───────────────┴──────────────────┴─────────────────┘
```

## 📑 Writing a Benchmark
Create a `bench_*.js` file inside `benchmarks/` and export an array of benchmark functions:

```javascript
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
```

Then run:  
```bash
npx rich-bench benchmarks/
```

## Features
✔ **Compares two functions side by side**  
✔ **Displays min, max, and mean execution times**  
✔ **Highlights performance gains with colors**  



## Credits

Shoutout to [Anthony Shaw](https://github.com/tonybaloney) for creating the original [rich-bench](https://github.com/tonybaloney/rich-bench) tool in Python.

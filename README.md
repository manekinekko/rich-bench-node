# Rich-Bench for Node.js
*A Tiny Benchmarking Tool for Node.js*  (this is a port of the original python tool [rich-bench](https://github.com/tonybaloney/rich-bench) by [Anthony Shaw](https://github.com/tonybaloney))  

## 🚀 Overview
`rich-bench` is a simple CLI tool that benchmarks JavaScript functions and provides a **richly formatted performance comparison**.  
It measures execution time, computes performance gains, and generates insightful statistics.  

## 📦 Installation

### 1️⃣ Install Locally for Development
```bash
git clone https://github.com/manekinekko/rich-bench-node.git
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
```text
┌────────────┬──────────┬───────────┬───────────┬─────────────────┬─────────────────────┬────────────────────┐
│ Benchmark  │ Min (ms) │  Max (ms) │ Mean (ms) │         Min (+) │             Max (+) │           Mean (+) │
├────────-───┼──────────┼───────────┼───────────┼─────────────────┼─────────────────────┼────────────────────┤
│    #1      │   73.376 │ 19666.000 │  9844.744 │  44.430 (39.4%) │    8351.000 (57.5%) │   4213.139 (57.2%) │
└────────────┴──────────┴───────────┴───────────┴─────────────────┴─────────────────────┴────────────────────┘
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
```text
┌───────────┬──────────┬───────────┬───────────┬───────────────┬──────────────────┬─────────────────┐
│ Benchmark │ Min (ms) │  Max (ms) │ Mean (ms) │       Min (+) │          Max (+) │        Mean (+) │
├───────────┼──────────┼───────────┼───────────┼───────────────┼──────────────────┼─────────────────┤
│    #1     │   62.825 │ 19651.000 │  9861.410 │ 51.549 (1.2x) │  8351.000 (2.4x) │ 4217.198 (2.3x) │
├───────────┼──────────┼───────────┼───────────┼───────────────┼──────────────────┼─────────────────┤
│    #2     │   47.765 │ 19633.000 │  9852.893 │ 60.384 (0.8x) │ 19611.000 (1.0x) │ 9841.065 (1.0x) │
├───────────┼──────────┼───────────┼───────────┼───────────────┼──────────────────┼─────────────────┤
│    #3     │   44.447 │  8351.000 │  4214.801 │ 45.261 (1.0x) │ 19641.000 (0.4x) │ 9849.066 (0.4x) │
└───────────┴──────────┴───────────┴───────────┴───────────────┴──────────────────┴─────────────────┘
```

## 📑 Writing a Benchmark
Create a `bench_*.js` file inside `benchmarks/` and export an array of benchmark functions:

```javascript
async function encoding_format_float(inputSize) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(inputSize),
        encoding_format: "float"
    });
    return new Blob([emb.data[0].embedding]).size; // return bytes as the benchmark
}

async function encoding_format_base64(inputSize) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: generateRandomString(inputSize),
        encoding_format: "base64"
    });
    return new Blob([emb.data[0].embedding]).size; // return bytes as the benchmark
}

module.exports.__benchmarks__ = [
    [
        encoding_format_float,
        encoding_format_base64,
        "bench #1"
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

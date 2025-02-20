const { performance } = require("perf_hooks");
const fs = require("fs");
const path = require("path");
const Table = require("cli-table3");
const argparse = require("argparse");

const DEFAULT_REPEAT = 5;
const DEFAULT_TIMES = 5;

/**
 * Formats the performance difference between two benchmarks.
 */
function formatDelta(a, b, d, perc = false) {
  let color = "\x1b[32m"; // Green by default (improvement)
  if (a > b) {
    color = "\x1b[31m"; // Red (worse performance)
    d = -d;
  }

  const reset = "\x1b[0m"; // Reset color
  const x = b / a;
  return perc
    ? `${color}${a.toFixed(3)} (${d.toFixed(1)}%)${reset}`
    : `${color}${a.toFixed(3)} (${x.toFixed(1)}x)${reset}`;
}

const isNumeric = (n) => Number.isFinite(n);

/**
 * Runs a function multiple times and measures execution time.
 */
async function benchmarkFunction(func, repeat, times) {
  const results = [];
  let funcResult = undefined;
  run: for (let i = 0; i < repeat; i++) {
    console.log(`Running benchmark ${func.name} (${i + 1}/${repeat})`);
    const start = performance.now();
    for (let j = 0; j < times; j++) {
      const funcResult = await func();

      // If the function returns a numeric value, we use that result as the benchmark
      // instead of the time it took to execute the function.
      // Then we break out of the loop and run the next repeat,
      // so that the function would be run once.
      // It doesn't make sense to run the function multiple times,
      // if the function returns the same numeric value
      if (isNumeric(funcResult)) {
        results.push(funcResult);
        continue run;
      }
    }

    // only compute the execution time if the function didn't return a value
    // this will be our benchmark
    if (!funcResult) {
      const end = performance.now();
      results.push((end - start) / times);
    }
  }
  return results;
}

/**
 * Computes statistics from a list of numbers.
 */
function computeStats(results) {
  const min = Math.min(...results);
  const max = Math.max(...results);
  const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
  return { min, max, mean };
}

/**
 * Main function to run benchmarks.
 */
async function main() {
  const parser = new argparse.ArgumentParser();
  parser.add_argument("--profile", {
    help: "Profile the benchmarks and store in .profiles",
    action: "store_true",
  });
  parser.add_argument("--benchmark", {
    help: "Run a specific benchmark",
    default: null,
  });
  parser.add_argument("--repeat", {
    type: "int",
    default: DEFAULT_REPEAT,
    help: "Number of repetitions",
  });
  parser.add_argument("--times", {
    type: "int",
    default: DEFAULT_TIMES,
    help: "Number of runs per repetition",
  });
  parser.add_argument("--percentage", {
    action: "store_true",
    help: "Show percentage instead of multiplier",
  });
  parser.add_argument("--unit", { default: "ms", help: "Unit of measurement" });
  parser.add_argument("--title", {
    default: "Benchmark",
    help: "Title of the benchmark",
  });
  parser.add_argument("target", {
    nargs: "+",
    help: "Target directory containing benchmarks",
  });

  const args = parser.parse_args();

  if (args.profile) {
    console.log("Profiling is not supported yet.");
    return;
  }

  const table = new Table({
    head: [
      args.title,
      `Min (${args.unit})`,
      `Max (${args.unit})`,
      `Mean (${args.unit})`,
      "Min (+)",
      "Max (+)",
      "Mean (+)",
    ],
    colAligns: ["left", "right", "right", "right", "right", "right", "right"],
  });

  let count = 0;

  const stats = [];

  for (const targetDir of args.target) {
    const fullPath = path.resolve(targetDir);
    if (!fs.existsSync(fullPath)) {
      console.error(`Directory not found: ${fullPath}`);
      continue;
    }

    const benchmarkFiles = fs
      .readdirSync(fullPath)
      .filter((file) => file.startsWith("bench_") && file.endsWith(".js"));

    for (const file of benchmarkFiles) {
      if (args.benchmark && file !== `bench_${args.benchmark}.js`) continue;

      const benchmarkModule = require(path.join(fullPath, file));
      if (!benchmarkModule.__benchmarks__) continue;

      for (const [func1, func2, desc] of benchmarkModule.__benchmarks__) {
        count++;

        const results1 = await benchmarkFunction(
          func1,
          args.repeat,
          args.times,
          args
        );
        const results2 = await benchmarkFunction(
          func2,
          args.repeat,
          args.times,
          args
        );

        const stats1 = computeStats(results1);
        stats.push(results1);

        const stats2 = computeStats(results2);
        stats.push(results2);

        const deltaMin = (Math.abs(stats2.min - stats1.min) / stats1.min) * 100;
        const deltaMax = (Math.abs(stats2.max - stats1.max) / stats1.max) * 100;
        const deltaMean =
          (Math.abs(stats2.mean - stats1.mean) / stats1.mean) * 100;

        table.push([
          desc,
          stats1.min.toFixed(3),
          stats1.max.toFixed(3),
          stats1.mean.toFixed(3),
          formatDelta(stats2.min, stats1.min, deltaMin, args.percentage),
          formatDelta(stats2.max, stats1.max, deltaMax, args.percentage),
          formatDelta(stats2.mean, stats1.mean, deltaMean, args.percentage),
        ]);
      }
    }
  }

  if (count === 0) {
    console.log("No benchmarks found.");
    return;
  }

  console.log(table.toString());
  console.log(`Total benchmarks: ${count}`);
  console.log(`Total time: ${performance.now().toFixed(3)}ms`);
  console.log(`Average time: ${(performance.now() / count).toFixed(3)}ms`);
}

main().catch(console.error);

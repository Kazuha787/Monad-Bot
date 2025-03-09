const prompts = require("prompts");
const displayHeader = require("./src/banner.js");
displayHeader();

console.log("List Modul AUTO\n");

console.log(`â© Uniswap`.red);
console.log(`â© Rubic Swap`.red);
console.log(`â© Magma Staking`.red);
console.log(`â© Izumi Swap`.red);
console.log(`â© Kitsu Staking`.red);
console.log(`â© aPriori Staking`.red);
console.log(`â© Auto Send`.red);
console.log("");

const scripts = [
  { name: "Uniswap", path: "./modul/uniswap.js" },
  { name: "Rubic Swap", path: "./modul/rubic.js" },
  { name: "Magma Staking", path: "./modul/magma.js" },
  { name: "Izumi Swap", path: "./modul/izumi.js" },
  { name: "Kitsu Staking", path: "./modul/kitsu.js" },
  { name: "aPriori Staking", path: "./modul/apriori.js" },
  { name: "Auto Send", path: "./modul/send.js" },
];

const { spawn } = require("child_process");

async function runScript(script) {
  console.log(`\nâœ… Running ${script.name}...`);

  return new Promise((resolve, reject) => {
    const process = spawn("node", [script.path]);

    process.stdout.on("data", (data) => console.log(data.toString()));
    process.stderr.on("data", (data) => console.error(data.toString()));

    process.on("close", (code) => {
      if (code === 0) {
        console.log(`? Finished ${script.name}`);
        resolve();
      } else {
        console.error(`âŒ Error in ${script.name} (Exit code: ${code})`);
        reject(new Error(`Script ${script.name} failed`));
      }
    });
  });
}

async function runScriptsSequentially(loopCount) {
  for (let i = 0; i < loopCount; i++) {
    for (const script of scripts) {
      await runScript(script);
    }
  }
}

async function main() {
  while (true) {
    const response = await prompts({
      type: "number",
      name: "loopCount",
      message: "Looping : ",
      validate: (value) => (value > 0 ? true : "Enter a valid number greater than 0"),
    });

    const loopCount = response.loopCount || 1;
    console.log(`\nâœ…âœ… Executing all scripts ${loopCount} times...\n`);
    
    await runScriptsSequentially(loopCount);

    console.log("\nâœ…âœ… All scripts have been executed\n");
  }
}

main();

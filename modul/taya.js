import dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import readline from "readline";
import ora from "ora";
import cfonts from "cfonts";

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SWAP_CONTRACT = "0x4ba4bE2FB69E2aa059A551Ce5d609Ef5818Dd72F";
const WMON = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
const TOKENS = [
    "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // USDC
    "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37", // WETH
    "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714", // DAK
    "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50"  // YAKI
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

(async () => {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        const routerContract = new ethers.Contract(
            SWAP_CONTRACT,
            [
                "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
                "function getAmountsOut(uint amountIn, address[] calldata path) view returns (uint[] memory amounts)"
            ],
            wallet
        );
        
        const wmonContract = new ethers.Contract(
            WMON,
            ["function approve(address spender, uint256 amount) public returns (bool)"],
            wallet
        );

        let loopCount = await askQuestion("Enter number of transactions per Looping: ");
        let intervalHours = await askQuestion("Enter interval in hours before repeating Looping: ");
        loopCount = parseInt(loopCount);
        intervalHours = parseInt(intervalHours);
        rl.close();

        while (true) {
            for (let i = 0; i < loopCount; i++) {
                console.clear();
                cfonts.say("NT Exhaust", {
                    font: "block",
                    align: "center",
                    colors: ["cyan", "magenta"],
                    background: "black",
                    letterSpacing: 1,
                    lineHeight: 1,
                    space: true,
                    maxLength: "0",
                  });
                
                  console.log("=== Telegram Channel : NT Exhaust (@NTExhaust) ===", "\x1b[36m");
                const spinner = ora({ text: `[NTExhaust-INFO] Executing Swap ${i + 1}/${loopCount}...`, color: 'cyan' }).start();

                const randomToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
                const randomAmount = (Math.random() * (0.08 - 0.01) + 0.01).toFixed(4);
                const amountIn = ethers.parseEther(randomAmount);
                const path = [WMON, randomToken];
                const deadline = Math.floor(Date.now() / 1000) + 300;

                try {
                    const amountsOut = await routerContract.getAmountsOut(amountIn, path);
                    const expectedAmountOut = amountsOut[1];
                    const amountOutMin = (expectedAmountOut * BigInt(99)) / BigInt(100);
                    
                    await (await wmonContract.approve(SWAP_CONTRACT, amountIn)).wait();
                    spinner.succeed("[NTExhaust-INFO] Successfully Approved WMON");

                    spinner.start(`[NTExhaust-INFO] Swapping ${randomAmount} WMON for token (${randomToken})`);
                    const tx = await routerContract.swapExactTokensForTokens(
                        amountIn,
                        amountOutMin,
                        path,
                        wallet.address,
                        deadline
                    );
                    spinner.succeed(`[NTExhaust-INFO] Transaction sent: ${tx.hash}`);
                    await tx.wait();
                    spinner.succeed(`[NTExhaust-INFO] Transaction confirmed for token: ${randomToken}`);
                } catch (error) {
                    spinner.fail(`[NTExhaust-ERROR] ${error.reason || error.message}`);
                }
            }
            
            console.log("=== Telegram Channel : NT Exhaust (@NTExhaust) ===", "\x1b[36m");
             console.log(`[NTExhaust-INFO] Waiting ${intervalHours} hours before next Looping...`);
            await new Promise(resolve => setTimeout(resolve, intervalHours * 60 * 60 * 1000));
        }
    } catch (error) {
        console.error("[NTExhaust-ERROR] Script Error:", error);
    }
})();

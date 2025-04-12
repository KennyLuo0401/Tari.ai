import { getSwap, ChainId } from "sushi";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { mainnet, sepolia, rootstock } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "./config";

const publicClient = createPublicClient({
  chain: rootstock,
  transport: http(config.rpcUrl),
});

const walletClient = createWalletClient({
  chain: rootstock,
  transport: http(config.rpcUrl),
});

const privateKey = config.privateKey as `0x${string}`;
const account = privateKeyToAccount(privateKey);

export const statusHistory: any[] = [];

export async function runDCA() {
  try {
    const amount = parseEther(config.amountEth);

    const swap = await getSwap({
      chainId: ChainId.ROOTSTOCK,
      tokenIn: "0xef213441A85dF4d7ACbDaE0Cf78004e1E486bB96",
      tokenOut: "0x542fDA317318eBF1d3DEAf76E0b632741A7e677d", // SUSHI
      sender: "0x9cAe94608Ea38235EECEda082163BdaeA6D0e9EB",
      amount,
      maxSlippage: config.slippage,
    });

    console.log("swap: ", swap);

    if (swap.status !== "Success") throw new Error("Swap API failed");

    const { tx } = swap;

    const sim = await publicClient.call({
      account: tx.from,
      to: tx.to,
      data: tx.data,
      value: tx.value,
    });

    const txHash = await walletClient.sendTransaction({
      account,
      to: tx.to,
      data: tx.data,
      value: tx.value,
    });

    const result = { time: new Date(), status: "Success", txHash };
    statusHistory.push(result);
    console.log(`[✅ DCA] Success - ${txHash}`);
    return result;
  } catch (err: any) {
    const error = { time: new Date(), status: "Error", error: err.message };
    statusHistory.push(error);
    console.error(`[❌ DCA] ${err.message}`);
    return error;
  }
}

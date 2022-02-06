require('dotenv').config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const web3 = createAlchemyWeb3(process.env.ALCHEMY_URL);

const main = async () => {
    const historicalBlocks = 20;
    const history = await web3.eth.getFeeHistory(historicalBlocks, "latest", [25, 50, 75]);
    const { reward, baseFeePerGas, gasUsedRatio } = history
    const oldestBlock = Number(history.oldestBlock)
    const gasEstimates = gasUsedRatio.map((ratio, i) => {
        const allGasInfo = {
            blockNumber: oldestBlock + i,
            gasUsedRatio: Number(ratio),
            baseFeePerGas: Number(baseFeePerGas[i]),
            priorityFeePerGas: reward[i].map(x => Number(x))
        }
        return {
            blockNumber: allGasInfo.blockNumber,
            fees: {
                low: allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[0],
                medium: allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[1],
                high: allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[2]
            }
        }
    })
    console.log(gasEstimates)
}

main()
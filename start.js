const web3 = require("web3");
const we3Default = new web3(process.env.RPC_ENDPOINT);
const ethers = require("ethers");

const toWei = (value, decimal) => {
  return ethers.utils.parseUnits(value, decimal || "ether");
};

const fromWei = (value, decimal) => {
  return ethers.utils.formatUnits(value, decimal || "ether");
};

const getError = async (txHash) => {
  const tx = await we3Default.eth.getTransaction(txHash);
  delete tx.maxPriorityFeePerGas;
  delete tx.maxFeePerGas;
  const gasPrice = tx.gasPrice.toString();
  const gas = tx.gas.toString();
  const txData = await we3Default.eth.getTransactionReceipt(txHash);
  const { gasUsed, cumulativeGasUsed, effectiveGasPrice, status } = txData;
  const rs = {
    gasPrice,
    gasUsed,
    status,
    gas,
    cumulativeGasUsed,
    effectiveGasPrice,
    from: txData.from,
    to: txData.to,
    blockNumber: tx.blockNumber,
    input: tx.input,
  };

  if (txData.status) {
    //success
    return rs;
  }
  //console.log(txData);
  try {
    const stripped_tx = {
      from: tx["from"],
      to: tx["to"],
      value: tx["value"],
      data: tx["input"],
    };
    await we3Default.eth.call(stripped_tx, tx.blockNumber);
  } catch (err) {
    rs[`error`] = err.message;
  }
  return rs;
};

async function start() {
  if (!process.env.CHAIN_ID) {
    console.log("missing CHAIN_ID");
    return;
  }

  if (!process.env.TX_HASH) {
    console.log("missing TX_HASH");
    return;
  }

  const error = await getError(process.env.TX_HASH);
  console.log(error);
}

start();

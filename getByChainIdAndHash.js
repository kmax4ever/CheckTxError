require("dotenv").config();
const axios = require("axios");
const callApi = async (url, method, data) => {
  try {
    const rs = await axios({
      method: method,
      url: url,
      timeout: 10000,
      data,
    });

    return rs;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getUrl = (chainId, txHash) => {
  return `https://api.tenderly.co/api/v1/public-contract/${chainId}/tx/${txHash}`;
};

const getError = async (chainId, txHash) => {
  try {
    const rs = await callApi(getUrl(chainId, txHash), "get");
    const {
      gas,
      gas_price,
      gas_used,
      effective_gas_price,
      addresses,
      error_info,
      status,
      function_selector,
    } = rs.data;
    console.log({
      gas,
      gas_price,
      gas_used,
      effective_gas_price,
      addresses,
      error_info,
      status,
      function_selector,
    });
  } catch (err) {
    console.log(err.message);
  }
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

  await getError(process.env.CHAIN_ID, process.env.TX_HASH);
}

start();

require('babel-register');
require('babel-polyfill');
require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKey = process.env.PRIVATE_KEY || "";
const infuraProjectId = process.env.INFURA_PROJECT_ID;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    goerli: {
      provider: () => new HDWalletProvider(privateKey.split(','), "https://goerli.infura.io/v3/" + infuraProjectId),
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 5
    }
    // truffle migrate —-network goerli
    //{truffle test --reset —-network goerli} for testing
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  mocha: {

  },
  compilers: {
    solc: {
      version: "0.8.7",
      optimizer: {
        enabled: true,
        runs: 200
      },
      // evmVersion: "petersburg"
    }
  }
}

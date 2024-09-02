require('dotenv').config(); 
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      evmVersion: 'london',
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
    },
  },
}

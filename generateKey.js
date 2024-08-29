// generateKey.js
const { ethers } = require("ethers");

// Cria uma nova carteira
const wallet = ethers.Wallet.createRandom();

// Exibe a chave privada e o endereço
console.log("Chave Privada:", wallet.privateKey);
console.log("Endereço:", wallet.address);

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.7",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000000,
                    },
                },
            },
        ],
    },
    networks: {
        goerli: {
            url: process.env.URL_GOERLI,
            accounts: [process.env.PRIVATE_KEY_GOERLI],
        },
        bsc_testnet: {
            url: process.env.URL_BSC_TESTNET,
            accounts: [process.env.PRIVATE_KEY_BSC_TESTNET],
        },
        mainnet: {
            url: process.env.URL_MAINNET,
            accounts: [process.env.PRIVATE_KEY_MAINNET],
        },
        bsc: {
            url: process.env.URL_BSC,
            accounts: [process.env.PRIVATE_KEY_BSC],
        },
    },
    etherscan: {
        apiKey: {
            goerli: process.env.BLOCK_EXPLORER_API_KEY_ETHEREUM,
            bsc_testnet: process.env.BLOCK_EXPLORER_API_KEY_BSC,
            mainnet: process.env.BLOCK_EXPLORER_API_KEY_ETHEREUM,
            bsc: process.env.BLOCK_EXPLORER_API_KEY_BSC,
        },
    },
};

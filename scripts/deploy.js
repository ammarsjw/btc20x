const hre = require("hardhat");


async function main() {
    // Chain dependent variables
    const networkName = hre.network.name;
    let desiredGasPrice;
    let usdtAddress;
    let aggregatorAddress;
    if (networkName == "goerli") {
        usdtAddress = "0x8F99C7556C4Fb70f4092534282B7B87c48fC9C2f";
        aggregatorAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e";
        desiredGasPrice = 1;
    } else if (networkName == "bsc_testnet") {
        usdtAddress = "0xDc0bB06740e6C1f5bFa0a9220bbCf2292727Bbdb";
        aggregatorAddress = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526";
        desiredGasPrice = 5;
    } else if (networkName == "mainnet") {
        usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
        aggregatorAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
        desiredGasPrice = 25;
    } else if (networkName == "bsc") {
        usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
        aggregatorAddress = "0xC5A35FC58EFDC4B88DDCA51AcACd2E8F593504bE";
        desiredGasPrice = 3;
    }


    // Checking gas price
    await checkGasPrice(desiredGasPrice);
    console.log("Chain:", networkName);


    // Contracts
    // Deploying BTC20X
    const btc20xFactory = await hre.ethers.getContractFactory("BTC20X");
    const btc20xContract = await hre.upgrades.deployProxy(
        btc20xFactory,
        [],
        {initializer: "initialize", kind: "transparent"}
    );
    await btc20xContract.waitForDeployment();
    const btc20xDeployTxHash = await btc20xContract.deploymentTransaction().hash;
    const btc20xDeployTx = await hre.ethers.provider.getTransactionReceipt(btc20xDeployTxHash);
    console.log("BTC20X deployed to:", btc20xContract.target);
    console.log("at block number:", btc20xDeployTx.blockNumber);


    // Address
    const btc20xAddress = btc20xContract.target;
    // const btc20xAddress = "";


    // Deploying Presale
    const presaleContract = await hre.ethers.deployContract("Presale", [btc20xAddress, usdtAddress, aggregatorAddress]);
    await presaleContract.waitForDeployment();
    const presaleDeployTxHash = await presaleContract.deploymentTransaction().hash;
    const presaleDeployTx = await hre.ethers.provider.getTransactionReceipt(presaleDeployTxHash);
    console.log("Presale deployed to:", presaleContract.target);
    console.log("at block number:", presaleDeployTx.blockNumber);


    // Address
    const presaleAddress = presaleContract.target;
    // const presaleAddress = "";


    // Verifying contracts
    await new Promise(resolve => setTimeout(resolve, 20000));
    await verify(btc20xAddress, []);
    await verify(presaleAddress, [btc20xAddress, usdtAddress, aggregatorAddress]);


    process.exit();
}


async function checkGasPrice(desiredGasPrice) {
    let feeData = await hre.ethers.provider.getFeeData();
    let gasPrice = hre.ethers.formatUnits(feeData.gasPrice, "gwei");
    console.log("Gas Price:", gasPrice, "Gwei");
    while (gasPrice > desiredGasPrice) {
        feeData = await hre.ethers.provider.getFeeData();
        if (gasPrice != hre.ethers.formatUnits(feeData.gasPrice, "gwei")) {
            gasPrice = hre.ethers.formatUnits(feeData.gasPrice, "gwei");
            console.log("Gas Price:", gasPrice, "Gwei");
        }
    }
}


async function verify(address, constructorArguments) {
    console.log(`verify ${address} with arguments ${constructorArguments.join(",")}`);
    try {
        await hre.run("verify:verify", {
            address,
            constructorArguments
        });
    } catch(error) { console.log(error) }
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});

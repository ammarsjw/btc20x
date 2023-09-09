const hre = require("hardhat")


async function main() {
    // Checking gas price
    let desiredGasPrice = 3
    await checkGasPrice(desiredGasPrice)


    // Contracts
    // Deploying BTC20X
    const btc20xFactory = await hre.ethers.getContractFactory("BTC20X");
    const btc20xContract = await hre.upgrades.deployProxy(
        btc20xFactory,
        [],
        {initializer: "initialize", kind: "transparent"}
    );
    await btc20xContract.waitForDeployment();
    const btc20xDeployTxHash = await btc20xContract.deploymentTransaction().hash
    const btc20xDeployTx = await hre.ethers.provider.getTransactionReceipt(btc20xDeployTxHash)
    console.log("BTC20X deployed to:", btc20xContract.target)
    console.log("at block number:", btc20xDeployTx.blockNumber)


    // Address
    const btc20xAddress = btc20xContract.target
    // const btc20xAddress = ""


    // Deploying Presale
    const presaleContract = await hre.ethers.deployContract("Presale", [btc20xAddress])
    await presaleContract.waitForDeployment()
    const presaleDeployTxHash = await presaleContract.deploymentTransaction().hash
    const presaleDeployTx = await hre.ethers.provider.getTransactionReceipt(presaleDeployTxHash)
    console.log("Presale deployed to:", presaleContract.target)
    console.log("at block number:", presaleDeployTx.blockNumber)


    // Address
    const presaleAddress = presaleContract.target
    // const presaleAddress = ""


    // Verifying contracts
    await new Promise(resolve => setTimeout(resolve, 20000))
    await verify(btc20xAddress, [])
    await verify(presaleAddress, [btc20xAddress])


    process.exit()
}


async function checkGasPrice(desiredGasPrice) {
    let feeData = await hre.ethers.provider.getFeeData()
    let gasPrice = hre.ethers.formatUnits(feeData.gasPrice, "gwei")
    console.log("Gas Price:", gasPrice, "Gwei")
    while (gasPrice > desiredGasPrice) {
        feeData = await hre.ethers.provider.getFeeData()
        if (gasPrice != hre.ethers.formatUnits(feeData.gasPrice, "gwei")) {
            gasPrice = hre.ethers.formatUnits(feeData.gasPrice, "gwei")
            console.log("Gas Price:", gasPrice, "Gwei")
        }
    }
}


async function verify(address, constructorArguments) {
    console.log(`verify ${address} with arguments ${constructorArguments.join(",")}`)
    try {
        await hre.run("verify:verify", {
            address,
            constructorArguments
        })
    } catch(error) { console.log(error) }
}


main().catch((error) => {
    console.error(error)
    process.exitCode = 1
    process.exit()
})

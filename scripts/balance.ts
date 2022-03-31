import { ethers } from "hardhat";

async function main() {
  
  const ETHPool = await ethers.getContractFactory("ETHPool");
  const contract = ETHPool.attach(
  "0x390c9a7d14B1D7b45244131260584bEc1E405dFF") // The deployed contract address
  console.log("Account balance: ", (await contract.ETHBalance()).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
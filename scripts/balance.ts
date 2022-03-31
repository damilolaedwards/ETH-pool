import { ethers } from "hardhat";

async function main() {
  
  const ETHPool = await ethers.getContractFactory("ETHPool");
  const contract = ETHPool.attach(
  "0x66a8c77c801a8da9A8b39D3480fEB63FFA73AD54") // The deployed contract address
  console.log("Account balance: ", (await contract.ETHBalance()).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
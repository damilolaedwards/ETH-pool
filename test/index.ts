import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers"
import { ETHPool } from "../typechain";

describe("ETHPool", function () {

  let Team: SignerWithAddress;
  let Contract: ETHPool;
  let Alice: SignerWithAddress;
  let Bob: SignerWithAddress;
 

  beforeEach(async function () { 
    const ETHPool = await ethers.getContractFactory("ETHPool");
    [Team, Alice, Bob] = await ethers.getSigners();
    Contract = await ETHPool.deploy();
    await Contract.deployed();
  });
  
  describe("team features", async function () {
    it("should return team as contract owner", async function () {
    
      expect(await Contract.Team()).to.equal(Team.address);

    });

    it("should allow team to deposit rewards", async function () {
      const tx = await Contract.connect(Team).depositReward({
        value: ethers.utils.parseEther("10.0"), // Sends exactly 10.0 ether
      });
      expect(await Contract.ETHBalance()).to.equal(0);
      expect(await Contract.poolShare()).to.equal(0);
      expect(await Contract.rewardPool()).to.equal(ethers.utils.parseEther("10.0"));
    })

    it("should be reverted because reward deposit not made by team", async function () {

      await expect(Contract.connect(Alice).depositReward({
        value: ethers.utils.parseEther("10.0")
      })).to.be.revertedWith("Only team can deposit rewards");
    })
  
    
  })

  describe("Case 1: Alice & Bob both make deposits before team deposit's reward", async function () {

    it("should share rewards according to percentage deposits", async function () {
      await Contract.connect(Alice).deposit({
        value: ethers.utils.parseEther("100.0"), // Alice deposits exactly 100.0 ether
      });
      expect(await Contract.balances(Alice.address)).to.equal(ethers.utils.parseEther("100.0")) 

      await Contract.connect(Bob).deposit({
        value: ethers.utils.parseEther("300.0"), // Bob deposits exactly 300.0 ether
      });
      expect(await Contract.balances(Bob.address)).to.equal(ethers.utils.parseEther("300.0")) 

      await Contract.connect(Team).depositReward({
        value: ethers.utils.parseEther("200.0"), // Team deposits 200.0 ether reward
      });

      expect(await Contract.ETHBalance()).to.equal((await Contract.balances(Alice.address))
      .add(await Contract.balances(Bob.address)));

      expect(await Contract.rewardPool()).to.equal(ethers.utils.parseEther("200.0"));

      const user1PrevBalance = await ethers.provider.getBalance(Alice.address);
      const user2PrevBalance = await ethers.provider.getBalance(Bob.address);

      const tx1 = await Contract.connect(Alice).withdraw(); 
      let gasfee1 = (await tx1.wait());

      const tx2 = await Contract.connect(Bob).withdraw();
      let gasfee2 = (await tx2.wait());
    

      expect((await ethers.provider.getBalance(Alice.address))
      .add(gasfee1.gasUsed.mul(gasfee1.effectiveGasPrice)))
      .to.equal(user1PrevBalance.add(ethers.utils.parseEther("150.0"))) //Alice recieves 150

      expect((await ethers.provider.getBalance(Bob.address))
      .add(gasfee2.gasUsed.mul(gasfee2.effectiveGasPrice)))
      .to.equal(user2PrevBalance.add(ethers.utils.parseEther("450.0"))) //Bob receives 450
    })

    expect(await Contract.balances(Alice.address)).to.equal(0);
    expect(await Contract.balances(Bob.address)).to.equal(0);
    expect(await Contract.ETHBalance()).to.equal(0);
  
  })

  describe("Case 2: Alice deposits, then reward deposited by team, Bob deposits afterwards", async function () {
    it("should give all rewards to alice", async function () {
      await Contract.connect(Alice).deposit({
        value: ethers.utils.parseEther("100.0"), // Alice deposits exactly 100.0 ether
      });

      await Contract.connect(Team).depositReward({
        value: ethers.utils.parseEther("200.0"), // Team deposits 200.0 ether reward
      });

      await Contract.connect(Bob).deposit({
        value: ethers.utils.parseEther("300.0"), // Bob deposits exactly 300.0 ether
      });

      const user1PrevBalance = await ethers.provider.getBalance(Alice.address);
      const user2PrevBalance = await ethers.provider.getBalance(Bob.address);

      const tx1 = await Contract.connect(Alice).withdraw(); 
      let gasfee1 = (await tx1.wait());

      const tx2 = await Contract.connect(Bob).withdraw();
      let gasfee2 = (await tx2.wait());

      expect((await ethers.provider.getBalance(Alice.address))
      .add(gasfee1.gasUsed.mul(gasfee1.effectiveGasPrice)))
      .to.equal(user1PrevBalance.add(ethers.utils.parseEther("300.0"))) // Alice recieves 300ETH => 100 ETH deposit
   //                                                                      + 200 ETH (all the rewards)

      expect((await ethers.provider.getBalance(Bob.address))
      .add(gasfee2.gasUsed.mul(gasfee2.effectiveGasPrice)))
      .to.equal(user2PrevBalance.add(ethers.utils.parseEther("300.0"))) //Bob receives 300 ETH (Only deposit)
    })
  })
  
  describe("fallback function", async function () {
    it("should handle sending ether directly to the contract as regular deposit", async function () {
      let tx = {
        to: Contract.address,
        value: ethers.utils.parseEther("100.0") // deposits exactly 100ETH directly through the recieve fallback function
    };
    
    await Alice.sendTransaction(tx);

    expect(await Contract.balances(Alice.address)).to.equal(ethers.utils.parseEther("100.0")) 
    })
  })
});

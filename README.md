# Smart Contract Challenge

ETHPool provides a service where people can deposit ETH and they will receive weekly rewards. Users must be able to take out their deposits along with their portion of rewards at any time. New rewards are deposited manually into the pool by the ETHPool team each week using a contract function.

#### Requirements

- Only the team can deposit rewards.
- Deposited rewards go to the pool of users, not to individual users.
- Users should be able to withdraw their deposits along with their share of rewards considering the time when they deposited.

Example:

> Let say we have user **A** and **B** and team **T**.
>
> **A** deposits 100, and **B** deposits 300 for a total of 400 in the pool. Now **A** has 25% of the pool and **B** has 75%. When **T** deposits 200 rewards, **A** should be able to withdraw 150 and **B** 450.
>
> What if the following happens? **A** deposits then **T** deposits then **B** deposits then **A** withdraws and finally **B** withdraws.
> **A** should get their deposit + all the rewards.
> **B** should only get their deposit because rewards were sent to the pool before they participated.

## Development

First clone this repository and enter the directory.

Install dependencies:

```
$ npm install
```

## Testing

This project uses [Hardhat](https://hardhat.dev) and [hardhat-deploy](https://github.com/wighawag/hardhat-deploy)

To run integration tests:

```sh
$ npx hardhat test
```

To run coverage:

```sh
$ npx hardhat coverage
```

## Test Coverage

  
  |File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
  |--------------|----------|----------|----------|----------|----------------|
  | contracts/   |      100 |       70 |      100 |      100 |                |
  |  ETHPool.sol |      100 |       70 |      100 |      100 |                |
  |              |          |          |          |          |                |
  |All files     |      100 |       70 |      100 |      100 |                |
  |--------------|----------|----------|----------|----------|----------------|

## Expected Gas Costs


  
  |  Contract  |  Method         |  Min        |  Max        |  Avg        |  # calls      |  usd (avg)  │
  |------------|-----------------|-------------|-------------|-------------|---------------|-------------|
  |  ETHPool   | deposit         |      55496  |      75396  |      69021  |            4  |          -  │
  |            |                 |             |             |             |               |             |
  |  ETHPool   | depositReward   |      50902  |      70802  |      64169  |            3  |          -  │
  |            |                 |             |             |             |               |             |
  |  ETHPool   |  withdraw       |      38209  |      42961  |      40585  |            8  |          -  │
  |            |                 |             |             |             |               |             |
  |Deployments |                 |             |             |             |   % of limit  |             │
  |            |                 |             |             |             |               |             |
  |  ETHPool   |                 |          -  |          -  |     410628  |        1.4 %  |          -  │
  |------------|-----------------|-------------|-------------|-------------|---------------|-------------|

# Deployment & Etherscan verification

Deployed Contract on Ropsten network
ETHPool deployed to: 0x390c9a7d14B1D7b45244131260584bEc1E405dFF

A verified version of the ETHPool contract on the Ropsten network is available at address
https://ropsten.etherscan.io/address/0x390c9a7d14B1D7b45244131260584bEc1E405dFF#code

# Interact with the contract

To query the total amount of ETH held in the contract, run this command

```shell
npx hardhat run --network ropsten scripts/balance.ts
```

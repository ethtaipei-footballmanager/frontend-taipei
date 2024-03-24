# Ten Taipei Football Manager

<p align="center">
<img src="logo.png" alt="logo" width="500"/>
</p>

⚽ Ten Taipei Football Manager is an on-chain football manager game that leverages the privacy that TEN Protocol provides to hide players' strategies from opponents.

\*\* This project is build using frontend components from a previous hackathon project [Super Leo Lig](https://github.com/arjanjohan/aleo-football). All smart contracts and contract interactions are created from scratch during this hackathon.

⚙️ Built using Solidity, Hardhat, wagmi, React and Javascript.

- 🧾 **Privacy on TEN**: Players commit to a strategy privately using TEN Protocol.
- ⛓️ **Smart contracts**: Verifies strategies and results of the game.
- ⏱️ **Timelock funds**: The wagered amount is secured by a timelock, to prevents ghosting by losing players.
- 🖼️ **Frontend**: Results are generated in the browser based on strategies.

## Contents

- [Contents](#contents)
- [Game flow](#game-flow)
- [Scripts](#scripts)
- [Links](#links)
- [Team](#team)

## Game flow

The game has 3 main steps:

### 1: proposeGame

To start a new game, a challenger calls this functions with 3 parameters:

- opponent (address): Address of the opponent
- wagerAmount (uint256): Amount to be wagered in gwei
- formation (uint256): Array of player_id's

This function creates a game object and stores it in a mapping by gameId. The formation is is stored privately in a seperate mapping.

### 2: acceptGame

To accept a game, an opponent calls this functions with 2 parameters:

- gameId (uint256): Unique id for the game
- formation (uint256): Array of player_id's
  This function publicly stored the opponent's formation in the games mapping.

### 3: revealOutcome

Challenger calls this function to settle a game. The function takes 1 input

- gameId (uint256): Unique id for the game

This function reveals challenger formation, determines the outcome and pays out the winner.

### 3b: revealOutcome

Opponent calls this function to settle a game if the challenger does not call revealOutcome within the timelimit. The function takes 1 input

- gameId (uint256): Unique id for the game

This function is only available after X blocks have passed since acceptGame was executed. It pays out the wagered amounts to the opponent, punishing the challenger for ghosting.

## Scripts

To test the smart contract interactions via a script, execute these scripts:
`/scripts/loadPlayers.js` - run once to load player profiles for 6 teams.
`/scripts/gameFlow.js` - run to test a game of two identical teams matched against eachother.

## Deployed contracts

- TEN deployed contract 0x40B10e8A06fBE442D82Eda1D547A278Ce372CA9A in tx 0xec761365ad14fca87c5dcbbe08a781b4bebe971bf88923e1ee5903fd4ad39fe0
- [Scroll](https://sepolia.scrollscan.com/address/0x1806a13729aDBC602e079F5d00FbA9345BE7381c#code)
- [Linea](https://goerli.lineascan.build/address/address/0x1e61235A37ee5642d71c6c3f060b6E94b05EE6E7#code)
- [Optimism](https://sepolia-optimism.etherscan.io/address/0xab2EE87906222B433AF6836b1f1588b79294f67e)
- [Polygon zkEVM cardona](https://cardona-zkevm.polygonscan.com/address/0xab2EE87906222B433AF6836b1f1588b79294f67e)
- [Thundercore](https://explorer-testnet.thundercore.com/address/0xc314278217Ae8D99D95BdAb3432e174A1a483Ed1)

## Links

- [Vercel deployment linked to Scroll Sepolia](https://ten-taipei-football.vercel.app/)
- [Vercel deployment linked to TEN Protocol](https://game-taipei-j7zyic2r0-arjanjohan.vercel.app)
- [Github front-end repo](https://github.com/ethtaipei-footballmanager/frontend-taipei)
- [Github smart contract repo](https://github.com/ethtaipei-footballmanager/smartcontracts-taipei/)
- [Taikai](https://taikai.network/ethtaipei/hackathons/hackathon-2024/projects/clu3lzpn30igbw201tsucpoez)
- [Presentation video part 1](https://www.loom.com/share/ec0c7a586a344849b9a0759d38d41513)
- [Presentation video part 2](https://www.loom.com/share/73f075def19a4a4fbb78f22c93562f6b)
- [Presentation slides](https://docs.google.com/presentation/d/1k6m42-y1edfHXn_txZ7uHJDuYUpOR82_3n5JufEhCzs/edit?usp=sharing)

## Team

This project was build at EthTaipei 2024 by:

- [arjanjohan](https://x.com/arjanjohan/)
- [Umut](http://x.com/nhestrompia)

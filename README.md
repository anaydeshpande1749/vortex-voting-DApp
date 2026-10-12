# Vortex | Decentralized Voting Ecosystem

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Ethers.js](https://img.shields.io/badge/Ethers.js-24305E?style=for-the-badge&logo=ethereum&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFDB1C?style=for-the-badge&logo=hardhat&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

Vortex is a premium, high-performance decentralized voting application. It leverages the security of the Ethereum blockchain and a glassmorphic UI to provide a transparent, immutable, and beautiful voting experience.

---

## ✨ Features

### 🛡️ Integrity & Security
- **Decentralized Integrity:** Vote counting is handled entirely by smart contracts.
- **Voter Privacy & Security:** One vote per wallet address per election round.
- **18+ Age Restriction:** Smart contract enforces that only voters aged 18 or older can cast a ballot.
- **Candidate Limit (Max 5):** Prevents spam and keeps the UI clean by limiting the number of candidates per election.

### 👑 Admin Command Center
- **Session Control:** Start and end voting sessions with customizable timers.
- **Live Standings:** Real-time vote counts and percentage bars for all candidates.
- **Voter Ledger (Audit Trail):** A dedicated section for admins to view the wallet address and declared age of every voter, ensuring full transparency.
- **Session Logs:** Tracks admin actions and voter activity in real-time.
- **Manual Override:** Ability to manually end a session once the timer expires.
- **Election Reset:** Instantly clear all candidates and votes for a fresh election round.

### 🎨 Premium UI/UX
- **Glassmorphism UI:** State-of-the-art design with animated backgrounds and blurred glass panels.
- **Winner Detection:** Automated real-time winner proclamation with high-end overlays.
- **Responsive Design:** Fully functional on desktop and mobile devices.
- **Real-time Feedback:** Toast notifications for successful/failed transactions.

## 🛠️ Tech Stack
- **Smart Contract:** Solidity `^0.8.20`
- **Development Environment:** Hardhat
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Web3 Library:** Ethers.js `v5`
- **Wallet Integration:** MetaMask

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.14.0 or higher)
- [MetaMask](https://metamask.io/) browser extension

### 2. Local Setup
```bash
# Clone the repository
git clone <your-repo-link>
cd vortex-voting-dapp

# Install dependencies
npm install

# Start Hardhat local node (keep this terminal open)
npx hardhat node
```

### 3. Deploy Contract
In a new terminal window, run:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Frontend Link
1. Copy the deployed contract address from the terminal.
2. Open `frontend/app.js` and update the `contractAddress` variable with your new address.
3. Open `frontend/index.html` in your browser using a local server (like Live Server in VS Code).

## 📂 Project Structure
```text
vortex-voting-dapp/
├── contracts/          # Solidity smart contracts
├── scripts/            # Hardhat deployment scripts
├── frontend/           # UI files (HTML, CSS, JS)
├── artifacts/          # Compiled contract ABIs and bytecode
├── DEPLOYMENT.md       # Guide to deploy to Sepolia Testnet
├── GITHUB_SETUP.md     # Guide to push code to GitHub
└── README.md           # Project documentation
```

## 📄 Documentation
- [Deployment Guide](./DEPLOYMENT.md) - How to move to a public testnet (Sepolia).
- [GitHub Setup](./GITHUB_SETUP.md) - How to upload this to your profile.
- [LinkedIn Showcase](./LINKEDIN_SHOWCASE.md) - How to present this project to recruiters.

## ⚠️ Security Warning
- **NEVER** upload your `.env` file or your Private Key to GitHub.
- **Always** use a "Burner Wallet" (a fresh MetaMask account with no real money) for development and testing.

## 🛡️ License
This project is for educational and portfolio purposes. Feel free to use and modify!

---
*Created with ❤️ by a Blockchain Enthusiast.*
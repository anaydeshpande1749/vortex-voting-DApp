# 🚀 Deployment Guide: Vortex Voting DApp

To take your DApp from a local machine to the real world where anyone can use it, follow these steps.

## 1. Prerequisites
* **MetaMask:** Ensure you have the browser extension installed.
* **Alchemy or Infura:** Create a free account and get an **API Key** for the Sepolia Testnet.
* **Testnet ETH:** Get some free "play money" for deployment from a Sepolia Faucet (e.g., [sepoliafaucet.com](https://sepoliafaucet.com)).
* **Static Hosting:** Sign up for [Vercel](https://vercel.com) or [Netlify](https://netlify.com).

---

## 2. Deploy Smart Contract to Public Testnet
You need to move your contract from your local computer to a public blockchain like **Sepolia**.

1. **Update `hardhat.config.js`:**
   Add the following network configuration:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.20",
     networks: {
       sepolia: {
         url: `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`,
         accounts: [process.env.PRIVATE_KEY] // Your MetaMask Private Key (NEVER share this!)
       }
     }
   };
   ```

2. **Run Deployment:**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   **Copy the new contract address** provided in the terminal.

---

## 3. Configure Frontend
Now tell your website to look at the real blockchain instead of your local machine.

1. **Open `frontend/app.js`**:
   Change the `contractAddress` to your new Sepolia address:
   ```javascript
   const contractAddress = "0xYourNewSepoliaAddressHere...";
   ```

2. **Network Check**:
   In `app.js`, update the chainId check from `31337` to `11155111` (Sepolia's ID).

---

## 4. Host the Frontend
Your website needs a URL so people can visit it.

### Option A: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to your project folder.
3. Run: `vercel`
4. Follow the prompts. When it asks for the project directory, make sure you point to the root (or `frontend` if you want ONLY the site).

### Option B: Netlify (Drag & Drop)
1. Build your project or just take the `frontend` folder.
2. Go to [app.netlify.com](https://app.netlify.com).
3. Drag the `frontend` folder into the "Deploy" area.
4. Done! You will get a link like `https://vortex-voting.netlify.app`.

---

## 5. Share with Voters
1. Send the URL to your friends.
2. Tell them to switch their MetaMask to the **Sepolia Test Network**.
3. They will need a tiny bit of Sepolia ETH (from a faucet) to cast their votes.

---

## ⚠️ Security Warning
* **NEVER** upload your `.env` file or your Private Key to GitHub.
* **Always** use a "Burner Wallet" (a fresh MetaMask account with no real money) for development and testing.

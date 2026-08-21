# 🐙 GitHub Setup Guide: Vortex Voting DApp

Follow these steps to upload your project to GitHub professionally.

## 1. Initialize Git
Open your terminal in the `voting-dapp` folder and run:
```bash
git init
```

## 2. Connect to GitHub
1. Go to [GitHub](https://github.com) and create a new repository called `vortex-voting-dapp`.
2. Keep it **Public** (unless you want it private).
3. **Do not** initialize with a README, license, or gitignore (we already have them).
4. Copy the remote URL (e.g., `https://github.com/YourUsername/vortex-voting-dapp.git`).

5. Run this in your terminal:
```bash
git remote add origin YOUR_REPOSITORY_URL
```

## 3. Commit and Push
```bash
# Add all files (the .gitignore will automatically skip node_modules and secrets)
git add .

# Create your first commit
git commit -m "Initial commit: Vortex Decentralized Voting Ecosystem with Premium UI"

# Push to the main branch
git branch -M main
git push -u origin main
```

## 4. Best Practices for GitHub
*   **Keep your README updated:** This is the first thing people see.
*   **Use the "About" section:** Add your website link (once hosted) and relevant tags like `#blockchain`, `#solidity`, and `#web3`.
*   **Documentation:** Your `DEPLOYMENT.md` and `LINKEDIN_SHOWCASE.md` are already included, which shows you write great documentation!

---

## ⚠️ Important Note
**Check your repository after pushing.** If you see a folder called `node_modules` on GitHub, you did it wrong (delete the repo and try again). `node_modules` should never be on GitHub because it's too large and can be re-installed using `npm install`.

let provider;
let signer;
let contract;
let currentAccount;
let isAdmin = false;
let countdownTimer;
let isModalManuallyClosed = false;

// THE MOST IMPORTANT PART: This address must match your 'deploy.js' output
// const contractAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
// const contractAddress = "0x5FbDB2315678afeCb367f032d93F642f64180aa3";

// const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Hardhat Local Network

// Standard JSON ABI - Updated for Timing, Stats & Reset
const abi = [
    {
        "inputs": [],
        "name": "admin",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_party", "type": "string" },
            { "internalType": "string", "name": "_imageUrl", "type": "string" },
            { "internalType": "string", "name": "_details", "type": "string" }
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "durationInMinutes", "type": "uint256" }],
        "name": "startVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "resetElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "candidateIndex", "type": "uint256" }],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCandidates",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "string", "name": "party", "type": "string" },
                    { "internalType": "string", "name": "imageUrl", "type": "string" },
                    { "internalType": "string", "name": "details", "type": "string" },
                    { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
                ],
                "internalType": "struct Voting.Candidate[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getVotingStatus",
        "outputs": [
            { "internalType": "bool", "name": "isActive", "type": "bool" },
            { "internalType": "address", "name": "admin", "type": "address" },
            { "internalType": "uint256", "name": "candidateCount", "type": "uint256" },
            { "internalType": "uint256", "name": "startTime", "type": "uint256" },
            { "internalType": "uint256", "name": "endTime", "type": "uint256" },
            { "internalType": "uint256", "name": "totalVotes", "type": "uint256" },
            { "internalType": "uint256", "name": "electionId", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "hasVoted",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];

async function init() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);

        window.ethereum.on('accountsChanged', () => location.reload());
        window.ethereum.on('chainChanged', () => location.reload());

        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            handleConnection(accounts[0]);
        }
    } else {
        showStatus("MetaMask not found. Please install it.", "error");
    }
}

async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask");
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleConnection(accounts[0]);
    } catch (err) {
        showStatus("Wallet connection rejected", "error");
    }
}

async function handleConnection(account) {
    currentAccount = account;
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    try {
        const network = await provider.getNetwork();
        if (parseInt(network.chainId) !== 31337 && parseInt(network.chainId) !== 1337) {
            showStatus(`Wrong Network! Switch to Hardhat Local (31337).`, "error");
            return;
        }

        const code = await provider.getCode(contractAddress);
        if (code === "0x") {
            showStatus("Contract Not Found! Make sure to redeploy.", "error");
            return;
        }

        const status = await contract.getVotingStatus();
        isAdmin = (currentAccount.toLowerCase() === status.admin.toLowerCase());

        updateUI();
        loadCandidates();
        checkVotingStatus();
        console.log("Connected Successfully");
    } catch (err) {
        console.error(err);
        showStatus("Connection error. Check console.", "error");
    }
}

function updateUI() {
    const connectBtn = document.getElementById("connectBtn");
    const accountDisplay = document.getElementById("accountDisplay");
    const navAdmin = document.getElementById("nav-admin");
    const statsRow = document.getElementById("stats-row");

    if (currentAccount) {
        if (connectBtn) connectBtn.style.display = "none";
        accountDisplay.classList.remove("hidden");
        const roleIcon = isAdmin ? '👑' : '👤';
        const roleName = isAdmin ? 'Admin' : 'Voter';
        accountDisplay.innerHTML = `
            <div style="background: var(--glass-light); border: 1px solid var(--glass-border); padding: 0.5rem 1rem; border-radius: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 600;">
                <span style="font-size: 1.2rem;">${roleIcon}</span>
                <span>${roleName}: <span style="color: var(--primary);">${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}</span></span>
            </div>
        `;
        if (isAdmin) navAdmin.classList.remove("hidden");
        statsRow.classList.remove("hidden");
    }
}

function switchTab(tab) {
    const userDash = document.getElementById("user-dashboard");
    const adminDash = document.getElementById("admin-dashboard");
    const navUser = document.getElementById("nav-user");
    const navAdmin = document.getElementById("nav-admin");

    if (tab === 'user') {
        userDash.classList.remove("hidden");
        adminDash.classList.add("hidden");
        navUser.classList.add("active");
        navAdmin.classList.remove("active");
    } else if (tab === 'admin' && isAdmin) {
        userDash.classList.add("hidden");
        adminDash.classList.remove("hidden");
        navUser.classList.remove("active");
        navAdmin.classList.add("active");
    }
}

async function loadCandidates() {
    if (!contract) return;
    try {
        const candidates = await contract.getCandidates();
        const status = await contract.getVotingStatus();
        const voted = await contract.hasVoted(status.electionId, currentAccount);

        document.getElementById("total-turnout").innerText = status.totalVotes.toString();
        document.getElementById("total-candidates").innerText = status.candidateCount.toString();

        const container = document.getElementById("results-container");
        const adminContainer = document.getElementById("admin-results-container");
        container.innerHTML = "";
        adminContainer.innerHTML = "";

        const totalVotesVal = parseInt(status.totalVotes);

        candidates.forEach((c, i) => {
            const count = parseInt(c.voteCount);
            const percent = totalVotesVal > 0 ? (count / totalVotesVal * 100).toFixed(1) : 0;
            const imgHtml = c.imageUrl ? `<img src="${c.imageUrl}" alt="${c.name}" class="candidate-img">` : `<div class="candidate-img-placeholder">${c.name.charAt(0)}</div>`;

            const card = `
                <div class="candidate-card">
                    ${imgHtml}
                    <div class="flex-between" style="margin-top: 1rem;">
                        <div>
                            <h4 style="margin-bottom: 2px;">${c.name}</h4>
                            <span class="party-badge">${c.party}</span>
                        </div>
                        <span class="percentage-label">${percent}%</span>
                    </div>
                    <p style="font-size:0.8rem; margin:10px 0; color: var(--text-muted); line-height: 1.4;">${c.details}</p>
                    <div class="progress-container">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <div class="vote-count" style="margin: 0.5rem 0 1rem 0;">${count} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-muted);">Votes</span></div>
                    ${status.isActive && !voted ? `<button class="btn-primary" style="width:100%" onclick="vote(${i})">Cast Vote</button>` : ''}
                    ${voted ? '<div class="success" style="text-align:center">✓ Voted</div>' : ''}
                    ${!status.isActive && !voted ? '<span class="status-badge status-ended">Inactive</span>' : ''}
                </div>
            `;
            container.innerHTML += card;

            adminContainer.innerHTML += `
                <div class="candidate-card" style="display: flex; gap: 1rem; align-items: center;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: var(--glass);">
                        ${c.imageUrl ? `<img src="${c.imageUrl}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background: var(--primary); color: white;">${c.name.charAt(0)}</div>`}
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 2px;">${c.name}</h4>
                        <div class="flex-between">
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${c.party}</span>
                            <span class="secondary" style="font-weight: 700;">${count} Votes</span>
                        </div>
                    </div>
                </div>`;
        });

        // Dynamic Locking Logic
        const now = Math.floor(Date.now() / 1000);
        const isCurrentlyTiming = status.isActive && now < parseInt(status.endTime);
        const isSessionEnded = status.isActive && now >= parseInt(status.endTime);

        const registerBtn = document.querySelector('[onclick="addCandidate()"]');
        const startBtn = document.getElementById("startVotingBtn");
        const endBtn = document.getElementById("endVotingBtn");
        const resetBtn = document.getElementById("resetElectionBtn");

        if (isAdmin) {
            if (isCurrentlyTiming) {
                if (registerBtn) { registerBtn.disabled = true; registerBtn.innerText = "Session Active (Locked)"; }
                if (startBtn) startBtn.disabled = true;
                if (endBtn) { endBtn.disabled = true; endBtn.title = "Wait for timer to end"; }
                if (resetBtn) resetBtn.disabled = true;
            } else {
                if (registerBtn) { registerBtn.disabled = false; registerBtn.innerText = "Finalize Registration"; }
                if (startBtn) startBtn.disabled = false;
                if (endBtn) { endBtn.disabled = false; endBtn.title = ""; }
                if (resetBtn) resetBtn.disabled = false;
            }
        }

        // Winner Detection
        if (!isModalManuallyClosed && (isSessionEnded || (!status.isActive && status.totalVotes > 0))) {
            showWinnerOverlay(candidates, totalVotesVal);
        } else {
            document.getElementById("winner-modal").classList.add("hidden");
        }

    } catch (err) {
        console.error("Load Task Failed:", err);
    }
}

function showWinnerOverlay(candidates, totalVotes) {
    if (candidates.length === 0) return;

    // Find the winner (highest voteCount)
    let winner = candidates[0];
    candidates.forEach(c => {
        if (parseInt(c.voteCount) > parseInt(winner.voteCount)) {
            winner = c;
        }
    });

    const percent = totalVotes > 0 ? (parseInt(winner.voteCount) / totalVotes * 100).toFixed(1) : 0;

    document.getElementById("winner-name").innerText = winner.name;
    document.getElementById("winner-party").innerText = winner.party;
    document.getElementById("winner-votes").innerText = winner.voteCount.toString();
    document.getElementById("winner-percent").innerText = `${percent}%`;

    const imgContainer = document.getElementById("winner-image-container");
    imgContainer.innerHTML = winner.imageUrl ?
        `<img src="${winner.imageUrl}" class="candidate-img">` :
        `<div class="candidate-img-placeholder" style="width: 180px; height: 180px; border-radius: 50%; border: 4px solid var(--primary); margin: 0 auto;">${winner.name.charAt(0)}</div>`;

    document.getElementById("winner-modal").classList.remove("hidden");
    isModalManuallyClosed = false; // Reset when showing
}

function closeWinnerModal() {
    document.getElementById("winner-modal").classList.add("hidden");
    isModalManuallyClosed = true;
}

async function resetElection() {
    if (!confirm("Are you sure? This will delete all candidates and reset all votes.")) return;
    try {
        const tx = await contract.resetElection();
        showStatus("Resetting election...", "success");
        await tx.wait();
        showStatus("Election Reset Successful!", "success");
        logActivity("Admin reset the entire election");
        isModalManuallyClosed = false; // Reset flag for new election
        loadCandidates();
        checkVotingStatus();
    } catch (err) { showStatus("Reset failed", "error"); }
}

function logActivity(msg) {
    const logContainer = document.getElementById("admin-logs");
    if (!logContainer) return;
    const time = new Date().toLocaleTimeString();
    const entry = `<div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 5px 0;">
        <span style="color: var(--secondary); font-weight:600;">[${time}]</span> ${msg}
    </div>`;
    if (logContainer.innerHTML.includes("Awaiting system activity")) logContainer.innerHTML = "";
    logContainer.innerHTML = entry + logContainer.innerHTML;
}

async function vote(index) {
    try {
        const tx = await contract.vote(index);
        showStatus("Casting vote...", "success");
        await tx.wait();
        showStatus("Vote successful!", "success");
        logActivity(`Voter cast a vote for Candidate #${index}`);
        loadCandidates();
    } catch (err) {
        console.error(err);
        showStatus("Vote failed! Session might have ended or you already voted.", "error");
    }
}

async function addCandidate() {
    const name = document.getElementById("candidateName").value;
    const party = document.getElementById("candidateParty").value;
    const imageUrl = document.getElementById("candidateImage").value;
    const details = document.getElementById("candidateDetails").value;

    if (!name || !details || !party) return showStatus("Please fill Name, Party and Details", "error");

    try {
        const tx = await contract.addCandidate(name, party, imageUrl, details);
        showStatus("Registering...", "success");
        await tx.wait();
        showStatus("Candidate Registered", "success");
        logActivity(`Admin registered candidate: ${name}`);
        loadCandidates();
        document.getElementById("candidateName").value = "";
        document.getElementById("candidateParty").value = "";
        document.getElementById("candidateImage").value = "";
        document.getElementById("candidateDetails").value = "";
    } catch (err) {
        console.error(err);
        showStatus("Registration failed", "error");
    }
}

async function startVoting() {
    const duration = document.getElementById("votingDuration").value;
    try {
        const tx = await contract.startVoting(duration);
        showStatus("Starting session...", "success");
        await tx.wait();
        showStatus("Voting Started!", "success");
        logActivity(`Admin started voting for ${duration} minutes`);
        checkVotingStatus();
        loadCandidates();
    } catch (err) { showStatus("Action failed", "error"); }
}

async function endVoting() {
    try {
        const tx = await contract.endVoting();
        showStatus("Ending session...", "success");
        await tx.wait();
        showStatus("Voting Ended!", "success");
        logActivity("Admin manually ended the voting session");
        checkVotingStatus();
        loadCandidates();
    } catch (err) { showStatus("Action failed", "error"); }
}

async function checkVotingStatus() {
    if (!contract) return;
    try {
        const status = await contract.getVotingStatus();
        const badge = document.getElementById("voting-status-badge");
        badge.innerText = status.isActive ? "Voting Active" : "Voting Inactive";
        badge.className = status.isActive ? "status-badge status-active" : "status-badge status-ended";

        if (status.isActive) {
            startCountdown(status.endTime);
        } else {
            clearInterval(countdownTimer);
            document.getElementById("timer-value").innerText = "Ended";
        }
    } catch (err) { }
}

function startCountdown(endTime) {
    clearInterval(countdownTimer);
    const end = parseInt(endTime) * 1000;

    countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = end - now;

        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById("timer-value").innerText = "00:00:00";
            checkVotingStatus();
            loadCandidates(); // Trigger winner detection
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("timer-value").innerText =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function showStatus(msg, type) {
    const statusIdx = document.getElementById("status-msg");
    if (statusIdx) {
        statusIdx.innerHTML = `<div class="${type}">${msg}</div>`;
        setTimeout(() => { if (statusIdx) statusIdx.innerHTML = ""; }, 8000);
    }
}

init();

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {

    struct Candidate {
        string name;
        string party;
        string imageUrl;
        string details;
        uint voteCount;
    }

    address public admin;
    bool public votingActive;
    uint public startTime;
    uint public endTime;
    uint public totalVotes;
    uint public electionId;

    // Limit candidates to prevent spam
    uint public constant MAX_CANDIDATES = 5;

    Candidate[] public candidates;

    // electionId => voter => has voted
    mapping(uint => mapping(address => bool)) public hasVoted;

    // electionId => voter => age entered at vote time
    mapping(uint => mapping(address => uint)) public voterAge;

    // electionId => list of voter addresses
    mapping(uint => address[]) private votersByElection;

    event VotingStarted(uint startTime, uint endTime);
    event VotingEnded();
    event CandidateAdded(string name);
    event VoteCast(address indexed voter, uint candidateIndex);

    constructor() {
        admin = msg.sender;
        votingActive = false;
        electionId = 1;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier duringVoting() {
        require(votingActive, "Voting is not active");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Outside voting hours");
        _;
    }

    function addCandidate(
        string memory _name,
        string memory _party,
        string memory _imageUrl,
        string memory _details
    ) public onlyAdmin {
        require(
            !votingActive || block.timestamp > endTime,
            "Cannot add candidates during an active session window"
        );
        require(candidates.length < MAX_CANDIDATES, "Maximum 5 candidates allowed");

        candidates.push(Candidate(_name, _party, _imageUrl, _details, 0));
        emit CandidateAdded(_name);
    }

    function startVoting(uint durationInMinutes) public onlyAdmin {
        require(
            !votingActive || block.timestamp > endTime,
            "A session is already active or hasn't expired"
        );
        require(candidates.length > 0, "Need at least one candidate");

        votingActive = true;
        startTime = block.timestamp;
        endTime = startTime + (durationInMinutes * 1 minutes);

        emit VotingStarted(startTime, endTime);
    }

    function endVoting() public onlyAdmin {
        require(votingActive, "Voting is not active");
        require(
            block.timestamp >= endTime,
            "Cannot end session early; wait for the timer to expire"
        );

        votingActive = false;
        emit VotingEnded();
    }

    function resetElection() public onlyAdmin {
        require(
            !votingActive || block.timestamp > endTime,
            "Cannot reset during active timing"
        );

        delete candidates;
        totalVotes = 0;
        votingActive = false;
        startTime = 0;
        endTime = 0;
        electionId++;
    }

    function vote(uint candidateIndex, uint age) public duringVoting {
        require(age >= 18, "You must be 18 or older to vote");
        require(!hasVoted[electionId][msg.sender], "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        candidates[candidateIndex].voteCount++;
        hasVoted[electionId][msg.sender] = true;
        voterAge[electionId][msg.sender] = age;
        votersByElection[electionId].push(msg.sender);
        totalVotes++;

        emit VoteCast(msg.sender, candidateIndex);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoters(uint _electionId) public view returns (address[] memory) {
        return votersByElection[_electionId];
    }

    function getVoterAge(uint _electionId, address _voter) public view returns (uint) {
        return voterAge[_electionId][_voter];
    }

    function getVotingStatus()
        public
        view
        returns (bool, address, uint, uint, uint, uint, uint)
    {
        return (
            votingActive,
            admin,
            candidates.length,
            startTime,
            endTime,
            totalVotes,
            electionId
        );
    }
}
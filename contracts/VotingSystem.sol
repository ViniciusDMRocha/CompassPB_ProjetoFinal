// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract VotingSystem {
    struct Voter {
        string cpf; // CPF do votante
        bool hasVoted; // Se o votante já votou
        uint candidateNumberVoted; // Número do candidato votado
    }

    struct Candidate {
        uint id; // ID do candidato
        string name; // Nome do candidato
        uint number; // Número do candidato para votação
        uint voteCount; // Contagem de votos
    }

    mapping(string => Voter) public voters; // Mapeia CPF para detalhes do votante
    mapping(uint => Candidate) public candidates; // Mapeia número do candidato para detalhes do candidato
    uint public candidateCount; // Contador de candidatos
    address public admin; // Endereço do administrador

    event Voted(string cpf, uint candidateNumber);
    event CandidateAdded(uint indexed candidateId, string name, uint number);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Somente o administrador pode realizar esta acao.");
        _;
    }

    function addCandidate(string memory _name, uint _number) public onlyAdmin {
        require(candidates[_number].number == 0, "Ja existe um candidato com este numero.");
        
        candidates[_number] = Candidate({
            id: candidateCount,
            name: _name,
            number: _number,
            voteCount: 0
        });
        candidateCount++;

        emit CandidateAdded(candidateCount - 1, _name, _number);
    }

    function vote(string memory _cpf, uint _candidateNumber) public {
        require(candidates[_candidateNumber].number != 0, "Candidato nao existe.");
        require(!voters[_cpf].hasVoted, "Votante ja votou.");

        // Armazenar o voto e atualizar a contagem de votos do candidato
        voters[_cpf] = Voter({
            cpf: _cpf,
            hasVoted: true,
            candidateNumberVoted: _candidateNumber
        });

        candidates[_candidateNumber].voteCount += 1;

        emit Voted(_cpf, _candidateNumber);
    }

    function getCandidate(uint _candidateNumber) public view returns (uint, string memory, uint, uint) {
        require(candidates[_candidateNumber].number != 0, "Candidato nao existe.");

        Candidate memory candidate = candidates[_candidateNumber];
        return (candidate.id, candidate.name, candidate.number, candidate.voteCount);
    }

    function verifyVote(string memory _cpf) public view returns (bool, uint) {
        require(voters[_cpf].hasVoted, "Votante nao votou.");

        Voter memory voter = voters[_cpf];
        return (voter.hasVoted, voter.candidateNumberVoted);
    }
}

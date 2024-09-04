// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystem {
    struct Voter {
        bool hasVoted; // Se o votante já votou
        uint candidateNumberVoted; // Número do candidato votado
    }

    struct Candidate {
        uint id; // ID do candidato
        string name; // Nome do candidato
        uint number; // Número do candidato para votação
        uint voteCount; // Contagem de votos
    }

    mapping(address => Voter) public voters; // Mapeia endereço da carteira para detalhes do votante
    mapping(uint => Candidate) public candidates; // Mapeia número do candidato para detalhes do candidato
    uint public candidateCount; // Contador de candidatos
    address public admin; // Endereço do administrador (conta de quem fez o deploy)

    event Voted(address voter, uint candidateNumber);
    event CandidateAdded(uint indexed candidateId, string name, uint number);

    // O administrador é definido na implantação do contrato
    constructor(address initialOwner) {
        require(initialOwner != address(0), "Endereco do administrador invalido.");
        admin = initialOwner;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Somente o administrador pode realizar esta acao.");
        _;
    }

    // Função para adicionar candidatos
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

    // Função para votar
    function vote(uint _candidateNumber) public {
        require(candidates[_candidateNumber].number != 0, "Candidato nao existe.");
        require(!voters[msg.sender].hasVoted, "Votante ja votou.");
        require(msg.sender != address(0), "O votante precisa estar logado.");

        // Armazenar o voto e atualizar a contagem de votos do candidato
        voters[msg.sender] = Voter({
            hasVoted: true,
            candidateNumberVoted: _candidateNumber
        });

        candidates[_candidateNumber].voteCount += 1;

        emit Voted(msg.sender, _candidateNumber);
    }

    // Função para obter detalhes do candidato
    function getCandidate(uint _candidateNumber) public view returns (uint, string memory, uint, uint) {
        require(candidates[_candidateNumber].number != 0, "Candidato nao existe.");

        Candidate memory candidate = candidates[_candidateNumber];
        return (candidate.id, candidate.name, candidate.number, candidate.voteCount);
    }

    // Função para verificar se um endereço já votou
    function verifyVote(address _voter) public view returns (bool, uint) {
        require(voters[_voter].hasVoted, "Votante nao votou.");

        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.candidateNumberVoted);
    }
}

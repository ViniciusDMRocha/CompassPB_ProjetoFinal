// URL base do seu servidor Express
const API_BASE_URL = 'https://fmxgn66khb.execute-api.us-east-1.amazonaws.com/dev/app';

// Função para carregar os candidatos da API e exibi-los dinamicamente na seção de votação e consulta
function loadCandidates() {
  fetch(`${API_BASE_URL}/candidates`)
      .then(response => response.json())
      .then(data => {
          // Atualiza os candidatos na seção de votação
          const voteForm = document.getElementById('vote-form');
          voteForm.innerHTML = ''; // Limpa os candidatos existentes

          data.forEach(candidate => {
              const label = document.createElement('label');
              label.innerHTML = `<input type="radio" name="candidate" value="${candidate.number}" /> ${candidate.name}`;
              voteForm.appendChild(label);
          });

          // Atualiza os candidatos na seção de consulta
          const consultList = document.querySelector('#consult-content ul');
          consultList.innerHTML = ''; // Limpa a lista existente

          data.forEach(candidate => {
              const listItem = document.createElement('li');
              listItem.textContent = `${candidate.name} - ${candidate.votes} votos`;
              consultList.appendChild(listItem);
          });
      })
      .catch(error => {
          console.error('Erro ao carregar candidatos:', error);
      });
}

// Lida com o cadastro de candidatos
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Previne o comportamento padrão do formulário

  const candidateName = document.getElementById('candidate-name').value;
  const candidateNumber = document.getElementById('candidate-number').value;

  fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          name: candidateName,
          number: candidateNumber,
      }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erro ao cadastrar candidato');
      }
      return response.json();
  })
  .then(data => {
      console.log('Candidato cadastrado com sucesso:', data);
      alert('Candidato cadastrado com sucesso!');
      loadCandidates();  // Atualiza a lista de candidatos
  })
  .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao cadastrar candidato');
  });
});

// Lida com a votação
document.getElementById('vote-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const selectedCandidate = document.querySelector('input[name="candidate"]:checked');

  if (!selectedCandidate) {
    alert("Por favor, selecione um candidato.");
    return;
  }

  const candidateNumber = selectedCandidate.value;

  console.log("Votando para o candidato número:", candidateNumber); // Adicionado para depuração

  fetch('/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { 
      number: candidateNumber 
    }
  })
  .then(response => {
    console.log("Resposta da API:", response); // Adicionado para depuração
    return response.json();
  })
  .then(data => {
    console.log("Voto registrado:", data); // Adicionado para depuração
    alert('Voto registrado com sucesso!');
    loadCandidates(); // Atualiza a lista de votos
  })
  .catch(error => {
    console.error('Erro ao registrar voto:', error);
    alert('Ocorreu um erro ao registrar o voto.');
  });
});


// Mostra o conteúdo correto com base na opção clicada
document.getElementById('vote-option').addEventListener('click', function () {
  showContent('vote-content');
});

document.getElementById('signup-option').addEventListener('click', function () {
  showContent('signup-content');
});

document.getElementById('consult-option').addEventListener('click', function () {
  showContent('consult-content');
});

// Função para mostrar o conteúdo correto e esconder os outros
function showContent(contentId) {
  const contents = document.querySelectorAll('.content');
  contents.forEach(content => {
      if (content.id === contentId) {
          content.style.display = 'block';
      } else {
          content.style.display = 'none';
      }
  });
}

// Carregar os candidatos ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  loadCandidates();
});

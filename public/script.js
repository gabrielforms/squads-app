document.addEventListener('DOMContentLoaded', function () {
  const squadForm = document.getElementById('squadForm');
  const squadsList = document.getElementById('squadsList');

  squadForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const squadName = document.getElementById('squadName').value;
    const membersInput = document.getElementById('members');
    const members = membersInput.value.split(',').map(member => member.trim());

    // Enviar membros como uma array no corpo da requisição
    fetch('/squads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: squadName, members: members }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Novo Squad Criado:', data);
        renderSquad(data);
      })
      .catch(error => {
        console.error('Erro ao criar squad:', error);
      });

    squadForm.reset();
  });

  fetch('/squads')
    .then(response => response.json())
    .then(data => {
      console.log('Squads Obtidos:', data);
      data.forEach(squad => {
        renderSquad(squad);
      });
    })
    .catch(error => {
      console.error('Erro ao obter squads:', error);
    });

  function renderSquad(squad) {
    const squadItem = document.createElement('li');
    squadItem.className = 'list-group-item';
    squadItem.innerHTML = `<strong>ID:</strong> ${squad.id}, <strong>Squad:</strong> ${squad.name}`;

    const membersList = document.createElement('ul');
    membersList.className = 'list-group';

    if (Array.isArray(squad.members) && squad.members.length > 0) {
      squad.members.forEach(member => {
        const memberItem = document.createElement('li');
        memberItem.className = 'list-group-item';
        memberItem.textContent = `Membros: ${member || 'Nenhum membro'}`;
        membersList.appendChild(memberItem);
      });
    } else {
      const memberItem = document.createElement('li');
      memberItem.className = 'list-group-item';
      memberItem.textContent = 'Nenhum membro';
      membersList.appendChild(memberItem);
    }

    squadItem.appendChild(membersList);
    squadsList.appendChild(squadItem);
  }
});

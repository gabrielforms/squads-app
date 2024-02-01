const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const dataFilePath = 'squads.txt';

app.post('/squads', async (req, res) => {
  const { name, members } = req.body;

  try {
    const squadId = await createSquad(name);

    if (members && members.length > 0) {
      await addMembersToSquad(squadId, members);
    }

    const squadWithMembers = {
      id: squadId,
      name: name,
      members: members || [],
    };

    return res.status(201).json(squadWithMembers);
  } catch (error) {
    console.error('Erro ao criar squad:', error);
    return res.status(500).json({ error: 'Erro ao criar squad.' });
  }
});

async function createSquad(name) {
  try {
    const squads = await readDataFile();
    const squadId = squads.length + 1;

    const newSquad = { id: squadId, name, members: [] };
    squads.push(newSquad);

    await writeDataFile(squads);

    return squadId;
  } catch (error) {
    throw error;
  }
}

async function addMembersToSquad(squadId, members) {
  try {
    const squads = await readDataFile();
    const squadIndex = squads.findIndex(squad => squad.id === squadId);

    if (squadIndex !== -1) {
      squads[squadIndex].members = members;
      await writeDataFile(squads);
    }
  } catch (error) {
    throw error;
  }
}

app.get('/squads', async (req, res) => {
  try {
    const squads = await readDataFile();
    return res.json(squads);
  } catch (error) {
    console.error('Erro ao listar squads:', error);
    return res.status(500).json({ error: 'Erro ao listar squads.' });
  }
});

async function readDataFile() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna uma lista vazia
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeDataFile(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});

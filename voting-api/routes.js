const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

// Configuração do DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Candidatos'; // Nome da tabela DynamoDB


let candidates = [
    { id: 1, name: "Candidato 1", votes: 0 },
    { id: 2, name: "Candidato 2", votes: 0 },
    { id: 3, name: "Candidato 3", votes: 0 }
  ];
// Rota para consultar candidatos e votos
router.get('/candidates', (req, res) => {
    res.status(200).json(candidates);
});
  
// Rota para cadastrar um novo candidato
// router.post('/candidates', (req, res) => {
//     const newCandidate = {
//     id: candidates.length + 1,
//     name: req.body.name,
//     votes: 0
//     };
//     candidates.push(newCandidate);
//     res.status(201).json(newCandidate);
// });
router.post('/candidates', async (req, res) => {
    try {
        // Consultar todos os candidatos na tabela para contar quantos já existem
        const scanParams = {
            TableName: TABLE_NAME,
            Select: 'COUNT'
        };
        const scanResult = await dynamoDB.scan(scanParams).promise();
        const candidatesCount = scanResult.Count;

        // Criar novo candidato com ID baseado no número de candidatos existentes
        const newCandidate = {
            id: (candidatesCount + 1).toString(), // ID baseado no número de candidatos + 1
            name: req.body.name,
            number: req.body.number,
            votes: 0
        };

        const putParams = {
            TableName: TABLE_NAME,
            Item: newCandidate
        };

        // Inserir o novo candidato na tabela DynamoDB
        await dynamoDB.put(putParams).promise();
        res.status(201).json(newCandidate);
    } catch (error) {
        console.error('Erro ao inserir candidato no DynamoDB:', error);
        res.status(500).json({ error: 'Não foi possível criar o candidato' });
    }
});    


// Rota para votar em um candidato
router.post('/vote', async (req, res) => {
    const candidateNumber = req.body.number;

    try {
        const getParams = {
            TableName: TABLE_NAME,
            Key: { number: candidateNumber }
        };
        const candidateResult = await dynamoDB.get(getParams).promise();

        if (candidateResult.Item) {
            const updateParams = {
                TableName: TABLE_NAME,
                Key: { id: candidateId },
                UpdateExpression: 'set votes = votes + :increment',
                ExpressionAttributeValues: {
                    ':increment': 1
                },
                ReturnValues: 'ALL_NEW'
            };

            const updatedCandidate = await dynamoDB.update(updateParams).promise();

            res.status(200).json({
                message: `Você votou em ${updatedCandidate.Attributes.name}`,
            });
        } else {
            res.status(404).json({ message: "Candidato não encontrado" });
        }
    } catch (error) {
        console.error('Erro ao processar o voto:', error);
        res.status(500).json({ message: "Erro interno ao processar o voto" });
    }
});

router.get('*',function (req, res) {
    return res.status(200).json({ message: 'Você não deveria estar aqui' })
})

module.exports = router

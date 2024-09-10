const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

// Configuração do S3
const s3 = new AWS.S3();
const BUCKET_NAME = 'candidatosbucket'; // Nome do bucket S3
const FILE_NAME = '/candidates.json'; // Nome do arquivo no bucket

// Função para obter a lista de candidatos do S3
const getCandidatesFromS3 = async () => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: FILE_NAME
        };
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString());
    } catch (error) {
        console.error('Erro ao obter candidatos do S3:', error);
        return [];
    }
};

// Função para salvar a lista de candidatos no S3
const saveCandidatesToS3 = async (candidates) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: FILE_NAME,
            Body: JSON.stringify(candidates),
            ContentType: 'application/json'
        };
        await s3.putObject(params).promise();
    } catch (error) {
        console.error('Erro ao salvar candidatos no S3:', error);
    }
};

// Rota para consultar candidatos e votos
router.get('/candidates', async (req, res) => {
    const candidates = await getCandidatesFromS3();
    res.status(200).json(candidates);
});

// Rota para cadastrar um novo candidato
router.post('/candidates', async (req, res) => {
    try {
        const candidates = await getCandidatesFromS3();
        const newCandidate = {
            id: candidates.length + 1, // ID baseado no número de candidatos
            name: req.body.name,
            number: req.body.number,
            votes: 0
        };
        candidates.push(newCandidate);
        await saveCandidatesToS3(candidates);
        res.status(201).json(newCandidate);
    } catch (error) {
        console.error('Erro ao inserir candidato:', error);
        res.status(500).json({ error: 'Não foi possível criar o candidato' });
    }
});

// Rota para votar em um candidato
router.post('/vote', async (req, res) => {
    const candidateNumber = req.body.number;

    try {
        const candidates = await getCandidatesFromS3();
        const candidate = candidates.find(c => c.number === candidateNumber);

        if (candidate) {
            candidate.votes += 1;
            await saveCandidatesToS3(candidates);
            res.status(200).json({
                message: `Você votou em ${candidate.name}`,
            });
        } else {
            res.status(404).json({ message: "Candidato não encontrado" });
        }
    } catch (error) {
        console.error('Erro ao processar o voto:', error);
        res.status(500).json({ message: "Erro interno ao processar o voto" });
    }
});

router.get('*', (req, res) => {
    res.status(200).json({ message: 'Você não deveria estar aqui' });
});

module.exports = router;
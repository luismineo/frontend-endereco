const express = require('express');
const enderecoController = require('./controller/EnderecoController');

const router = express.Router();

router.post('/enderecos', enderecoController.createEndereco);
router.get('/enderecos', enderecoController.getAllEnderecos);
router.get('/enderecos/:Id', enderecoController.getEnderecoById);
router.put('/enderecos/:Id', enderecoController.updateEndereco);
router.delete('/enderecos/:Id', enderecoController.deleteEndereco);
router.post('/enderecos/:cep', enderecoController.saveApiEndereco);

module.exports = router;
const {Endereco} = require('../models');
const axios = require('axios');
const { response } = require('express');

exports.createEndereco = async (req, res) => {
    try {
        const {Cep, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, MunicipioIBGE} = req.body;

        const novoEndereco = await Endereco.create({
            Cep,
            Logradouro,
            Numero,
            Complemento,
            Bairro,
            Cidade,
            Estado,
            MunicipioIBGE
        });

        res.status(201).json(novoEndereco);
    } catch (error) {
        res.status(500).json({error: 'Erro ao criar endereço', details: error.message});
    }
};

exports.getAllEnderecos = async (req, res) => {
    try {
        const enderecos = await Endereco.findAll();

        res.status(200).json(enderecos);
    } catch (error) {
        res.status(500).json({error: 'Erro ao buscar endereços', details: error.message});
    }
}

exports.getEnderecoById = async (req, res) => {
    try {
        const {Id} = req.params;

        const endereco = await Endereco.findByPk(Id);

        if (!endereco) {
            res.status(404).json({error: 'Endereço não encontrado'});
        }

        res.status(200).json(endereco);
    } catch (error) {
        res.status(500).json({error: 'Erro ao buscar endereço', details: error.message});
    }
};

exports.updateEndereco = async (req, res) => {
    try {
        const {Id} = req.params;
        const {Cep, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, MunicipioIBGE} = req.body;

        const endereco = await Endereco.findByPk(Id);

        if (!endereco) {
            res.status(404).json({error: 'Endereço não encontrado'});
        }

        endereco.Cep = Cep;
        endereco.Logradouro = Logradouro;
        endereco.Numero = Numero;
        endereco.Complemento = Complemento;
        endereco.Bairro = Bairro;
        endereco.Cidade = Cidade;
        endereco.Estado = Estado;
        endereco.MunicipioIBGE = MunicipioIBGE;

        await endereco.save();

        res.status(200).json(endereco);
    } catch (error) {
        res.status(500).json({error: 'Erro ao atualizar endereço', details: error.message});
    }
};

exports.deleteEndereco = async (req, res) => {
    try {
        const {id} = req.params;

        const endereco = await Endereco.findByPk(id);

        if (!endereco) {
            res.status(404).json({error: 'Endereço não encontrado'});
        }

        await endereco.destroy();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Erro ao deletar endereço', details: error.message});
    }
};

exports.saveApiEndereco = async (req, res) => {
    try {
        const cep = req.params.cep;

        const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;

        if (!cepRegex.test(cep)) {
            return res.status(400).send('CEP inválido');
        }

        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (response.data.erro) { // O viaCep retorna esse parametro erro caso não encontre o cep
            return res.status(404).send('CEP não encontrado');
        }

        const novoEndereco = await Endereco.create({
            Cep: response.data.cep,
            Logradouro: response.data.logradouro,
            Numero: 0, // numero padrão pois não vem no json
            Complemento: response.data.complemento,
            Bairro: response.data.bairro,
            Cidade: response.data.localidade,
            Estado: response.data.uf,
            MunicipioIBGE: response.data.ibge
        });

        res.status(201).json(novoEndereco);

    } catch {
        res.status(500).json({error: 'Erro ao criar endereço', details: error.message});
    }
};

// Camada responsavel pelo logica de negocio da aplicacao (apenas as funcoes basicas)

const Estoque = require('../models/estoqueModel'); // Importa o modelo de estoque
const validarItemEstoque = require('../middlewares/estoqueMiddleware'); // Importa a função de validação de estoque


const cadastrarProdutoEstoque = async (dadosProduto) => { // Função que vai cadastrar uma item do estoque no banco de dados
    const validacao = validarItemEstoque(dadosProduto);
    if (!validacao.valido) {
        throw new Error(validacao.mensagem); // Lança um erro para ser tratado no controller
    }
    return await Estoque.create(dadosProduto);
};


const listarProdutosEstoque = async () => { // Função que vai listar todas os itens cadastradas no estoque
    return await Estoque.findAll(); 
};


const editarProdutoEstoque = async (id, dadosProduto) => { // Função que vai editar um item cadastrado no estoque
    const validacao = validarItemEstoque(dadosProduto);
    if (!validacao.valido) {
        throw new Error(validacao.mensagem); 
    }
    
    const produto = await Estoque.findByPk(id); 

    if (!produto) return null; 

    await produto.update(dadosProduto); 
    return produto; 
};


const excluirProdutoEstoque = async (id) => { // Função que vai excluir um item do estoque
    const produto = await Estoque.findByPk(id); 

    if (!produto) return null; 

    await produto.destroy(); 
    return true; 
};

/***** Nova Funcionalidade *****/

const limites = {};

const alertarEstoqueBaixo = (produtos) => {
    const alertas = {};

    produtos.forEach(({ nomeDoProduto, limite, quantidadeProdutoEstoque }) => {
        if (quantidadeProdutoEstoque < limite) {
            alertas[nomeDoProduto] = true;

            console.log(`Alerta: Estoque baixo de ${nomeDoProduto}!`);
        } else {
            alertas[nomeDoProduto] = false;
        }
    });

    return alertas;
};

/*****************************/

module.exports = {
    cadastrarProdutoEstoque,
    listarProdutosEstoque,
    editarProdutoEstoque,
    excluirProdutoEstoque,
    alertarEstoqueBaixo,
    limites,
};

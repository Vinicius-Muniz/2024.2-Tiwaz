const estoqueService = require('../backend/src/modules/estoque/services/estoqueService');
describe('testes de alerta de estoque', () => {

    test('Deve definir um limite de alerta e verificar se o estoque está abaixo do limite', () => {
        const nomeDoProduto = 'Fertilizante';
        const limite = 10;
        const quantidadeProdutoEstoque = 5;
        const produto = [{nomeDoProduto, limite, quantidadeProdutoEstoque}]
        const resultado = estoqueService.alertarEstoqueBaixo(produto);
        
        expect(resultado['Fertilizante']).toBe(true);
    });

    test('Deve retornar false quando o estoque não estiver abaixo do limite', () => {
        const nomeDoProduto = 'Fertilizante';
        const limite = 10;
        const quantidadeProdutoEstoque = 15;
        const produto = [{nomeDoProduto, limite, quantidadeProdutoEstoque}]
        const resultado = estoqueService.alertarEstoqueBaixo(produto);
        
        expect(resultado['Fertilizante']).toBe(false);
    });

    test('Deve verificar o estoque de vários produtos ao mesmo tempo', () => {
        const produtos = [
            { nomeDoProduto: 'Fertilizante', limite: 10, quantidadeProdutoEstoque: 5 },
            { nomeDoProduto: 'Adubo', limite: 20, quantidadeProdutoEstoque: 25 },
            { nomeDoProduto: 'Semente', limite: 30, quantidadeProdutoEstoque: 20 },
        ];

        const resultado = estoqueService.alertarEstoqueBaixo(produtos);

        expect(resultado['Fertilizante']).toBe(true);
        expect(resultado['Adubo']).toBe(false);
        expect(resultado['Semente']).toBe(true);
    });

    test('Deve gerar uma notificação quando o estoque estiver abaixo do limite após atualização', () => {
        const produto = [{ nomeDoProduto: 'Fertilizante', limite: 10, quantidadeProdutoEstoque: 12 }];
        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

        estoqueService.alertarEstoqueBaixo(produto);
        expect(mockConsoleLog).not.toHaveBeenCalled();
        produto[0].quantidadeProdutoEstoque = 5;
        estoqueService.alertarEstoqueBaixo(produto);
        expect(mockConsoleLog).toHaveBeenCalledWith('Alerta: Estoque baixo de Fertilizante!');

        mockConsoleLog.mockRestore();
    });    
});
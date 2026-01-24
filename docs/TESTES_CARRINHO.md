# 🧪 Guia de Testes - Sistema de Carrinho

## ✅ Checklist de Testes

### 1. Teste de Adição de Produtos

- [ ] Abra `index.html` no navegador
- [ ] Clique em "🛒 Adicionar ao Carrinho" em um produto de maquiagem
- [ ] Verifique se o badge no ícone 🛒 mostra "1"
- [ ] Adicione mais um produto diferente
- [ ] Verifique se o badge mostra "2"
- [ ] Adicione o mesmo produto novamente
- [ ] Verifique se a quantidade aumenta no carrinho

**✓ Resultado esperado**: Badge atualiza corretamente, produtos são adicionados

---

### 2. Teste de Abertura do Carrinho

- [ ] Clique no ícone 🛒 no topo da página
- [ ] Verifique se o modal desliza da direita
- [ ] Verifique se mostra os produtos adicionados
- [ ] Verifique se o total está correto

**✓ Resultado esperado**: Modal abre suavemente, produtos exibidos corretamente

---

### 3. Teste de Quantidade

- [ ] Abra o carrinho
- [ ] Clique no botão **+** de um produto
- [ ] Verifique se a quantidade aumenta
- [ ] Verifique se o subtotal atualiza
- [ ] Verifique se o total geral atualiza
- [ ] Clique no botão **−**
- [ ] Verifique se a quantidade diminui
- [ ] Tente diminuir quando quantidade = 1
- [ ] Verifique se o botão **−** fica desabilitado

**✓ Resultado esperado**: Quantidades atualizam, botão desabilita em 1

---

### 4. Teste de Remoção

- [ ] Clique em "🗑️ Remover" em um produto
- [ ] Verifique se o produto é removido
- [ ] Verifique se o total atualiza
- [ ] Verifique se o badge atualiza
- [ ] Remova todos os produtos
- [ ] Verifique se aparece "Seu carrinho está vazio"

**✓ Resultado esperado**: Remoção funciona, mensagem de vazio aparece

---

### 5. Teste de Limpar Carrinho

- [ ] Adicione vários produtos
- [ ] Clique em "🗑️ Limpar Carrinho"
- [ ] Confirme a ação
- [ ] Verifique se todos os itens foram removidos
- [ ] Verifique se o badge mostra "0" ou desaparece

**✓ Resultado esperado**: Carrinho limpo completamente

---

### 6. Teste de Persistência

- [ ] Adicione alguns produtos ao carrinho
- [ ] Feche o modal do carrinho
- [ ] Recarregue a página (F5)
- [ ] Abra o carrinho novamente
- [ ] Verifique se os produtos continuam lá

**✓ Resultado esperado**: Produtos mantidos após recarregar

---

### 7. Teste de Navegação entre Páginas

- [ ] Adicione produtos na `index.html`
- [ ] Clique em "🔞 Sexy Shop" no menu
- [ ] Verifique se o badge mantém a contagem
- [ ] Adicione produtos do sexy shop
- [ ] Volte para a página principal
- [ ] Abra o carrinho
- [ ] Verifique se tem produtos de ambas as páginas

**✓ Resultado esperado**: Carrinho compartilhado entre páginas

---

### 8. Teste de WhatsApp

- [ ] Adicione pelo menos 3 produtos diferentes
- [ ] Varie as quantidades (1, 2, 3...)
- [ ] Clique em "💬 Finalizar Pedido no WhatsApp"
- [ ] Verifique se o WhatsApp abre
- [ ] Verifique se a mensagem está formatada corretamente
- [ ] Verifique se mostra:
  - Nome de cada produto
  - Quantidade
  - Preço unitário
  - Subtotal
  - Total geral

**✓ Resultado esperado**: WhatsApp abre com mensagem formatada

---

### 9. Teste de Animações

- [ ] Clique em "Adicionar ao Carrinho"
- [ ] Observe se o botão faz uma animação de pulsação
- [ ] Observe se o badge pulsa
- [ ] Abra o carrinho
- [ ] Observe se o modal desliza suavemente
- [ ] Passe o mouse sobre os botões
- [ ] Observe os efeitos hover

**✓ Resultado esperado**: Animações suaves e agradáveis

---

### 10. Teste Responsivo (Mobile)

- [ ] Abra o DevTools (F12)
- [ ] Ative o modo de dispositivo móvel
- [ ] Teste todas as funcionalidades acima
- [ ] Verifique se o modal ocupa a tela inteira
- [ ] Verifique se os botões são facilmente clicáveis
- [ ] Verifique se as imagens aparecem corretamente

**✓ Resultado esperado**: Funciona perfeitamente em mobile

---

### 11. Teste de Carrinho Vazio

- [ ] Limpe o carrinho completamente
- [ ] Clique no ícone do carrinho
- [ ] Verifique se mostra a mensagem:
  - "🛍️ Seu carrinho está vazio"
  - "Adicione produtos para continuar comprando!"
- [ ] Verifique se o botão do WhatsApp está visível
- [ ] Tente clicar no botão do WhatsApp
- [ ] Verifique se aparece alerta "Seu carrinho está vazio!"

**✓ Resultado esperado**: Mensagem correta, alerta ao tentar finalizar

---

### 12. Teste de Console

- [ ] Abra o Console (F12 > Console)
- [ ] Recarregue a página
- [ ] Verifique se aparece: "🛒 Sistema de carrinho inicializado!"
- [ ] Adicione um produto
- [ ] Verifique se não há erros no console
- [ ] Teste todas as funcionalidades
- [ ] Confirme que não há erros JavaScript

**✓ Resultado esperado**: Sem erros no console

---

## 🎯 Cenários de Teste Avançados

### Cenário A: Compra Mista

```
1. Adicione 2x Batom Matte Rosé (R$ 45,00)
2. Adicione 1x Pijama Cetim Rosa (R$ 120,00)
3. Adicione 3x Blush Compacto (R$ 38,00)

Total esperado: R$ 324,00
Items no badge: 6
```

### Cenário B: Edição de Carrinho

```
1. Adicione 5 produtos diferentes
2. Remova 2 produtos
3. Aumente a quantidade de 1 produto para 3
4. Diminua a quantidade de outro para 1
5. Finalize no WhatsApp

Verificar: Cálculos corretos na mensagem do WhatsApp
```

### Cenário C: Produtos de Todas as Categorias

```
1. Adicione 2 produtos de maquiagem
2. Adicione 2 produtos de pijama
3. Adicione 2 produtos de sexy shop
4. Abra o carrinho
5. Verifique se todos aparecem
6. Finalize no WhatsApp

Verificar: Mensagem contém produtos de todas as categorias
```

---

## 🐛 Problemas Conhecidos e Soluções

### Problema: Badge não atualiza

**Solução**: Recarregue a página (F5)

### Problema: LocalStorage cheio

**Solução**:

```javascript
// Abra o Console e execute:
localStorage.removeItem("andreza_store_cart");
```

### Problema: WhatsApp não abre

**Solução**:

1. Verifique o número em `script.js`
2. Use formato: `5567999999999`
3. Teste no navegador: `https://wa.me/5567999999999`

---

## 📊 Resultados Esperados

Após todos os testes, você deve ter:

- ✅ 21 produtos funcionando com o carrinho
- ✅ Badge contando corretamente
- ✅ Modal abrindo e fechando
- ✅ Cálculos precisos
- ✅ Persistência funcionando
- ✅ WhatsApp enviando mensagem formatada
- ✅ Animações suaves
- ✅ Responsivo em todos os dispositivos
- ✅ Sem erros no console

---

## 🎉 Teste Final

Execute este fluxo completo:

1. Abra `index.html`
2. Adicione 2x Batom Matte (R$ 45,00) = R$ 90,00
3. Adicione 1x Paleta Sombras (R$ 89,90) = R$ 89,90
4. Vá para Sexy Shop
5. Adicione 1x Conjunto Renda (R$ 149,90) = R$ 149,90
6. Volte para página principal
7. Adicione 1x Pijama Cetim (R$ 120,00) = R$ 120,00
8. Abra o carrinho
9. Aumente Batom para 3x
10. Remova a Paleta de Sombras
11. Finalize no WhatsApp

**Total esperado**: R$ 405,90 (3x Batom + 1x Conjunto + 1x Pijama)

Se tudo funcionar, o sistema está 100% operacional! 🎉

---

**Desenvolvido com ❤️ para OutLet MakeUp**

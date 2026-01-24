# 🛒 Sistema de Carrinho de Compras

## 📋 Visão Geral

Sistema completo de carrinho de compras implementado para a loja OutLet MakeUp, com suporte para produtos de **maquiagem**, **pijamas** e **sexy shop**.

---

## ✨ Funcionalidades Implementadas

### 🎯 Funcionalidades Principais

- ✅ **Adicionar produtos ao carrinho** com um clique
- ✅ **Badge com contador** de itens no ícone do carrinho
- ✅ **Modal lateral (off-canvas)** deslizante e moderno
- ✅ **Aumentar/diminuir quantidade** de produtos
- ✅ **Remover itens** individualmente
- ✅ **Limpar carrinho** completo
- ✅ **Cálculo automático** do total
- ✅ **Persistência com localStorage** - mantém itens após recarregar
- ✅ **Animações suaves** ao adicionar produtos
- ✅ **Integração com WhatsApp** - envio automático do pedido

### 🎨 Design

- Visual feminino e moderno com gradientes rosa/roxo
- Animações suaves e responsivas
- Badge pulsante no ícone do carrinho
- Modal deslizante da direita para esquerda
- Botões com hover effects
- Layout clean e intuitivo

---

## 🚀 Como Usar

### Para os Clientes

1. **Navegar pelos produtos** nas páginas:
   - `index.html` - Maquiagens e Pijamas
   - `sexyshop.html` - Produtos Sensuais

2. **Adicionar ao carrinho**:
   - Clique no botão "🛒 Adicionar ao Carrinho"
   - Veja o badge atualizar com o número de itens

3. **Abrir o carrinho**:
   - Clique no ícone 🛒 no topo da página
   - Modal desliza da direita

4. **Gerenciar produtos**:
   - Use os botões **+** e **-** para ajustar quantidades
   - Clique em **🗑️ Remover** para excluir um item
   - Clique em **Limpar Carrinho** para remover tudo

5. **Finalizar pedido**:
   - Clique em **💬 Finalizar Pedido no WhatsApp**
   - Uma mensagem formatada será criada automaticamente
   - WhatsApp abrirá com o pedido pronto para enviar

### Mensagem do WhatsApp

A mensagem gerada automaticamente contém:

```
🛍️ Olá! Gostaria de fazer um pedido:

1. *Nome do Produto*
   • Quantidade: 2
   • Preço unitário: R$ 45,00
   • Subtotal: R$ 90,00

2. *Outro Produto*
   • Quantidade: 1
   • Preço unitário: R$ 89,90
   • Subtotal: R$ 89,90

💰 TOTAL: R$ 179,90

Aguardo confirmação! 😊
```

---

## 🔧 Configuração Técnica

### Arquivos Modificados/Criados

1. **index.html**
   - Adicionado ícone do carrinho no header
   - Adicionado modal do carrinho
   - Atualizados botões de produtos

2. **sexyshop.html**
   - Adicionado ícone do carrinho no header
   - Adicionado modal do carrinho
   - Atualizados botões de produtos

3. **style.css**
   - Estilos completos do carrinho (+350 linhas)
   - Animações e responsividade
   - Estilos para badge, modal, itens

4. **script.js**
   - `CartService` - Gerenciamento de dados
   - `CartUIController` - Controle de interface
   - Integração com WhatsApp

### Estrutura de Dados

O carrinho é armazenado no localStorage com a seguinte estrutura:

```javascript
[
  {
    name: "Batom Matte Rosé",
    price: 45.0,
    image: "https://...",
    quantity: 2,
  },
  {
    name: "Pijama Cetim Rosa",
    price: 120.0,
    image: "https://...",
    quantity: 1,
  },
];
```

### Configuração do WhatsApp

Edite o número no arquivo `script.js`:

```javascript
const CONFIG = {
  WHATSAPP_NUMBER: "5511987654321", // ⚠️ Alterar para o WhatsApp da loja
  STORAGE_KEY: "outlet_makeup_products",
};
```

**Formato:** `55` (país) + `11` (DDD) + `987654321` (número)

---

## 📱 Responsividade

O carrinho é totalmente responsivo:

- **Desktop**: Modal lateral de 450px
- **Tablet**: Modal lateral de 450px
- **Mobile**: Modal ocupa tela inteira

Ajustes automáticos:

- Tamanho dos botões
- Espaçamento dos itens
- Tamanho das imagens
- Fonte dos textos

---

## 🎯 Regras de Negócio

1. **Quantidade mínima**: 1 (não permite quantidade menor)
2. **Botão diminuir**: Desabilitado quando quantidade = 1
3. **Carrinho vazio**: Mostra mensagem personalizada
4. **Persistência**: Itens mantidos mesmo ao fechar o navegador
5. **Atualização em tempo real**: Total e badge atualizados instantaneamente

---

## 🎨 Personalização de Cores

As cores seguem as variáveis CSS definidas:

```css
--primary-color: #e91e63; /* Rosa principal */
--secondary-color: #f8bbd0; /* Rosa claro */
--accent-color: #9c27b0; /* Roxo */
--light-pink: #fce4ec; /* Rosa muito claro */
```

Para alterar o tema, edite essas variáveis no `style.css`.

---

## 🔐 Segurança

- Dados armazenados apenas localmente (localStorage)
- Não há envio de dados para servidores externos
- WhatsApp abre em nova aba segura
- Validação de quantidades no frontend

---

## 🐛 Resolução de Problemas

### Carrinho não abre

- Verifique se o JavaScript está carregado
- Abra o console (F12) e veja se há erros

### Itens não persistem

- Verifique se o localStorage está habilitado no navegador
- Limpe o cache e teste novamente

### Badge não atualiza

- Recarregue a página
- Verifique se os botões têm os atributos `data-name`, `data-price` e `data-image`

### WhatsApp não abre

- Verifique se o número está no formato correto em `script.js`
- Teste se o WhatsApp está instalado ou use WhatsApp Web

---

## 📊 Estatísticas de Implementação

- **Linhas de CSS adicionadas**: ~350
- **Linhas de JavaScript adicionadas**: ~250
- **Produtos com carrinho**: 21 produtos
- **Páginas integradas**: 2 (index.html + sexyshop.html)

---

## 🎓 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos, animações, gradientes
- **JavaScript ES6+** - Lógica moderna
- **localStorage API** - Persistência de dados
- **WhatsApp Business API** - Integração de pedidos

---

## 🚀 Próximas Melhorias (Opcionais)

- [ ] Cupons de desconto
- [ ] Favoritos/Wishlist
- [ ] Histórico de pedidos
- [ ] Compartilhar carrinho via link
- [ ] Cálculo de frete
- [ ] Multiple payment methods
- [ ] Reviews de produtos no carrinho

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

- 📧 Email: contato@andrezastore.com
- 📱 WhatsApp: (67) 0000-0000

---

## 📄 Licença

© 2026 OutLet MakeUp. Todos os direitos reservados.

---

**✨ Sistema desenvolvido com atenção aos detalhes e foco na experiência do usuário!**

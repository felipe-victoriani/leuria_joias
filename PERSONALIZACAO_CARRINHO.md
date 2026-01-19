# ⚙️ Guia de Personalização do Carrinho

## 🎨 Personalizando Cores

### Alterar Cor Principal do Carrinho

Edite em `style.css`:

```css
:root {
  --primary-color: #e91e63; /* Mude aqui - Ex: #ff4081, #e040fb */
  --secondary-color: #f8bbd0; /* Mude aqui - Tom mais claro */
  --accent-color: #9c27b0; /* Mude aqui - Cor de destaque */
}
```

### Exemplos de Paletas

#### Roxo Elegante

```css
--primary-color: #9c27b0;
--secondary-color: #e1bee7;
--accent-color: #7b1fa2;
```

#### Rosa Suave

```css
--primary-color: #f06292;
--secondary-color: #fce4ec;
--accent-color: #ec407a;
```

#### Azul Moderno

```css
--primary-color: #2196f3;
--secondary-color: #bbdefb;
--accent-color: #1976d2;
```

---

## 📝 Personalizando Textos

### Alterar Título do Modal

Em `index.html` e `sexyshop.html`:

```html
<h2>🛒 Meu Carrinho</h2>
<!-- Mude para: -->
<h2>🛍️ Minha Sacola</h2>
<!-- ou -->
<h2>🎀 Meus Produtos</h2>
```

### Alterar Mensagem de Carrinho Vazio

```html
<p>🛍️ Seu carrinho está vazio</p>
<!-- Mude para: -->
<p>💝 Sua sacola está vazia</p>

<span>Adicione produtos para continuar comprando!</span>
<!-- Mude para: -->
<span>Escolha produtos lindos para você! 💄</span>
```

### Alterar Texto dos Botões

```html
<!-- Botão Adicionar -->
🛒 Adicionar ao Carrinho
<!-- Opções: -->
➕ Adicionar à Sacola 🛍️ Quero Este! 💝 Adicionar

<!-- Botão WhatsApp -->
💬 Finalizar Pedido no WhatsApp
<!-- Opções: -->
📲 Enviar Pedido ✅ Confirmar Pedido 💚 Pedir pelo WhatsApp
```

---

## 📐 Personalizando Tamanhos

### Largura do Modal

Em `style.css`:

```css
.cart-sidebar {
  max-width: 450px; /* Padrão */
}

/* Para carrinho mais largo: */
.cart-sidebar {
  max-width: 550px; /* Mais espaço */
}

/* Para carrinho mais estreito: */
.cart-sidebar {
  max-width: 380px; /* Compacto */
}
```

### Tamanho das Imagens dos Produtos

```css
.cart-item-image {
  width: 80px;
  height: 80px;
}

/* Para imagens maiores: */
.cart-item-image {
  width: 100px;
  height: 100px;
}
```

### Tamanho do Badge

```css
.cart-badge {
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
}

/* Badge maior: */
.cart-badge {
  width: 28px;
  height: 28px;
  font-size: 0.85rem;
}
```

---

## 🎯 Personalizando Comportamento

### Fechar Modal ao Clicar Fora

Já está implementado! Para desabilitar, comente em `script.js`:

```javascript
// Comentar esta linha:
// this.overlay.addEventListener("click", () => this.closeCart());
```

### Tempo das Animações

Em `style.css`:

```css
:root {
  --transition-fast: 0.3s ease; /* Padrão */
}

/* Animações mais rápidas: */
:root {
  --transition-fast: 0.2s ease;
}

/* Animações mais lentas (suaves): */
:root {
  --transition-fast: 0.5s ease;
}
```

### Desabilitar Persistência (localStorage)

Se quiser que o carrinho limpe ao fechar o navegador, comente em `script.js`:

```javascript
saveCart(cart) {
  // localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  // Comentar linha acima para desabilitar persistência
}
```

---

## 📱 Personalizando Mensagem do WhatsApp

### Formato Atual

```javascript
let message = "🛍️ *Olá! Gostaria de fazer um pedido:*\n\n";
```

### Opções de Mensagem

#### Mais Formal

```javascript
let message = "Bom dia! Gostaria de solicitar os seguintes produtos:\n\n";
```

#### Mais Casual

```javascript
let message = "Oi! 😊 Quero fazer um pedido:\n\n";
```

#### Personalizada com Nome da Loja

```javascript
let message = "Olá OutLet MakeUp! 💄\nEstou interessada em:\n\n";
```

### Adicionar Informações Extras

Edite em `script.js`, método `checkoutWhatsApp()`:

```javascript
// Após o total, adicione:
message += "\n📍 *Forma de Entrega:* A combinar\n";
message += "💳 *Forma de Pagamento:* A combinar\n";
message += "\nObservações: ___________\n";
```

### Adicionar Nome do Cliente

```javascript
// No início do método:
const clientName = prompt("Digite seu nome:");
if (!clientName) return;

let message = `Olá! Meu nome é *${clientName}* e gostaria de fazer um pedido:\n\n`;
```

---

## 🔔 Adicionando Notificações

### Toast ao Adicionar Produto

Adicione no `style.css`:

```css
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

Adicione no `script.js`:

```javascript
showAddedFeedback() {
  // Criar toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = '✅ Produto adicionado ao carrinho!';
  document.body.appendChild(toast);

  // Remover após 2 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);

  // Animar badge (código existente)
  this.cartBadge.style.animation = "none";
  setTimeout(() => {
    this.cartBadge.style.animation = "pulse 2s infinite";
  }, 10);
}
```

---

## 💰 Adicionando Desconto

### Cupom de Desconto Simples

Em `script.js`, adicione:

```javascript
const CUPONS = {
  'PRIMEIRACOMPRA': 10,  // 10% de desconto
  'NATAL2026': 15,       // 15% de desconto
  'FRETEGRATIS': 0       // Apenas para tracking
};

calculateDiscount(couponCode) {
  const discount = CUPONS[couponCode.toUpperCase()] || 0;
  return discount;
}

getTotal() {
  const cart = this.getCart();
  const subtotal = cart.reduce((total, item) =>
    total + item.price * item.quantity, 0);

  // Aplicar desconto se tiver
  const discount = this.currentDiscount || 0;
  return subtotal * (1 - discount / 100);
}
```

No HTML, adicione campo de cupom:

```html
<div class="cart-footer">
  <div class="coupon-input">
    <input type="text" id="coupon-code" placeholder="Cupom de desconto" />
    <button onclick="applyCoupon()">Aplicar</button>
  </div>

  <div class="cart-total">
    <span>Total:</span>
    <span class="cart-total-value" id="cart-total">R$ 0,00</span>
  </div>
  <!-- ... resto do código -->
</div>
```

---

## 🎁 Adicionar Frete

### Cálculo de Frete Simples

```javascript
calculateShipping(total) {
  if (total >= 200) return 0;        // Frete grátis acima de R$ 200
  else if (total >= 100) return 15;  // R$ 15 entre R$ 100-199
  else return 25;                     // R$ 25 abaixo de R$ 100
}

getFinalTotal() {
  const subtotal = this.getTotal();
  const shipping = this.calculateShipping(subtotal);
  return subtotal + shipping;
}
```

Atualizar o HTML:

```html
<div class="cart-total">
  <div class="subtotal">
    <span>Subtotal:</span>
    <span id="cart-subtotal">R$ 0,00</span>
  </div>
  <div class="shipping">
    <span>Frete:</span>
    <span id="cart-shipping">R$ 0,00</span>
  </div>
  <div class="total">
    <span>Total:</span>
    <span class="cart-total-value" id="cart-total">R$ 0,00</span>
  </div>
</div>
```

---

## 🛡️ Validações Personalizadas

### Limite de Quantidade por Produto

```javascript
addItem(product) {
  const MAX_QTY = 10;  // Máximo 10 unidades por produto

  const cart = this.getCart();
  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    if (existingItem.quantity >= MAX_QTY) {
      alert(`Você pode adicionar no máximo ${MAX_QTY} unidades deste produto.`);
      return cart;
    }
    existingItem.quantity += 1;
  } else {
    // ... resto do código
  }
}
```

### Limite Total de Itens no Carrinho

```javascript
addItem(product) {
  const MAX_ITEMS = 20;  // Máximo 20 itens no total

  const itemCount = this.getItemCount();

  if (itemCount >= MAX_ITEMS) {
    alert(`Você atingiu o limite de ${MAX_ITEMS} itens no carrinho.`);
    return this.getCart();
  }

  // ... resto do código
}
```

---

## 🎨 Temas Alternativos

### Tema Escuro

```css
/* Adicionar em style.css */
.cart-modal.dark-theme .cart-sidebar {
  background: #1e1e1e;
  color: #ffffff;
}

.cart-modal.dark-theme .cart-item {
  background: #2d2d2d;
}

.cart-modal.dark-theme .cart-header {
  background: linear-gradient(135deg, #6a1b9a, #4a148c);
}
```

Ativar tema escuro:

```javascript
// Adicionar em script.js
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
  document.getElementById("cart-modal").classList.toggle("dark-theme");
});
```

---

## 📊 Analytics e Tracking

### Rastrear Adições ao Carrinho

```javascript
addItem(product) {
  // ... código existente ...

  // Enviar para Google Analytics
  if (window.gtag) {
    gtag('event', 'add_to_cart', {
      'items': [{
        'id': product.name,
        'name': product.name,
        'price': product.price,
        'quantity': 1
      }]
    });
  }

  return cart;
}
```

---

## 🔧 Funcionalidades Avançadas

### Salvar para Depois (Wishlist)

```javascript
const WishlistService = {
  STORAGE_KEY: "andreza_wishlist",

  addToWishlist(product) {
    const wishlist = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    wishlist.push(product);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
  },

  moveToCart(productName) {
    // Implementar lógica
  },
};
```

### Comparar Produtos

```javascript
const CompareService = {
  compareProducts: [],

  addToCompare(product) {
    if (this.compareProducts.length >= 3) {
      alert("Você pode comparar no máximo 3 produtos");
      return;
    }
    this.compareProducts.push(product);
  },
};
```

---

## 📞 Suporte

Precisa de ajuda com personalizações?

- 📧 Email: contato@andrezastore.com
- 💬 WhatsApp: (67) 0000-0000

---

**Personalize e torne o carrinho único! 🎨✨**

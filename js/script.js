/* ========================================
   LEURIA - SCRIPT PRINCIPAL
   Gerenciamento de Produtos e Carrinho
   ======================================== */

// Elementos DOM
const productGrid = document.getElementById("product-grid");
const cart = document.getElementById("cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const cartEmpty = document.getElementById("cart-empty");
const btnCart = document.getElementById("btn-cart");
const btnCloseCart = document.getElementById("btn-close-cart");
const btnCheckout = document.getElementById("btn-checkout");

// Estado do carrinho
let cartData = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  // loadProducts(); // Comentado para mostrar os cards de exemplo
  loadCartFromStorage();
  setupEventListeners();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Abrir/Fechar carrinho
  btnCart.addEventListener("click", toggleCart);
  btnCloseCart.addEventListener("click", toggleCart);
  cartOverlay.addEventListener("click", toggleCart);

  // Checkout
  btnCheckout.addEventListener("click", handleCheckout);

  // Newsletter
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit);
  }
}

// ===== CARREGAR PRODUTOS DO FIREBASE =====
function loadProducts() {
  // Mostrar loading
  productGrid.innerHTML =
    '<p style="text-align: center; grid-column: 1/-1;">Carregando produtos...</p>';

  db.collection("products")
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (querySnapshot) => {
        productGrid.innerHTML = "";

        if (querySnapshot.empty) {
          productGrid.innerHTML =
            '<p style="text-align: center; grid-column: 1/-1;">Nenhum produto disponível no momento.</p>';
          return;
        }

        querySnapshot.forEach((doc) => {
          const product = { id: doc.id, ...doc.data() };
          renderProduct(product);
        });
      },
      (error) => {
        console.error("Erro ao carregar produtos:", error);
        productGrid.innerHTML =
          '<p style="text-align: center; grid-column: 1/-1; color: red;">Erro ao carregar produtos. Tente novamente.</p>';
      },
    );
}

// ===== RENDERIZAR PRODUTO =====
function renderProduct(product) {
  const isOutOfStock = product.status === "esgotado";

  const productElement = document.createElement("div");
  productElement.classList.add("product");
  productElement.innerHTML = `
    <div class="product-image-wrapper">
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
      ${isOutOfStock ? '<span class="product-badge sold-out">Esgotado</span>' : ""}
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      ${product.description ? `<p class="product-description">${product.description}</p>` : ""}
      <p class="product-price">R$ ${formatPrice(product.price)}</p>
      <button 
        class="btn-add-cart" 
        ${isOutOfStock ? "disabled" : ""}
        onclick="addToCart('${product.id}', '${escapeHtml(product.name)}', ${product.price}, '${product.image}')">
        ${isOutOfStock ? "Indisponível" : "Adicionar ao Carrinho"}
      </button>
    </div>
  `;

  productGrid.appendChild(productElement);
}

// ===== ADICIONAR AO CARRINHO =====
function addToCart(id, name, price, image) {
  const existingProduct = cartData.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cartData.push({ id, name, price, image, quantity: 1 });
  }

  updateCart();
  saveCartToStorage();
  showNotification("Produto adicionado ao carrinho!");

  // Abrir carrinho automaticamente
  if (!cart.classList.contains("active")) {
    toggleCart();
  }
}

// ===== REMOVER DO CARRINHO =====
function removeFromCart(id) {
  cartData = cartData.filter((item) => item.id !== id);
  updateCart();
  saveCartToStorage();
  showNotification("Produto removido do carrinho!");
}

// ===== ATUALIZAR QUANTIDADE =====
function updateQuantity(id, change) {
  const product = cartData.find((item) => item.id === id);

  if (product) {
    product.quantity += change;

    if (product.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart();
      saveCartToStorage();
    }
  }
}

// ===== ATUALIZAR CARRINHO =====
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  if (cartData.length === 0) {
    cartEmpty.style.display = "flex";
    cartItems.style.display = "none";
    btnCheckout.disabled = true;
    cartCount.textContent = "0";
  } else {
    cartEmpty.style.display = "none";
    cartItems.style.display = "block";
    btnCheckout.disabled = false;

    cartData.forEach((item) => {
      total += item.price * item.quantity;

      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">R$ ${formatPrice(item.price)}</p>
          <div class="cart-item-quantity">
            <button class="btn-quantity" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="btn-quantity" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="btn-remove" onclick="removeFromCart('${item.id}')" aria-label="Remover produto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      `;

      cartItems.appendChild(cartItem);
    });

    // Atualizar contador
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  cartTotal.textContent = `R$ ${formatPrice(total)}`;
}

// ===== TOGGLE CARRINHO =====
function toggleCart() {
  const isActive = cart.classList.contains("active");
  if (isActive) {
    cart.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  } else {
    cart.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// ===== CHECKOUT VIA WHATSAPP =====
function handleCheckout() {
  if (cartData.length === 0) return;

  // Número do WhatsApp (substitua pelo número real)
  const whatsappNumber = "5511999999999"; // Formato: código país + DDD + número

  // Montar mensagem
  let message = "*🛍️ Pedido - Leuria*%0A%0A";

  cartData.forEach((item, index) => {
    message += `*${index + 1}.* ${item.name}%0A`;
    message += `   Qtd: ${item.quantity}x R$ ${formatPrice(item.price)}%0A`;
    message += `   Subtotal: R$ ${formatPrice(item.price * item.quantity)}%0A%0A`;
  });

  const total = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  message += `*💰 Total: R$ ${formatPrice(total)}*`;

  // Abrir WhatsApp
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(whatsappURL, "_blank");
}

// ===== PERSISTÊNCIA DO CARRINHO =====
function saveCartToStorage() {
  localStorage.setItem("leuriaCart", JSON.stringify(cartData));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("leuriaCart");
  if (savedCart) {
    cartData = JSON.parse(savedCart);
    updateCart();
  }
}

// ===== SCROLL SUAVE PARA PRODUTOS =====
function scrollToProducts() {
  const productsSection = document.getElementById("products-section");
  const headerHeight = document.querySelector(".header").offsetHeight;
  const targetPosition = productsSection.offsetTop - headerHeight - 20;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
}

// ===== NEWSLETTER =====
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const emailInput = e.target.querySelector('input[type="email"]');
  const email = emailInput.value;

  if (email) {
    // Aqui você pode adicionar integração com Firebase ou serviço de e-mail
    showNotification(
      "Obrigado por se inscrever! Em breve você receberá nossas novidades.",
    );
    emailInput.value = "";
  }
}

// ===== FUNÇÕES UTILITÁRIAS =====
function formatPrice(price) {
  return price.toFixed(2).replace(".", ",");
}

function escapeHtml(text) {
  return text.replace(/'/g, "\\'");
}

function showNotification(message) {
  // Criar notificação simples
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #2d6a4f;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideDown 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Adicionar animações CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes slideUp {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100px); opacity: 0; }
  }
`;
document.head.appendChild(style);

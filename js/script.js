/* ========================================
   LOJA ANDREZA - JAVASCRIPT PRINCIPAL
   
   Estrutura:
   1. Configuração
   2. Serviços (WhatsApp, Produtos)
   3. Controllers (UI, Navigation)
   4. Helpers/Utilitários
   5. Inicialização
======================================== */

// ========================================
// 1. CONFIGURAÇÃO
// ========================================

// DEV_MODE, devLog, devWarn e devError já foram definidos em firebase-config.js

const CONFIG = {
  WHATSAPP_NUMBER: "5567996149130", // ⚠️ Alterar para o WhatsApp da loja
  STORAGE_KEY: "outlet_makeup_products",
};

const CATEGORY_NAMES = {
  maquiagem: "Maquiagem",
  pijama: "Pijama",
  "sexy-shop": "Sexy Shop",
};

// ========================================
// 2. SERVIÇOS
// ========================================

/**
 * Serviço de WhatsApp
 */
const WhatsAppService = {
  open(productName) {
    const message = `Olá! Tenho interesse no produto: ${productName}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encodedMessage}`;
    window.open(url, "_blank");
  },

  openContact() {
    const message = "Olá! Gostaria de conhecer os produtos da loja.";
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encodedMessage}`;
    window.open(url, "_blank");
  },
};

/**
 * Serviço de Produtos
 */
const ProductService = {
  async getAll() {
    devLog("🔍 ProductService.getAll() chamado...");
    try {
      // Tenta buscar do Firebase primeiro
      devLog(
        `🔥 Verificando Firebase: window.FirebaseProductService = ${typeof window.FirebaseProductService}, window.firebaseInitialized = ${window.firebaseInitialized}`,
      );

      if (window.FirebaseProductService && window.firebaseInitialized) {
        devLog("🔥 Buscando produtos do Firebase...");
        const fbProducts = await window.FirebaseProductService.getAll();
        devLog(`🔥 Carregados ${fbProducts.length} produtos do Firebase`);
        return fbProducts;
      } else {
        devWarn("⚠️ Firebase não disponível, pulando...");
      }
    } catch (error) {
      devWarn("⚠️ Erro ao buscar do Firebase, usando LocalStorage", error);
    }

    // Fallback para LocalStorage
    const localProducts =
      JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];
    devLog(`💾 Carregados ${localProducts.length} produtos do LocalStorage`);
    return localProducts;
  },

  async getAvailable() {
    const products = await this.getAll();
    return products.filter((p) => p.status === "available" && !p.soldOut);
  },

  async getByCategory(category) {
    const products = await this.getAvailable();
    return products.filter((p) => p.category === category);
  },
};

// ========================================
// 3. CONTROLLERS
// ========================================

/**
 * Controller de Compras/WhatsApp
 */
const BuyController = {
  init() {
    document.querySelectorAll(".btn-buy").forEach((button) => {
      button.addEventListener("click", () => {
        const productName = button.getAttribute("data-product");
        WhatsAppService.open(productName);
      });
    });
  },
};

/**
 * Controller de Menu Mobile
 */
const MenuController = {
  init() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
      menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
        menuToggle.classList.toggle("active");
      });

      // Fechar ao clicar em um link
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("active");
          menuToggle.classList.remove("active");
        });
      });
    }
  },
};

/**
 * Controller de Contato
 */
const ContactController = {
  init() {
    const contactBtn = document.getElementById("contact-whatsapp");
    if (contactBtn) {
      contactBtn.addEventListener("click", (e) => {
        e.preventDefault();
        WhatsAppService.openContact();
      });
    }
  },
};

/**
 * Controller de Scroll Suave
 */
const ScrollController = {
  init() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        if (href && href !== "#") {
          e.preventDefault();

          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });
  },
};

/**
 * Controller de Animações de Scroll
 */
const AnimationController = {
  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Aplica animação em todos os cards de produtos
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card, index) => {
      // Define estado inicial
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `all 0.6s ease ${index * 0.1}s`;

      // Observa o card
      observer.observe(card);
    });
  },
};

// ========================================
// CARREGAR PRODUTOS DO ADMIN
// ========================================

/**
 * Carrega produtos do LocalStorage e exibe nas páginas
 */
async function loadDynamicProducts() {
  try {
    const products = await ProductService.getAll();

    // Filtra apenas produtos disponíveis (não esgotados)
    const availableProducts = products.filter(
      (p) => p.status === "available" && !p.soldOut,
    );

    devLog(
      `📦 ${products.length} produtos totais, ${availableProducts.length} disponíveis`,
    );

    // Carrega produtos por categoria
    if (document.getElementById("makeup-grid")) {
      await loadProductsByCategory(
        availableProducts,
        "maquiagem",
        "makeup-grid",
      );
    }

    if (document.getElementById("pajamas-grid")) {
      await loadProductsByCategory(availableProducts, "pijama", "pajamas-grid");
    }

    // Página Sexy Shop - carrega todas as categorias de sexy-shop
    if (document.querySelector(".sexy-shop-body")) {
      await loadSexyShopProducts(availableProducts);
    }
  } catch (error) {
    devError("❌ Erro ao carregar produtos:", error);
  }
}

/**
 * Carrega produtos do Sexy Shop
 */
function loadSexyShopProducts(products) {
  const sexyProducts = products.filter((p) => p.category === "sexy-shop");

  if (sexyProducts.length === 0) return;

  const container = document.querySelector(".sexy-products-section .container");
  if (!container) return;

  // Remove seções antigas
  container.querySelectorAll(".category-section").forEach((el) => el.remove());

  // Cria nova seção
  const section = document.createElement("div");
  section.className = "category-section";
  section.innerHTML = `
    <h3 class="category-title">🔥 Produtos Adicionados pelo Admin</h3>
    <div class="products-grid sexy-grid" id="admin-sexy-products"></div>
  `;

  container.appendChild(section);

  const grid = document.getElementById("admin-sexy-products");
  sexyProducts.forEach((product) => {
    grid.appendChild(ProductRenderer.createCard(product, true));
  });

  // Re-atribuir event listeners aos novos botões
  if (window.CartUIController) {
    window.CartUIController.attachCartButtons();
  }
}

/**
 * Carrega produtos de uma categoria específica
 */
function loadProductsByCategory(products, category, gridId) {
  const categoryProducts = products.filter((p) => p.category === category);

  devLog(
    `🔍 Carregando ${categoryProducts.length} produtos da categoria "${category}" no grid "${gridId}"`,
  );

  const grid = document.getElementById(gridId);
  if (!grid) {
    devWarn(`❌ Grid "${gridId}" não encontrado no DOM`);
    return;
  }

  // SEMPRE limpa produtos estáticos e mostra os do Firebase
  // (mesmo que esteja vazio - isso reflete o estado real do Firebase)
  grid.innerHTML = ""; // Limpa produtos estáticos

  if (categoryProducts.length === 0) {
    devLog(`⚠️ Nenhum produto encontrado para "${category}"`);
  }

  categoryProducts.forEach((product) => {
    const card = ProductRenderer.createCard(product, false);
    grid.appendChild(card);
  });

  // Re-atribuir event listeners aos novos botões
  if (window.CartUIController) {
    window.CartUIController.attachCartButtons();
  }
}

// ========================================
// 4. HELPERS/UTILITÁRIOS
// ========================================

/**
 * Helper para renderização de produtos
 */
const ProductRenderer = {
  createCard(product, isSexyShop) {
    const card = document.createElement("div");
    card.className = isSexyShop ? "product-card sexy-card" : "product-card";

    const categoryLabel = isSexyShop
      ? `<span class="sexy-category">${CATEGORY_NAMES[product.category]}</span>`
      : "";

    const badge = product.isNew ? '<div class="sexy-badge">Novo</div>' : "";

    const priceFormatted = PriceHelper.format(product.price);

    card.innerHTML = `
      ${badge}
      <div class="product-image ${isSexyShop ? "sexy-image" : ""}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-info ${isSexyShop ? "sexy-info" : ""}">
        ${categoryLabel}
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price ${isSexyShop ? "sexy-price" : ""}">R$ ${priceFormatted}</p>
        <button 
          class="btn btn-add-to-cart" 
          data-name="${product.name}"
          data-price="${priceFormatted}"
          data-image="${product.image}">
          🛒 Adicionar ao Carrinho
        </button>
      </div>
    `;

    return card;
  },
};

/**
 * Helper para formatação de preço
 */
const PriceHelper = {
  format(price) {
    if (typeof price === "string") {
      price = price.replace(",", ".");
    }
    return parseFloat(price).toFixed(2);
  },
};

/**
 * Helper para tratamento de imagens
 */
const ImageHelper = {
  init() {
    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", function () {
        this.src =
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f5e6d3"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImagem%3C/text%3E%3C/svg%3E';
      });
    });
  },

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  },
};

// ========================================
// 5. INICIALIZAÇÃO
// ========================================

/**
 * Inicialização principal da aplicação
 */
document.addEventListener("DOMContentLoaded", async () => {
  devLog("🚀 Iniciando carregamento da página...");

  // 0. Inicializar Firebase (se disponível)
  if (window.initFirebase) {
    const firebaseOk = window.initFirebase();
    devLog(`🔥 Firebase inicializado: ${firebaseOk ? "SIM" : "NÃO"}`);
  } else {
    devWarn("⚠️ initFirebase não encontrado!");
  }

  // 1. Carregar produtos dinâmicos primeiro
  devLog("📦 Iniciando carregamento de produtos...");
  await loadDynamicProducts();
  devLog("✅ Produtos carregados!");

  // 2. Inicializar componentes de UI
  BuyController.init();
  MenuController.init();
  ContactController.init();
  ScrollController.init();
  AnimationController.init();
  ImageHelper.init();

  // 3. Log de sucesso
  devLog("🌟 Andreza Store - Site carregado!");
  const availableCount = (await ProductService.getAvailable()).length;
  devLog("💡 Produtos disponíveis:", availableCount);
});

// Exportar funções globais (para compatibilidade)
window.openWhatsApp = WhatsAppService.open;

// ========================================
// SISTEMA DE CARRINHO DE COMPRAS
// ========================================

/**
 * Serviço de Carrinho - Gerencia localStorage e operações
 */
const CartService = {
  STORAGE_KEY: "andreza_store_cart",

  getCart() {
    const cart = localStorage.getItem(this.STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  },

  addItem(product) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.name === product.name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: 1,
      });
    }

    this.saveCart(cart);
    return cart;
  },

  updateQuantity(productName, newQuantity) {
    if (newQuantity < 1) return this.getCart();

    const cart = this.getCart();
    const item = cart.find((item) => item.name === productName);

    if (item) {
      item.quantity = newQuantity;
      this.saveCart(cart);
    }

    return cart;
  },

  removeItem(productName) {
    let cart = this.getCart();
    cart = cart.filter((item) => item.name !== productName);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    return [];
  },

  getTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
};

/**
 * Controller de UI do Carrinho
 */
const CartUIController = {
  modal: null,
  overlay: null,
  cartIcon: null,
  cartBadge: null,
  cartBody: null,
  cartItems: null,
  cartEmpty: null,
  cartTotal: null,

  init() {
    this.modal = document.getElementById("cart-modal");
    this.overlay = document.getElementById("cart-overlay");
    this.cartIcon = document.getElementById("cart-icon");
    this.cartBadge = document.getElementById("cart-badge");
    this.cartBody = document.getElementById("cart-body");
    this.cartItems = document.getElementById("cart-items");
    this.cartEmpty = document.getElementById("cart-empty");
    this.cartTotal = document.getElementById("cart-total");

    this.setupEventListeners();
    this.updateUI();
  },

  setupEventListeners() {
    // Abrir carrinho
    this.cartIcon.addEventListener("click", () => this.openCart());

    // Fechar carrinho
    document
      .getElementById("cart-close")
      .addEventListener("click", () => this.closeCart());
    this.overlay.addEventListener("click", () => this.closeCart());

    // Limpar carrinho
    document
      .getElementById("clear-cart")
      .addEventListener("click", () => this.clearCart());

    // Finalizar no WhatsApp
    document
      .getElementById("checkout-whatsapp")
      .addEventListener("click", () => this.checkoutWhatsApp());

    // Adicionar ao carrinho (produtos estáticos)
    this.attachCartButtons();
  },

  attachCartButtons() {
    // Remove listeners antigos e adiciona novos (evita duplicação)
    document.querySelectorAll(".btn-add-to-cart").forEach((button) => {
      // Clona o botão para remover todos os event listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Adiciona o novo event listener
      newButton.addEventListener("click", (e) => {
        const product = {
          name: newButton.dataset.name,
          price: newButton.dataset.price,
          image: newButton.dataset.image,
        };
        this.addToCart(product, newButton);
      });
    });
  },

  openCart() {
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  closeCart() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  },

  addToCart(product, button) {
    // Adicionar produto
    CartService.addItem(product);

    // Animação do botão
    button.classList.add("adding");
    setTimeout(() => button.classList.remove("adding"), 300);

    // Atualizar UI
    this.updateUI();

    // Mostrar feedback visual
    this.showAddedFeedback();
  },

  showAddedFeedback() {
    // Animar badge
    this.cartBadge.style.animation = "none";
    setTimeout(() => {
      this.cartBadge.style.animation = "pulse 2s infinite";
    }, 10);
  },

  updateUI() {
    const cart = CartService.getCart();
    const itemCount = CartService.getItemCount();
    const total = CartService.getTotal();

    // Atualizar badge
    this.cartBadge.textContent = itemCount;
    this.cartBadge.style.display = itemCount > 0 ? "flex" : "none";

    // Atualizar total
    this.cartTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;

    // Mostrar/esconder mensagem de carrinho vazio
    if (cart.length === 0) {
      this.cartEmpty.style.display = "block";
      this.cartItems.style.display = "none";
    } else {
      this.cartEmpty.style.display = "none";
      this.cartItems.style.display = "flex";
      this.renderCartItems(cart);
    }
  },

  renderCartItems(cart) {
    this.cartItems.innerHTML = "";

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</div>
          <div class="cart-item-actions">
            <div class="cart-item-qty-control">
              <button class="cart-item-qty-btn" data-action="decrease" data-name="${item.name}" ${item.quantity <= 1 ? "disabled" : ""}>
                −
              </button>
              <span class="cart-item-qty">${item.quantity}</span>
              <button class="cart-item-qty-btn" data-action="increase" data-name="${item.name}">
                +
              </button>
            </div>
            <button class="cart-item-remove" data-name="${item.name}">
              🗑️ Remover
            </button>
          </div>
        </div>
      `;

      this.cartItems.appendChild(cartItem);
    });

    // Adicionar event listeners aos botões
    this.setupItemEventListeners();
  },

  setupItemEventListeners() {
    // Aumentar/diminuir quantidade
    document.querySelectorAll(".cart-item-qty-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        const productName = button.dataset.name;
        const cart = CartService.getCart();
        const item = cart.find((i) => i.name === productName);

        if (item) {
          const newQuantity =
            action === "increase" ? item.quantity + 1 : item.quantity - 1;
          CartService.updateQuantity(productName, newQuantity);
          this.updateUI();
        }
      });
    });

    // Remover item
    document.querySelectorAll(".cart-item-remove").forEach((button) => {
      button.addEventListener("click", () => {
        const productName = button.dataset.name;
        CartService.removeItem(productName);
        this.updateUI();
      });
    });
  },

  clearCart() {
    if (confirm("Deseja realmente limpar o carrinho?")) {
      CartService.clearCart();
      this.updateUI();
    }
  },

  checkoutWhatsApp() {
    const cart = CartService.getCart();

    if (cart.length === 0) {
      // Cria uma notificação toast
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #333; color: white; padding: 15px 25px; border-radius: 10px;
        z-index: 10000; font-family: Arial, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      notification.textContent = "🛍️ Seu carrinho está vazio!";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 2000);
      return;
    }

    const total = CartService.getTotal();
    let message = "🛍️ *Olá! Gostaria de fazer um pedido:*\n\n";

    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      message += `${index + 1}. *${item.name}*\n`;
      message += `   • Quantidade: ${item.quantity}\n`;
      message += `   • Preço unitário: R$ ${item.price.toFixed(2).replace(".", ",")}\n`;
      message += `   • Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}\n\n`;
    });

    message += `💰 *TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*\n\n`;
    message += "Aguardo confirmação! 😊";

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  },
};

// ========================================
// INICIALIZAÇÃO DO CARRINHO
// ========================================

// Adicionar ao evento DOMContentLoaded existente
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar carrinho após outros componentes
  setTimeout(() => {
    CartUIController.init();
    window.CartUIController = CartUIController; // Exportar globalmente
    devLog("🛒 Sistema de carrinho inicializado!");
  }, 100);
});

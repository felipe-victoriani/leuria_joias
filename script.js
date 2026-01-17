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

const CONFIG = {
  WHATSAPP_NUMBER: "5511987654321", // ⚠️ Alterar para o WhatsApp da loja
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
    try {
      // Tenta buscar do Firebase primeiro
      if (window.FirebaseProductService && firebaseInitialized) {
        return await window.FirebaseProductService.getAll();
      }
    } catch (error) {
      console.warn("⚠️ Erro ao buscar do Firebase, usando LocalStorage", error);
    }

    // Fallback para LocalStorage
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];
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
      (p) => p.status === "available" && !p.soldOut
    );

    console.log(
      `📦 ${products.length} produtos totais, ${availableProducts.length} disponíveis`
    );

    // Carrega produtos por categoria
    if (document.getElementById("makeup-grid")) {
      await loadProductsByCategory(
        availableProducts,
        "maquiagem",
        "makeup-grid"
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
    console.error("❌ Erro ao carregar produtos:", error);
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
}

/**
 * Carrega produtos de uma categoria específica
 */
function loadProductsByCategory(products, category, gridId) {
  const categoryProducts = products.filter((p) => p.category === category);

  if (categoryProducts.length === 0) return;

  const grid = document.getElementById(gridId);
  if (!grid) return;

  // Limpa produtos estáticos
  grid.innerHTML = "";

  categoryProducts.forEach((product) => {
    const card = ProductRenderer.createCard(product, false);
    grid.appendChild(card);
  });
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

    const buttonClass = isSexyShop ? "btn sexy-btn-buy" : "btn btn-buy";
    const buttonText = isSexyShop
      ? "<span>🔒</span> Comprar com Discrição"
      : "Comprar no WhatsApp";

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
          class="${buttonClass}" 
          data-product="${product.name} - R$ ${priceFormatted}"
          data-category="${product.category}">
          ${buttonText}
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
      navigator.userAgent
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
  // 0. Inicializar Firebase (se disponível)
  if (window.initFirebase) {
    window.initFirebase();
  }

  // 1. Carregar produtos dinâmicos primeiro
  await loadDynamicProducts();

  // 2. Inicializar componentes de UI
  BuyController.init();
  MenuController.init();
  ContactController.init();
  ScrollController.init();
  AnimationController.init();
  ImageHelper.init();

  // 3. Log de sucesso
  console.log("🌟 Andreza Store - Site carregado!");
  const availableCount = (await ProductService.getAvailable()).length;
  console.log("💡 Produtos disponíveis:", availableCount);
});

// Exportar funções globais (para compatibilidade)
window.openWhatsApp = WhatsAppService.open;

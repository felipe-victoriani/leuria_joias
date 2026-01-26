// ===== CONFIGURAÇÕES E VARIÁVEIS GLOBAIS =====
let cart = [];
let products = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎯 Léuria - Sistema iniciando...");

  // Carregar carrinho do localStorage
  loadCartFromStorage();

  // Inicializar eventos
  initializeEventListeners();

  // Carregar produtos do Firebase
  loadProductsFromFirebase();

  // Atualizar badge do carrinho
  updateCartBadge();

  console.log("✅ Sistema inicializado com sucesso!");
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
  // Cart Modal
  const cartIcon = document.getElementById("cart-icon");
  const cartModal = document.getElementById("cart-modal");
  const cartClose = document.getElementById("cart-close");
  const cartOverlay = document.getElementById("cart-overlay");
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-whatsapp");
  const contactBtn = document.getElementById("contact-whatsapp");

  // Abrir carrinho
  if (cartIcon) {
    cartIcon.addEventListener("click", openCart);
  }

  // Fechar carrinho
  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  // Limpar carrinho
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  // WhatsApp buttons
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", sendWhatsAppOrder);
  }
  if (contactBtn) {
    contactBtn.addEventListener("click", sendWhatsAppContact);
  }

  // Menu toggle para mobile
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  // Smooth scroll para links de navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ===== CARREGAR PRODUTOS DO FIREBASE =====
function loadProductsFromFirebase() {
  console.log("📦 Carregando produtos do Firebase...");

  try {
    // Carregar bolsas
    firebase
      .database()
      .ref("products/bolsas")
      .once("value")
      .then((snapshot) => {
        const bolsasData = snapshot.val();
        if (bolsasData) {
          const bolsasArray = Object.entries(bolsasData).map(
            ([key, value]) => ({
              id: key,
              ...value,
              category: "bolsas",
            }),
          );
          renderProducts(bolsasArray, "bags-grid");
          console.log(`✅ ${bolsasArray.length} bolsas carregadas`);
        } else {
          showNoProductsMessage("bags-grid", "Nenhuma bolsa encontrada");
        }
      })
      .catch((error) => {
        console.error("❌ Erro ao carregar bolsas:", error);
        showNoProductsMessage("bags-grid", "Erro ao carregar bolsas");
      });

    // Carregar acessórios
    firebase
      .database()
      .ref("products/acessorios")
      .once("value")
      .then((snapshot) => {
        const acessoriosData = snapshot.val();
        if (acessoriosData) {
          const acessoriosArray = Object.entries(acessoriosData).map(
            ([key, value]) => ({
              id: key,
              ...value,
              category: "acessorios",
            }),
          );
          renderProducts(acessoriosArray, "accessories-grid");
          console.log(`✅ ${acessoriosArray.length} acessórios carregados`);
        } else {
          showNoProductsMessage(
            "accessories-grid",
            "Nenhum acessório encontrado",
          );
        }
      })
      .catch((error) => {
        console.error("❌ Erro ao carregar acessórios:", error);
        showNoProductsMessage(
          "accessories-grid",
          "Erro ao carregar acessórios",
        );
      });
  } catch (error) {
    console.error("❌ Erro geral ao carregar produtos:", error);
    showErrorMessage();
  }
}

// ===== RENDERIZAR PRODUTOS =====
function renderProducts(products, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) {
    console.error(`❌ Grid não encontrada: ${gridId}`);
    return;
  }

  if (!products || products.length === 0) {
    showNoProductsMessage(gridId, "Nenhum produto encontrado");
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card" data-aos="fade-up">
            <img 
                src="${product.image || "images/placeholder.jpg"}" 
                alt="${product.name}" 
                class="product-image"
                onerror="this.src='images/placeholder.jpg'"
            />
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">R$ ${parseFloat(product.price).toFixed(2).replace(".", ",")}</p>
                <p class="product-description">${product.description || "Produto de excelente qualidade"}</p>
                <button 
                    class="btn btn-add-cart" 
                    onclick="addToCart('${product.id}', '${product.name}', '${product.price}', '${product.image}', '${product.category}')"
                >
                    🛒 Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// ===== MENSAGEM DE PRODUTOS VAZIOS =====
function showNoProductsMessage(gridId, message) {
  const grid = document.getElementById(gridId);
  if (grid) {
    grid.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #8b4513; grid-column: 1 / -1;">
                <p style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px;">📦 ${message}</p>
                <span style="color: #6d4c41;">Em breve teremos novidades incríveis!</span>
            </div>
        `;
  }
}

// ===== MENSAGEM DE ERRO =====
function showErrorMessage() {
  const grids = ["bags-grid", "accessories-grid"];
  grids.forEach((gridId) => {
    const grid = document.getElementById(gridId);
    if (grid) {
      grid.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #ff6b6b; grid-column: 1 / -1;">
                    <p style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px;">⚠️ Erro ao carregar produtos</p>
                    <span style="color: #6d4c41;">Tente recarregar a página</span>
                </div>
            `;
    }
  });
}

// ===== ADICIONAR AO CARRINHO =====
function addToCart(id, name, price, image, category) {
  console.log("🛒 Adicionando produto ao carrinho:", name);

  // Verificar se o produto já existe no carrinho
  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
    console.log(`📈 Quantidade aumentada: ${existingProduct.quantity}`);
  } else {
    const product = {
      id: id,
      name: name,
      price: parseFloat(price),
      image: image,
      category: category,
      quantity: 1,
    };
    cart.push(product);
    console.log("✅ Produto adicionado:", product);
  }

  updateCartBadge();
  updateCartDisplay();
  saveCartToStorage();

  // Feedback visual
  showAddToCartFeedback();
}

// ===== FEEDBACK VISUAL =====
function showAddToCartFeedback() {
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.style.transform = "scale(1.2)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);
  }
}

// ===== ATUALIZAR BADGE DO CARRINHO =====
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  }
}

// ===== ABRIR/FECHAR CARRINHO =====
function openCart() {
  console.log("🛒 Abrindo carrinho...");
  const modal = document.getElementById("cart-modal");
  if (modal) {
    modal.classList.add("active");
    updateCartDisplay();
    document.body.style.overflow = "hidden";
  }
}

function closeCart() {
  console.log("🚪 Fechando carrinho...");
  const modal = document.getElementById("cart-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// ===== ATUALIZAR DISPLAY DO CARRINHO =====
function updateCartDisplay() {
  const cartEmpty = document.getElementById("cart-empty");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-whatsapp");

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.style.display = "block";
    if (cartItems) cartItems.style.display = "none";
    if (checkoutBtn) checkoutBtn.disabled = true;
  } else {
    if (cartEmpty) cartEmpty.style.display = "none";
    if (cartItems) cartItems.style.display = "block";
    if (checkoutBtn) checkoutBtn.disabled = false;

    renderCartItems();
  }

  updateCartTotal();
}

// ===== RENDERIZAR ITENS DO CARRINHO =====
function renderCartItems() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img 
                src="${item.image || "images/placeholder.jpg"}" 
                alt="${item.name}" 
                class="cart-item-image"
                onerror="this.src='images/placeholder.jpg'"
            />
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">🗑️</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// ===== ATUALIZAR QUANTIDADE =====
function updateQuantity(id, change) {
  const product = cart.find((item) => item.id === id);
  if (product) {
    product.quantity += change;

    if (product.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartBadge();
      updateCartDisplay();
      saveCartToStorage();
      console.log(
        `📊 Quantidade atualizada: ${product.name} = ${product.quantity}`,
      );
    }
  }
}

// ===== REMOVER DO CARRINHO =====
function removeFromCart(id) {
  const productIndex = cart.findIndex((item) => item.id === id);
  if (productIndex > -1) {
    const removedProduct = cart.splice(productIndex, 1)[0];
    console.log("🗑️ Produto removido:", removedProduct.name);

    updateCartBadge();
    updateCartDisplay();
    saveCartToStorage();
  }
}

// ===== LIMPAR CARRINHO =====
function clearCart() {
  console.log("🧹 Limpando carrinho...");
  cart = [];
  updateCartBadge();
  updateCartDisplay();
  saveCartToStorage();
}

// ===== ATUALIZAR TOTAL DO CARRINHO =====
function updateCartTotal() {
  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    totalElement.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }
}

// ===== WHATSAPP FUNCTIONS =====
function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = `🛍️ *Pedido - Léuria*%0A%0A`;
  message += `📦 *Itens do pedido:*%0A`;

  cart.forEach((item) => {
    message += `• ${item.name}%0A`;
    message += `  Quantidade: ${item.quantity}%0A`;
    message += `  Preço unitário: R$ ${item.price.toFixed(2).replace(".", ",")}%0A`;
    message += `  Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}%0A%0A`;
  });

  message += `💰 *Total: R$ ${total.toFixed(2).replace(".", ",")}*%0A%0A`;
  message += `🏪 Obrigado por escolher a Léuria!`;

  // Número do WhatsApp da loja (ajustar conforme necessário)
  const phoneNumber = "5567996149130";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  console.log("📱 Enviando pedido via WhatsApp...");
  window.open(whatsappUrl, "_blank");
}

function sendWhatsAppContact() {
  const message = `Olá! 👋%0A%0AGostaria de saber mais sobre os produtos da *Léuria*.%0A%0APodem me ajudar? 😊`;
  const phoneNumber = "5567996149130";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  console.log("📱 Abrindo WhatsApp para contato...");
  window.open(whatsappUrl, "_blank");
}

// ===== STORAGE FUNCTIONS =====
function saveCartToStorage() {
  try {
    localStorage.setItem("leuria-cart", JSON.stringify(cart));
    console.log("💾 Carrinho salvo no localStorage");
  } catch (error) {
    console.error("❌ Erro ao salvar carrinho:", error);
  }
}

function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem("leuria-cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      console.log(
        "📂 Carrinho carregado do localStorage:",
        cart.length,
        "itens",
      );
    }
  } catch (error) {
    console.error("❌ Erro ao carregar carrinho:", error);
    cart = [];
  }
}

// ===== UTILIDADES =====
function formatPrice(price) {
  return parseFloat(price).toFixed(2).replace(".", ",");
}

function isValidProduct(product) {
  return (
    product &&
    product.name &&
    product.price &&
    !isNaN(parseFloat(product.price))
  );
}

// ===== TRATAMENTO DE ERROS GLOBAIS =====
window.addEventListener("error", function (event) {
  console.error("❌ Erro global capturado:", event.error);
});

// ===== LOG DE INICIALIZAÇÃO =====
console.log(`
🌟 ===================================
   LÉURIA - BOLSAS & ACESSÓRIOS
   Sistema de E-commerce
   Versão: 1.0.0
===================================
`);

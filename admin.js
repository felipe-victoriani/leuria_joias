/* ========================================
   PAINEL ADMINISTRATIVO - JAVASCRIPT
   Sistema de gerenciamento de produtos
======================================== */

// CREDENCIAIS DE ACESSO
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";

// CHAVE DO LOCALSTORAGE
const STORAGE_KEY = "outlet_makeup_products";

// Gerar ID único para produtos iniciais
function generateUniqueId() {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ========================================
// PRODUTOS INICIAIS (do site)
// ========================================
const INITIAL_PRODUCTS = [
  // MAQUIAGEM
  {
    id: generateUniqueId(),
    name: "Paleta de Sombras",
    price: "89.90",
    category: "maquiagem",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Batom Matte",
    price: "45.00",
    category: "maquiagem",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Base Líquida HD",
    price: "75.00",
    category: "maquiagem",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Máscara para Cílios",
    price: "52.00",
    category: "maquiagem",
    image:
      "https://images.unsplash.com/photo-1616683693504-3b3e409f9118?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Blush Compacto",
    price: "38.00",
    category: "maquiagem",
    image:
      "https://images.unsplash.com/photo-1625019030820-e4ed970a6c95?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Delineador Líquido",
    price: "35.00",
    category: "maquiagem",
    image:
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  // PIJAMAS
  {
    id: generateUniqueId(),
    name: "Pijama Cetim Rosa",
    price: "120.00",
    category: "pijama",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Pijama Seda Preto",
    price: "135.00",
    category: "pijama",
    image:
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Conjunto Pijama Shorts",
    price: "89.00",
    category: "pijama",
    image:
      "https://images.unsplash.com/photo-1609262337488-5c5e26e5f253?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Pijama Longo Inverno",
    price: "110.00",
    category: "pijama",
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Robe Aveludado",
    price: "150.00",
    category: "pijama",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Camisola Renda",
    price: "95.00",
    category: "pijama",
    image:
      "https://images.unsplash.com/photo-1619255952262-aa6734dfaa58?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  // SEXY SHOP
  {
    id: generateUniqueId(),
    name: "Conjunto Lingerie Renda",
    price: "149.90",
    category: "sexy-shop",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Body Sensual",
    price: "129.90",
    category: "sexy-shop",
    image:
      "https://images.unsplash.com/photo-1596913039664-f042b619c050?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Cinta-Liga Delicada",
    price: "79.90",
    category: "sexy-shop",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Algemas Macias",
    price: "69.90",
    category: "sexy-shop",
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Colar Sensual",
    price: "55.90",
    category: "sexy-shop",
    image:
      "https://images.unsplash.com/photo-1596913039664-f042b619c050?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Óleo Massagem Relaxante",
    price: "89.90",
    category: "sexy-shop",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Vela Aromática Sensual",
    price: "65.90",
    category: "sexy-shop",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
];

// ========================================
// IMPORTAÇÃO INICIAL
// ========================================
async function initializeProducts() {
  try {
    const products = await FirebaseProductService.getAll();

    if (products.length === 0) {
      console.log("📦 Importando produtos iniciais...");
      await FirebaseProductService.saveAll(INITIAL_PRODUCTS);
      console.log(
        "✅ " + INITIAL_PRODUCTS.length + " produtos importados com sucesso!",
      );
    }

    // Backup no LocalStorage
    const existingProducts = localStorage.getItem(STORAGE_KEY);
    if (!existingProducts || existingProducts === "[]") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  } catch (error) {
    console.error("Erro ao inicializar produtos:", error);
    // Fallback para LocalStorage
    const existingProducts = localStorage.getItem(STORAGE_KEY);
    if (!existingProducts || existingProducts === "[]") {
      console.log("📦 Importando produtos iniciais (fallback)...");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener("DOMContentLoaded", async function () {
  // Inicializa Firebase primeiro
  const firebaseReady = initFirebase();

  if (firebaseReady) {
    console.log("✅ Firebase conectado!");
    await initializeProducts();
  } else {
    console.warn(
      "⚠️ Firebase não configurado. Usando LocalStorage como fallback.",
    );
    console.log(
      "💡 Configure o Firebase seguindo as instruções em firebase-config.js",
    );
  }

  checkLogin();
  setupEventListeners();
});

// ========================================
// SETUP DE EVENT LISTENERS
// ========================================
function setupEventListeners() {
  // Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Logout
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", handleLogout);
  }

  // Adicionar produto
  const btnAddProduct = document.getElementById("btn-add-product");
  if (btnAddProduct) {
    btnAddProduct.addEventListener("click", openAddProductModal);
  }

  // Fechar modal
  const btnCloseModal = document.getElementById("btn-close-modal");
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", closeModal);
  }

  const btnCancel = document.getElementById("btn-cancel");
  if (btnCancel) {
    btnCancel.addEventListener("click", closeModal);
  }

  // Formulário de produto
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", handleSaveProduct);
  }

  // Filtro de categoria
  const filterCategory = document.getElementById("filter-category");
  if (filterCategory) {
    filterCategory.addEventListener("change", filterProducts);
  }

  // Preview de imagem
  const productImage = document.getElementById("product-image");
  if (productImage) {
    productImage.addEventListener("change", handleImagePreview);
  }

  // Validação de preço em tempo real
  const productPrice = document.getElementById("product-price");
  if (productPrice) {
    productPrice.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/[^0-9.,]/g, "");
    });
  }

  // Delegação de eventos para botões de ação dos produtos
  const productsList = document.getElementById("products-list");
  if (productsList) {
    productsList.addEventListener("click", function (e) {
      const button = e.target.closest("button[data-action]");
      if (!button) return;

      const action = button.dataset.action;
      const productId = button.dataset.id;

      switch (action) {
        case "edit":
          editProduct(productId);
          break;
        case "toggle":
          toggleProductStatus(productId);
          break;
        case "delete":
          deleteProduct(productId);
          break;
      }
    });
  }

  // Fechar modal ao clicar fora
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}

// ========================================
// AUTENTICAÇÃO
// ========================================
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem("admin_logged_in");

  if (isLoggedIn === "true") {
    showAdminPanel();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("admin-panel").style.display = "none";
}

function showAdminPanel() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
  loadProducts();
  updateStats();
}

function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("login-error");
  const blockedMessage = document.getElementById("login-blocked");

  // Obter resposta do reCAPTCHA (ou null em desenvolvimento)
  let captchaResponse = null;
  if (typeof grecaptcha !== "undefined") {
    captchaResponse = grecaptcha.getResponse();
  }

  // Validar login com sistema de segurança
  const result = validateLogin(username, password, captchaResponse);

  if (result.success) {
    // Login bem-sucedido
    sessionStorage.setItem("admin_logged_in", "true");
    showAdminPanel();
    showNotification("✅ Login realizado com sucesso!", "success");

    // Resetar CAPTCHA
    if (typeof grecaptcha !== "undefined") {
      grecaptcha.reset();
    }
  } else if (result.error === "locked") {
    // Conta bloqueada
    blockedMessage.style.display = "block";
    errorMessage.style.display = "none";

    // Countdown
    let remaining = result.remainingTime;
    const countdownEl = document.getElementById("countdown");

    const interval = setInterval(() => {
      remaining--;
      countdownEl.textContent = remaining;

      if (remaining <= 0) {
        clearInterval(interval);
        blockedMessage.style.display = "none";
      }
    }, 1000);
  } else if (result.error === "captcha") {
    // CAPTCHA não resolvido
    showNotification("❌ Por favor, complete o CAPTCHA!", "error");
  } else {
    // Credenciais inválidas
    errorMessage.textContent = `❌ Usuário ou senha incorretos! ${
      result.remainingAttempts
        ? `(${result.remainingAttempts} tentativas restantes)`
        : ""
    }`;
    errorMessage.style.display = "block";
    blockedMessage.style.display = "none";

    // Resetar CAPTCHA
    if (typeof grecaptcha !== "undefined") {
      grecaptcha.reset();
    }

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
  }
}

function handleLogout() {
  sessionStorage.removeItem("admin_logged_in");
  showLoginScreen();
  showNotification("👋 Você saiu do sistema", "success");
}

// ========================================
// GERENCIAMENTO DE PRODUTOS
// ========================================
function getProducts() {
  const productsJSON = localStorage.getItem(STORAGE_KEY);
  return productsJSON ? JSON.parse(productsJSON) : [];
}

async function saveProducts(products) {
  // Salva no localStorage (backup)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  // Salva no Firebase
  if (window.FirebaseProductService && window.firebaseInitialized) {
    try {
      await window.FirebaseProductService.saveAll(products);
      console.log("✅ Produtos salvos no Firebase!");
    } catch (error) {
      console.error("❌ Erro ao salvar no Firebase:", error);
    }
  }
}

function loadProducts() {
  const products = getProducts();
  const productsList = document.getElementById("products-list");
  const emptyMessage = document.getElementById("empty-message");

  productsList.innerHTML = "";

  if (products.length === 0) {
    emptyMessage.style.display = "block";
    productsList.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    productsList.style.display = "grid";

    products.forEach((product) => {
      const productItem = createProductItem(product);
      productsList.appendChild(productItem);
    });
  }

  updateStats();
}

function createProductItem(product) {
  const div = document.createElement("div");
  div.className = `product-item ${product.soldOut ? "sold-out" : ""}`;
  div.dataset.id = product.id;

  const categoryLabels = {
    maquiagem: "💄 Maquiagens",
    pijama: "👘 Pijamas",
    "sexy-shop": "🔥 Sexy Shop",
  };

  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image" />
    
    <div class="product-info">
      <h3>${product.name}</h3>
      <span class="product-category">${categoryLabels[product.category]}</span>
      <div class="product-price">R$ ${product.price}</div>
      <span class="product-status ${product.soldOut ? "status-sold-out" : "status-available"}">
        ${product.soldOut ? "❌ Esgotado" : "✅ Disponível"}
      </span>
    </div>
    
    <div class="product-actions">
      <button class="btn-small btn-edit" data-action="edit" data-id="${product.id}">
        ✏️ Editar
      </button>
      <button class="btn-small btn-toggle" data-action="toggle" data-id="${product.id}">
        ${product.soldOut ? "✅ Marcar Disponível" : "❌ Marcar Esgotado"}
      </button>
      <button class="btn-small btn-delete" data-action="delete" data-id="${product.id}">
        🗑️ Excluir
      </button>
    </div>
  `;

  return div;
}

function openAddProductModal() {
  document.getElementById("modal-title").textContent = "➕ Adicionar Produto";
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
  document.getElementById("image-preview").style.display = "none";
  document.getElementById("product-modal").style.display = "flex";
}

function editProduct(id) {
  const products = getProducts();
  const product = products.find((p) => p.id === id);

  if (product) {
    document.getElementById("modal-title").textContent = "✏️ Editar Produto";
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-sold-out").checked =
      product.soldOut || product.status === "sold-out";

    if (product.image) {
      document.getElementById("preview-img").src = product.image;
      document.getElementById("image-preview").style.display = "block";
    }

    document.getElementById("product-image").removeAttribute("required");
    document.getElementById("product-modal").style.display = "flex";
  }
}

function closeModal() {
  document.getElementById("product-modal").style.display = "none";
  document.getElementById("product-form").reset();
  document.getElementById("image-preview").style.display = "none";
}

function handleImagePreview(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("preview-img").src = event.target.result;
      document.getElementById("image-preview").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

async function handleSaveProduct(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "⏳ Salvando...";
  submitBtn.disabled = true;

  try {
    const id = document.getElementById("product-id").value;
    const name = document.getElementById("product-name").value;
    const category = document.getElementById("product-category").value;
    const price = document.getElementById("product-price").value;
    const imageFile = document.getElementById("product-image").files[0];
    const soldOut = document.getElementById("product-sold-out").checked;

    let imageBase64 = "";
    if (imageFile) {
      try {
        imageBase64 = await convertImageToBase64(imageFile);
      } catch (error) {
        showNotification(`❌ ${error}`, "error");
        return;
      }
    } else if (id) {
      const products = getProducts();
      const existingProduct = products.find((p) => p.id === id);
      imageBase64 = existingProduct ? existingProduct.image : "";
    }

    const product = {
      id: id || generateId(),
      name,
      category,
      price,
      image: imageBase64,
      status: soldOut ? "sold-out" : "available",
      soldOut,
      isNew: false,
      createdAt: id ? undefined : new Date().toISOString(),
    };

    let products = getProducts();

    if (id) {
      products = products.map((p) => (p.id === id ? { ...p, ...product } : p));
      showNotification("✅ Produto atualizado com sucesso!", "success");
    } else {
      products.push(product);
      showNotification("✅ Produto adicionado com sucesso!", "success");
    }

    saveProducts(products);
    loadProducts();
    closeModal();
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function toggleProductStatus(id) {
  try {
    let products = await getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) return;

    const updatedProduct = {
      ...product,
      soldOut: !product.soldOut,
      status: !product.soldOut ? "sold-out" : "available",
    };

    if (product.firebaseKey) {
      await FirebaseProductService.update(product.firebaseKey, updatedProduct);
    } else {
      // Fallback para método antigo
      products = products.map((p) => (p.id === id ? updatedProduct : p));
      await saveProducts(products);
    }

    await loadProducts();

    const status = updatedProduct.soldOut ? "esgotado" : "disponível";
    showNotification(`✅ Produto marcado como ${status}!`, "success");
  } catch (error) {
    showNotification("❌ Erro ao atualizar status: " + error, "error");
    console.error(error);
  }
}

async function deleteProduct(id) {
  if (
    confirm(
      "⚠️ Tem certeza que deseja excluir este produto?\n\nEsta ação não pode ser desfeita!",
    )
  ) {
    try {
      let products = await getProducts();
      const product = products.find((p) => p.id === id);

      if (product && product.firebaseKey) {
        await FirebaseProductService.remove(product.firebaseKey);
      } else {
        // Fallback para método antigo
        products = products.filter((p) => p.id !== id);
        await saveProducts(products);
      }

      await loadProducts();
      showNotification("✅ Produto excluído com sucesso!", "success");
    } catch (error) {
      showNotification("❌ Erro ao excluir produto: " + error, "error");
      console.error(error);
    }
  }
}

async function filterProducts() {
  try {
    const selectedCategory = document.getElementById("filter-category").value;
    const allProducts = await getProducts();

    const filteredProducts =
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.category === selectedCategory);

    const productsList = document.getElementById("products-list");
    productsList.innerHTML = "";

    if (filteredProducts.length === 0) {
      productsList.innerHTML =
        '<div class="empty-message">📭 Nenhum produto encontrado nesta categoria.</div>';
    } else {
      filteredProducts.forEach((product) => {
        const productItem = createProductItem(product);
        productsList.appendChild(productItem);
      });
    }
  } catch (error) {
    console.error("Erro ao filtrar produtos:", error);
  }
}

// ========================================
// ESTATÍSTICAS
// ========================================
async function updateStats() {
  try {
    const products = await getProducts();
    const available = products.filter((p) => !p.soldOut).length;
    const soldOut = products.filter((p) => p.soldOut).length;

    document.getElementById("total-products").textContent = products.length;
    document.getElementById("available-products").textContent = available;
    document.getElementById("sold-out-products").textContent = soldOut;
  } catch (error) {
    console.error("Erro ao atualizar estatísticas:", error);
  }
}

// ========================================
// UTILITÁRIOS
// ========================================
function generateId() {
  return "prod_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 500000) {
      reject("Imagem muito grande! Escolha uma imagem menor que 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

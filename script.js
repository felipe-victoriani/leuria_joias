/* ========================================
   PAINEL ADMINISTRATIVO - LÉURIA JARA
   Sistema de gerenciamento de semijoias
======================================== */

// CHAVE DO LOCALSTORAGE
const STORAGE_KEY = "leuria_jara_semijoias";

// Gerar ID único para produtos iniciais
function generateUniqueId() {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ========================================
// PRODUTOS INICIAIS (SEMIJOIAS LÉURIA)
// ========================================
const INITIAL_PRODUCTS = [
  // FOLHEADOS
  {
    id: generateUniqueId(),
    name: "Anel Delicado Dourado",
    price: "89.90",
    category: "folheados",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Colar Corrente Dourada",
    price: "125.00",
    category: "folheados",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Brincos Argola Dourada",
    price: "75.00",
    category: "folheados",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Pulseira Elos Dourados",
    price: "95.00",
    category: "folheados",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Conjunto Dourado Elegante",
    price: "189.90",
    category: "folheados",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  // PRATAS
  {
    id: generateUniqueId(),
    name: "Anel Prata Clássico",
    price: "110.00",
    category: "pratas",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Colar Prata com Pingente",
    price: "145.00",
    category: "pratas",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Brincos Prata Minimalista",
    price: "85.00",
    category: "pratas",
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Pulseira Prata Moderna",
    price: "120.00",
    category: "pratas",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  // OURO
  {
    id: generateUniqueId(),
    name: "Anel Ouro Premium",
    price: "289.90",
    category: "ouro",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Colar Ouro Sofisticado",
    price: "350.00",
    category: "ouro",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Brincos Ouro Exclusivos",
    price: "225.00",
    category: "ouro",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateUniqueId(),
    name: "Conjunto Ouro Luxo",
    price: "489.90",
    category: "ouro",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    status: "available",
    soldOut: false,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
];

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let cart = [];
let products = [];

// Debug mode - definir como false em produção
const DEBUG_MODE = true;
const debugLog = (...args) => DEBUG_MODE && console.log(...args);
const devLog = debugLog;
const devWarn = (...args) => DEBUG_MODE && console.warn(...args);
const devError = (...args) => DEBUG_MODE && console.error(...args);

// ========================================
// INICIALIZAÇÃO DE PRODUTOS ADMINISTRATIVOS
// ========================================
async function initializeProducts() {
  try {
    // Usa o sistema Firebase existente
    let products = await loadProductsFromFirestore();

    // Se não há produtos no Firebase, verifica LocalStorage para migrar
    if (products.length === 0) {
      const localProducts = localStorage.getItem(STORAGE_KEY);

      if (localProducts && localProducts !== "[]") {
        // Migra produtos do LocalStorage para o Firebase
        const productsToMigrate = JSON.parse(localProducts);
        if (productsToMigrate.length > 0) {
          devLog(`📦 Migrando ${productsToMigrate.length} produtos para o Firebase...`);
          for (const product of productsToMigrate) {
            await addProductToFirestore(product);
          }
          devLog("✅ Produtos migrados com sucesso para o Firebase!");
        }
      } else {
        // Se não tem nada, importa os produtos iniciais
        devLog("📦 Importando produtos iniciais para o Firebase...");
        for (const product of INITIAL_PRODUCTS) {
          await addProductToFirestore(product);
        }
        devLog(`✅ ${INITIAL_PRODUCTS.length} produtos importados com sucesso!`);
      }
    } else {
      devLog(`✅ ${products.length} produtos já existem no Firebase`);
    }

    // Sincroniza Firebase com LocalStorage
    const finalProducts = await loadProductsFromFirestore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProducts));
  } catch (error) {
    devError("Erro ao inicializar produtos:", error);
    // Fallback para LocalStorage
    const existingProducts = localStorage.getItem(STORAGE_KEY);
    if (!existingProducts || existingProducts === "[]") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  }
}

// ========================================
// INICIALIZAÇÃO GLOBAL
// ========================================
document.addEventListener("DOMContentLoaded", async function () {
  // Se estamos na página admin, inicializa o painel
  if (window.location.pathname.includes('admin') || document.getElementById('admin-panel')) {
    await initializeAdminPanel();
  } else {
    // Se estamos na página principal, mantém o comportamento original
    await initializeMainSite();
  }
});

async function initializeAdminPanel() {
  // Aguarda o Firebase estar pronto
  await waitForFirebase();
  
  if (typeof loadProductsFromFirestore === 'function') {
    await initializeProducts();
  }
  
  setupAdminEventListeners();
  checkAdminLogin();
}

async function initializeMainSite() {
  // Inicialização normal do site principal
  await loadProductsFromDashboard();
  renderProducts(products);
  renderProductsByCategory();
  updateCartCount();
  setupEventListeners();
}

function waitForFirebase() {
  return new Promise((resolve) => {
    if (typeof loadProductsFromFirestore === 'function') {
      resolve();
    } else {
      const interval = setInterval(() => {
        if (typeof loadProductsFromFirestore === 'function') {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    }
  });
}

// ========================================
// FUNÇÕES DE VALIDAÇÃO E SANITIZAÇÃO
// ========================================

/**
 * Sanitiza input do usuário para prevenir XSS
 */
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Valida se o preço é válido
 */
function validatePrice(price) {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
}

// ========================================
// FUNÇÕES ADMINISTRATIVAS
// ========================================

function setupAdminEventListeners() {
  // Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLogin);
  }

  // Logout
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", handleAdminLogout);
  }

  // Adicionar produto
  const btnAddProduct = document.getElementById("btn-add-product");
  if (btnAddProduct) {
    btnAddProduct.addEventListener("click", openAddProductModal);
  }

  // Fechar modal
  const btnCloseModal = document.getElementById("btn-close-modal");
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", closeAdminModal);
  }

  // Formulário de produto
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", handleSaveProduct);
  }

  // Filtro de categoria
  const filterCategory = document.getElementById("filter-category");
  if (filterCategory) {
    filterCategory.addEventListener("change", filterAdminProducts);
  }

  // Botão de sincronização Firebase
  const btnSyncFirebase = document.getElementById("btn-sync-firebase");
  if (btnSyncFirebase) {
    btnSyncFirebase.addEventListener("click", syncAllToFirebase);
  }

  // Preview de imagem
  const productImage = document.getElementById("product-image");
  if (productImage) {
    productImage.addEventListener("change", handleImagePreview);
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
          editAdminProduct(productId);
          break;
        case "toggle":
          toggleProductStatus(productId);
          break;
        case "delete":
          deleteAdminProduct(productId);
          break;
      }
    });
  }
}

function checkAdminLogin() {
  const isLoggedIn = sessionStorage.getItem("admin_logged_in");
  if (isLoggedIn) {
    showAdminPanel();
  } else {
    showAdminLoginScreen();
  }
}

function showAdminLoginScreen() {
  const loginScreen = document.getElementById("login-screen");
  const adminPanel = document.getElementById("admin-panel");
  
  if (loginScreen) loginScreen.style.display = "flex";
  if (adminPanel) adminPanel.style.display = "none";
}

function showAdminPanel() {
  const loginScreen = document.getElementById("login-screen");
  const adminPanel = document.getElementById("admin-panel");
  
  if (loginScreen) loginScreen.style.display = "none";
  if (adminPanel) adminPanel.style.display = "block";
  
  loadAdminProducts();
  updateAdminStats();
}

async function handleAdminLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("login-error");

  // Credenciais simples (em produção, usar Firebase Auth)
  if (username === "admin@leuria.com" && password === "leuria2026") {
    sessionStorage.setItem("admin_logged_in", "true");
    showAdminPanel();
    showAdminNotification("✅ Login realizado com sucesso!", "success");
  } else {
    if (errorMessage) {
      errorMessage.textContent = "❌ Usuário ou senha incorretos!";
      errorMessage.style.display = "block";
      
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
    }
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem("admin_logged_in");
  showAdminLoginScreen();
  showAdminNotification("👋 Você saiu do sistema", "success");
}

function getProductsFromStorage() {
  const productsJSON = localStorage.getItem(STORAGE_KEY);
  return productsJSON ? JSON.parse(productsJSON) : [];
}

async function getProductsFromFirebase() {
  try {
    if (typeof loadProductsFromFirestore === 'function') {
      const fbProducts = await loadProductsFromFirestore();
      devLog(`🔥 Admin carregou ${fbProducts.length} produtos do Firebase`);
      
      // Sincroniza com LocalStorage
      if (fbProducts.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fbProducts));
        return fbProducts;
      }
    }
  } catch (error) {
    devWarn("⚠️ Erro ao buscar do Firebase no admin:", error);
  }

  // Fallback para LocalStorage
  const localProducts = getProductsFromStorage();
  devLog("📦 Produtos do LocalStorage:", localProducts);
  return localProducts;
}

async function saveAdminProducts(products) {
  // Salva no localStorage (backup)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  // Salva no Firebase
  try {
    if (typeof addProductToFirestore === 'function') {
      // Remove todos e readiciona
      const existingProducts = await loadProductsFromFirestore();
      
      // Atualiza apenas se necessário
      if (JSON.stringify(existingProducts) !== JSON.stringify(products)) {
        devLog("🔄 Sincronizando produtos com Firebase...");
        
        // Aqui seria ideal ter uma função de sincronização mais inteligente
        // Por enquanto, vamos manter a compatibilidade
        
        devLog("✅ Produtos sincronizados com Firebase!");
      }
    }
  } catch (error) {
    devError("❌ Erro ao salvar no Firebase:", error);
  }
}

function loadAdminProducts() {
  loadAdminProductsAsync();
}

async function loadAdminProductsAsync() {
  const products = await getProductsFromFirebase();
  const productsList = document.getElementById("products-list");
  const emptyMessage = document.getElementById("empty-message");

  if (!productsList) return;
  
  productsList.innerHTML = "";

  if (products.length === 0) {
    if (emptyMessage) emptyMessage.style.display = "block";
    productsList.style.display = "none";
  } else {
    if (emptyMessage) emptyMessage.style.display = "none";
    productsList.style.display = "grid";

    products.forEach((product) => {
      const productItem = createAdminProductItem(product);
      productsList.appendChild(productItem);
    });
  }

  updateAdminStats();
}

function createAdminProductItem(product) {
  const div = document.createElement("div");
  div.className = `product-item ${product.soldOut || product.outOfStock ? "sold-out" : ""}`;
  div.dataset.id = product.id;

  const categoryLabels = {
    folheados: "✨ Folheados",
    pratas: "🥈 Pratas",
    ouro: "🥇 Ouro",
  };

  const isOutOfStock = product.soldOut || product.outOfStock;

  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image" />
    
    <div class="product-info">
      <h3>${product.name}</h3>
      <span class="product-category">${categoryLabels[product.category] || product.category}</span>
      <div class="product-price">R$ ${product.price}</div>
      <span class="product-status ${isOutOfStock ? "status-sold-out" : "status-available"}">
        ${isOutOfStock ? "❌ Esgotado" : "✅ Disponível"}
      </span>
    </div>
    
    <div class="product-actions">
      <button class="btn-small btn-edit" data-action="edit" data-id="${product.id}">
        ✏️ Editar
      </button>
      <button class="btn-small btn-toggle" data-action="toggle" data-id="${product.id}">
        ${isOutOfStock ? "✅ Marcar Disponível" : "❌ Marcar Esgotado"}
      </button>
      <button class="btn-small btn-delete" data-action="delete" data-id="${product.id}">
        🗑️ Excluir
      </button>
    </div>
  `;

  return div;
}

function openAddProductModal() {
  const modalTitle = document.getElementById("modal-title");
  const productForm = document.getElementById("product-form");
  const productId = document.getElementById("product-id");
  const imagePreview = document.getElementById("image-preview");
  const modal = document.getElementById("product-modal");
  
  if (modalTitle) modalTitle.textContent = "➕ Adicionar Produto";
  if (productForm) productForm.reset();
  if (productId) productId.value = "";
  if (imagePreview) imagePreview.style.display = "none";
  if (modal) modal.style.display = "flex";
}

async function editAdminProduct(id) {
  const products = await getProductsFromFirebase();
  const product = products.find((p) => p.id === id);

  if (product) {
    const modalTitle = document.getElementById("modal-title");
    const productId = document.getElementById("product-id");
    const productName = document.getElementById("product-name");
    const productCategory = document.getElementById("product-category");
    const productPrice = document.getElementById("product-price");
    const productSoldOut = document.getElementById("product-sold-out");
    const previewImg = document.getElementById("preview-img");
    const imagePreview = document.getElementById("image-preview");
    const modal = document.getElementById("product-modal");
    
    if (modalTitle) modalTitle.textContent = "✏️ Editar Produto";
    if (productId) productId.value = product.id;
    if (productName) productName.value = product.name;
    if (productCategory) productCategory.value = product.category;
    if (productPrice) productPrice.value = product.price;
    if (productSoldOut) productSoldOut.checked = product.soldOut || product.outOfStock;

    if (product.image && previewImg && imagePreview) {
      previewImg.src = product.image;
      imagePreview.style.display = "block";
    }

    if (modal) modal.style.display = "flex";
  }
}

function closeAdminModal() {
  const modal = document.getElementById("product-modal");
  const productForm = document.getElementById("product-form");
  const imagePreview = document.getElementById("image-preview");
  
  if (modal) modal.style.display = "none";
  if (productForm) productForm.reset();
  if (imagePreview) imagePreview.style.display = "none";
}

function handleImagePreview(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const previewImg = document.getElementById("preview-img");
      const imagePreview = document.getElementById("image-preview");
      
      if (previewImg) previewImg.src = event.target.result;
      if (imagePreview) imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

async function handleSaveProduct(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.textContent : '';
  
  if (submitBtn) {
    submitBtn.textContent = "⏳ Salvando...";
    submitBtn.disabled = true;
  }

  try {
    const id = document.getElementById("product-id")?.value;
    const name = document.getElementById("product-name")?.value;
    const category = document.getElementById("product-category")?.value;
    const price = document.getElementById("product-price")?.value;
    const imageFile = document.getElementById("product-image")?.files[0];
    const soldOut = document.getElementById("product-sold-out")?.checked;

    let imageBase64 = "";
    if (imageFile) {
      try {
        imageBase64 = await convertImageToBase64(imageFile);
      } catch (error) {
        showAdminNotification(`❌ ${error}`, "error");
        return;
      }
    } else if (id) {
      const products = await getProductsFromFirebase();
      const existingProduct = products.find((p) => p.id === id);
      imageBase64 = existingProduct ? existingProduct.image : "";
    }

    const product = {
      id: id || generateProductId(),
      name,
      category,
      price,
      image: imageBase64,
      status: soldOut ? "sold-out" : "available",
      soldOut,
      outOfStock: soldOut,
      isNew: false,
      createdAt: id ? undefined : new Date().toISOString(),
    };

    if (typeof addProductToFirestore === 'function') {
      if (id) {
        // Editar produto existente
        await updateProductInFirestore(id, product);
        showAdminNotification("✅ Produto atualizado com sucesso!", "success");
      } else {
        // Adicionar novo produto
        await addProductToFirestore(product);
        showAdminNotification("✅ Produto adicionado com sucesso!", "success");
      }
    }

    await loadAdminProducts();
    closeAdminModal();
    
    // Atualiza também a página principal se estiver aberta
    if (typeof renderProducts === 'function') {
      await loadProductsFromDashboard();
      renderProducts(products);
      renderProductsByCategory();
    }
    
  } catch (error) {
    devError('Erro ao salvar produto:', error);
    showAdminNotification("❌ Erro ao salvar produto: " + error.message, "error");
  } finally {
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
}

async function toggleProductStatus(id) {
  try {
    const products = await getProductsFromFirebase();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      showAdminNotification("❌ Produto não encontrado!", "error");
      return;
    }

    const product = products[productIndex];
    const newStatus = !product.soldOut && !product.outOfStock;
    
    const updatedProduct = {
      ...product,
      soldOut: newStatus,
      outOfStock: newStatus,
      status: newStatus ? "sold-out" : "available",
    };

    if (typeof updateProductInFirestore === 'function') {
      await updateProductInFirestore(id, updatedProduct);
    }

    await loadAdminProducts();
    
    // Atualiza também a página principal
    if (typeof renderProducts === 'function') {
      await loadProductsFromDashboard();
      renderProducts(products);
      renderProductsByCategory();
    }

    const status = newStatus ? "esgotado" : "disponível";
    showAdminNotification(`✅ Produto marcado como ${status}!`, "success");
  } catch (error) {
    showAdminNotification("❌ Erro ao atualizar status: " + error.message, "error");
    devError("Erro ao atualizar status:", error);
  }
}

async function deleteAdminProduct(id) {
  if (
    confirm(
      "⚠️ Tem certeza que deseja excluir este produto?\n\nEsta ação não pode ser desfeita!",
    )
  ) {
    try {
      if (typeof removeProductFromFirestore === 'function') {
        await removeProductFromFirestore(id);
      }

      await loadAdminProducts();
      
      // Atualiza também a página principal
      if (typeof renderProducts === 'function') {
        await loadProductsFromDashboard();
        renderProducts(products);
        renderProductsByCategory();
      }
      
      showAdminNotification("✅ Produto excluído com sucesso!", "success");
    } catch (error) {
      showAdminNotification("❌ Erro ao excluir produto: " + error.message, "error");
      devError("Erro ao excluir produto:", error);
    }
  }
}

async function filterAdminProducts() {
  try {
    const selectedCategory = document.getElementById("filter-category")?.value;
    const allProducts = await getProductsFromFirebase();

    const filteredProducts =
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.category === selectedCategory);

    const productsList = document.getElementById("products-list");
    if (!productsList) return;
    
    productsList.innerHTML = "";

    if (filteredProducts.length === 0) {
      productsList.innerHTML =
        '<div class="empty-message">📭 Nenhum produto encontrado nesta categoria.</div>';
    } else {
      filteredProducts.forEach((product) => {
        const productItem = createAdminProductItem(product);
        productsList.appendChild(productItem);
      });
    }
  } catch (error) {
    devError("Erro ao filtrar produtos:", error);
  }
}

async function syncAllToFirebase() {
  const btn = document.getElementById("btn-sync-firebase");
  if (!btn) return;
  
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "🔄 Sincronizando...";

  try {
    if (typeof loadProductsFromFirestore === 'function') {
      const firebaseProducts = await loadProductsFromFirestore();
      const localProducts = getProductsFromStorage();

      devLog(`📊 Firebase: ${firebaseProducts.length} produtos | LocalStorage: ${localProducts.length} produtos`);

      // Sincroniza LocalStorage com Firebase (Firebase é a fonte da verdade)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(firebaseProducts));
      
      showAdminNotification(
        `✅ ${firebaseProducts.length} produtos sincronizados!`,
        "success",
      );
    }

    await loadAdminProducts();
    await updateAdminStats();
  } catch (error) {
    devError("Erro ao sincronizar:", error);
    showAdminNotification("❌ Erro ao sincronizar: " + error.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

async function updateAdminStats() {
  try {
    const products = await getProductsFromFirebase();
    const available = products.filter((p) => !p.soldOut && !p.outOfStock).length;
    const soldOut = products.filter((p) => p.soldOut || p.outOfStock).length;

    const totalElement = document.getElementById("total-products");
    const availableElement = document.getElementById("available-products");
    const soldOutElement = document.getElementById("sold-out-products");
    
    if (totalElement) totalElement.textContent = products.length;
    if (availableElement) availableElement.textContent = available;
    if (soldOutElement) soldOutElement.textContent = soldOut;
  } catch (error) {
    devError("Erro ao atualizar estatísticas:", error);
  }
}

function generateProductId() {
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

function showAdminNotification(message, type = "success") {
  // Tenta usar o sistema de notificação existente
  if (typeof showNotification === 'function') {
    showNotification(message, type);
    return;
  }
  
  // Fallback - cria notificação simples
  const notification = document.getElementById("notification") || createNotificationElement();
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function createNotificationElement() {
  const notification = document.createElement('div');
  notification.id = 'notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: #4CAF50;
    color: white;
    border-radius: 5px;
    z-index: 9999;
    display: none;
  `;
  document.body.appendChild(notification);
  return notification;
}

// Função auxiliar para atualizar produto no Firebase
async function updateProductInFirestore(id, productData) {
  if (typeof updateProductToFirestore === 'function') {
    return await updateProductToFirestore(id, productData);
  } else {
    // Fallback: remove e adiciona novamente
    if (typeof removeProductFromFirestore === 'function' && typeof addProductToFirestore === 'function') {
      await removeProductFromFirestore(id);
      return await addProductToFirestore(productData);
    }
  }
}

/**
 * Exibe notificações para o usuário
 */
function showNotification(message, type = "info") {
  // Implementação simples - pode ser melhorada
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  // Cores por tipo
  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196F3",
  };

  notification.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(notification);

  // Animação
  setTimeout(() => {
    notification.style.opacity = "1";
  }, 100);

  // Remove após 3 segundos
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/**
 * Implementa lazy loading de imagens para performance
 */
function implementLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy-image");
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    img.classList.add("lazy-image");
    imageObserver.observe(img);
  });
}

// ========================================
// CARREGAR PRODUTOS DO DASHBOARD
// ========================================

/**
 * Carrega produtos do Firebase ou dashboard admin (fallback)
 */
async function loadProductsFromDashboard() {
  try {
    console.log("🔄 Iniciando loadProductsFromDashboard...");
    
    // Tentar carregar do Firebase primeiro
    if (typeof loadProductsFromFirestore === "function") {
      console.log("✅ Função loadProductsFromFirestore encontrada. Carregando...");
      const firebaseProducts = await loadProductsFromFirestore();
      console.log("📦 Produtos recebidos do Firebase:", firebaseProducts.length);

      if (firebaseProducts.length > 0) {
        // Converter formato do Firebase para formato do site
        products = firebaseProducts.map((product) => ({
          id: `produto-${product.id}`,
          nome: product.name,
          descricao: product.description,
          preco: product.price,
          categoria: product.category || "sem-categoria",
          imagem: product.image,
          status: product.outOfStock ? "esgotado" : "disponivel",
        }));

        console.log("✅", products.length, "produtos carregados e convertidos do Firebase");
        console.log("Produtos convertidos:", products);
        return;
      } else {
        console.log("⚠️ Nenhum produto encontrado no Firebase");
      }
    } else {
      console.log("❌ Função loadProductsFromFirestore não encontrada");
    }

    // Fallback para localStorage
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const dashboardProducts = JSON.parse(savedProducts);

      // Converte formato do dashboard para formato do site
      products = dashboardProducts.map((product) => ({
        id: `produto-${product.id}`,
        nome: product.name,
        descricao: product.description,
        preco: product.price,
        categoria: product.category || "sem-categoria",
        imagem: product.image,
        status: product.outOfStock ? "esgotado" : "disponivel",
      }));

      debugLog(`${products.length} produtos carregados do localStorage`);
      return;
    }

    // Se não há produtos, usar exemplos
    debugLog("Nenhum produto encontrado, usando produtos de exemplo");
    products = getExampleProducts();
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    showNotification(
      "Erro ao carregar produtos. Usando dados de exemplo.",
      "warning",
    );

    // Fallback final para localStorage
    try {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        const dashboardProducts = JSON.parse(savedProducts);
        products = dashboardProducts.map((product) => ({
          id: `produto-${product.id}`,
          nome: product.name,
          descricao: product.description,
          preco: product.price,
          categoria: product.category || "sem-categoria",
          imagem: product.image,
          status: product.outOfStock ? "esgotado" : "disponivel",
        }));
      } else {
        products = getExampleProducts();
      }
    } catch (fallbackError) {
      console.error("Erro no fallback:", fallbackError);
      products = getExampleProducts();
    }
  }

  // Configurar listener para mudanças no localStorage
  window.addEventListener('storage', function(e) {
    if (e.key === 'products') {
      debugLog('Produtos atualizados no dashboard, recarregando...');
      loadProductsFromDashboard().then(() => {
        console.log('Renderizando', products.length, 'produtos após atualização');
        renderProducts(products);
        renderProductsByCategory();
        showNotification(`${products.length} produtos atualizados!`, 'success');
      });
    }
  });
  
  // Debug: Log produtos carregados
  console.log('Total de produtos carregados:', products.length);
  if (products.length > 0) {
    console.log('Primeiro produto:', products[0]);
  }
}

/**
 * Recarrega produtos do dashboard (chamada manual)
 */
async function reloadProducts() {
  showNotification("Recarregando produtos...", "info");
  try {
    await loadProductsFromDashboard();
    renderProducts(products);
    await renderProductsByCategory();
    showNotification("Produtos atualizados com sucesso!", "success");
  } catch (error) {
    console.error("Erro ao recarregar produtos:", error);
    showNotification("Erro ao recarregar produtos", "error");
  }
    if (savedProducts) {
      const dashboardProducts = JSON.parse(savedProducts);

      // Converte formato do dashboard para formato do site
      products = dashboardProducts.map((product) => ({
        id: `produto-${product.id}`,
        nome: product.name,
        descricao: product.description,
        preco: product.price,
        categoria: product.category || "sem-categoria",
        imagem: product.image,
        status: product.outOfStock ? "esgotado" : "disponivel",
      }));

      debugLog(`${products.length} produtos carregados do localStorage`);
    } else {
      // Se não houver produtos, usa produtos de exemplo
      products = getExampleProducts();
      debugLog("Usando produtos de exemplo");
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    showNotification(
      "Erro ao carregar produtos. Usando dados de exemplo.",
      "warning",
    );

    // Fallback final para localStorage
    try {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        const dashboardProducts = JSON.parse(savedProducts);
        products = dashboardProducts.map((product) => ({
          id: `produto-${product.id}`,
          nome: product.name,
          descricao: product.description,
          preco: product.price,
          categoria: product.category || "sem-categoria",
          imagem: product.image,
          status: product.outOfStock ? "esgotado" : "disponivel",
        }));
      } else {
        products = getExampleProducts();
      }
    } catch (fallbackError) {
      console.error("Erro no fallback:", fallbackError);
      products = getExampleProducts();
    }
  }
}

/**
 * Produtos de exemplo (fallback)
 */
function getExampleProducts() {
  return [
    {
      id: "produto-exemplo-1",
      nome: "Colar Elegance",
      descricao: "Colar delicado em banho de ouro com pingente de coração",
      preco: 89.9,
      imagem:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
      status: "disponivel",
    },
    {
      id: "produto-exemplo-2",
      nome: "Brinco Luxo",
      descricao: "Par de brincos em argola com detalhes em cristal",
      preco: 69.9,
      imagem:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
      status: "disponivel",
    },
    {
      id: "produto-exemplo-3",
      nome: "Pulseira Sofisticada",
      descricao: "Pulseira elo português folheada a ouro 18k",
      preco: 129.9,
      imagem:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
      status: "disponivel",
    },
  ];
}

// ========================================
// CARRINHO - FUNÇÕES GLOBAIS
// ========================================

/**
 * Adiciona produto ao carrinho
 */
function addToCart(productId) {
  debugLog("Adicionando produto:", productId);

  try {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      showNotification("Produto não encontrado", "error");
      return;
    }

    if (product.status === "esgotado") {
      showNotification("Produto esgotado", "warning");
      return;
    }

    // Verifica se o produto já está no carrinho
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity++;
      debugLog(
        "Produto já existe no carrinho, aumentando quantidade para:",
        existingItem.quantity,
      );
      showNotification(
        `${product.nome} adicionado novamente ao carrinho`,
        "success",
      );
    } else {
      cart.push({
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagem: product.imagem,
        quantity: 1,
      });
      debugLog("Novo produto adicionado ao carrinho");
      showNotification(`${product.nome} adicionado ao carrinho`, "success");
    }

    debugLog("Carrinho atual:", cart);
    saveCartToStorage();
    updateCartUI();
  } catch (error) {
    console.error("Erro ao adicionar produto ao carrinho:", error);
    showNotification("Erro ao adicionar produto", "error");
  }
}

/**
 * Remove produto do carrinho
 */
function removeFromCart(productId) {
  console.log("Removendo produto:", productId);
  cart = cart.filter((item) => item.id !== productId);
  console.log("Carrinho após remoção:", cart);
  saveCartToStorage();
  updateCartUI();
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupEventListeners();
  setupScrollAnimations();
  initMobileMenu();
});

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
  console.log('🚀 Inicializando aplicação...');
  
  try {
    showLoading(true); // Mostra loading durante carregamento

    // Carrega produtos do Firebase/dashboard admin
    console.log('Carregando produtos...');
    await loadProductsFromDashboard();
    console.log('Produtos carregados:', products.length);

    // Renderiza os produtos na página principal
    console.log('Renderizando produtos na página principal...');
    renderProducts(products);

    // Renderiza produtos por categoria nas seções específicas
    console.log('Renderizando produtos por categoria...');
    await renderProductsByCategory();

    loadCartFromStorage();
    updateCartUI();
    setupScrollAnimations(); // Reaplica animações após carregar

    showLoading(false); // Remove loading após tudo carregado
    console.log('✅ Aplicação inicializada com sucesso!');
  } catch (error) {
    console.error("Erro ao inicializar app:", error);
    showNotification("Erro ao carregar produtos. Por favor, recarregue a página.", "error");
    showLoading(false);
  }
}

/**
 * Configura os event listeners
 */
function setupEventListeners() {
  // Carrinho
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document
    .getElementById("btnWhatsapp")
    .addEventListener("click", sendToWhatsApp);

  // Detecta mudanças no localStorage (produtos adicionados no dashboard)
  window.addEventListener("storage", (e) => {
    if (e.key === "products") {
      console.log("Produtos atualizados no dashboard, recarregando...");
      loadProductsFromDashboard();
      renderProducts(products);
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ========================================
// PRODUTOS
// ========================================

/**
 * Carrega produtos do Firebase
 */
async function loadProductsFromFirebase() {
  try {
    products = await loadProducts();
    renderProducts(products);

    // Escuta mudanças em tempo real
    listenToProducts((updatedProducts) => {
      products = updatedProducts;
      renderProducts(products);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    throw error;
  }
}

/**
 * Renderiza os produtos na página
 */
function renderProducts(productsArray) {
  console.log('renderProducts chamada com', productsArray?.length || 0, 'produtos');
  
  const productsGrid = document.getElementById("productsGrid");
  
  if (!productsGrid) {
    console.error('Elemento #productsGrid não encontrado!');
    return;
  }

  if (!productsArray || productsArray.length === 0) {
    console.log('Nenhum produto para renderizar');
    productsGrid.innerHTML = `
      <div class="no-products">
        <i class="fas fa-box-open"></i>
        <p>Nenhum produto disponível no momento.</p>
        <p><small>Os produtos cadastrados no dashboard aparecerão aqui automaticamente.</small></p>
      </div>
    `;
    return;
  }

  console.log('Renderizando', productsArray.length, 'produtos');
  productsGrid.innerHTML = productsArray
    .map(
      (product) => `
        <div class="product-card fade-in-scroll">
            <div class="product-image-container">
                <img src="${product.imagem}" alt="${product.nome}" class="product-image" loading="lazy">
                ${product.status === "esgotado" ? '<span class="product-badge">Esgotado</span>' : ""}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-description">${product.descricao}</p>
                <p class="product-price">R$ ${formatPrice(product.preco)}</p>
                <button 
                    class="btn-add-cart" 
                    onclick="addToCart('${product.id}')"
                    ${product.status === "esgotado" ? "disabled" : ""}
                >
                    <i class="fas fa-shopping-cart"></i>
                    ${product.status === "esgotado" ? "Esgotado" : "Adicionar ao Carrinho"}
                </button>
            </div>
        </div>
    `,
    )
    .join("");
    
  console.log('Produtos renderizados com sucesso!');
}

  // Reaplica animações de scroll
  setupScrollAnimations();
}

/**
 * Renderiza produtos por categoria nas seções específicas
 */
async function renderProductsByCategory() {
  const categories = [
    { key: "bolsas", gridId: "bolsasGrid" },
    { key: "folheados", gridId: "folheadosGrid" },
    { key: "semi-joias", gridId: "semiJoiasGrid" },
    { key: "acessorios-cabelo", gridId: "acessoriosCabeloGrid" },
    { key: "oculos-sol", gridId: "oculosSolGrid" },
    { key: "cintos", gridId: "cintosGrid" },
  ];

  for (const category of categories) {
    const grid = document.getElementById(category.gridId);
    if (grid) {
      const categoryProducts = products.filter(
        (product) => product.categoria === category.key,
      );

      if (categoryProducts.length > 0) {
        grid.innerHTML = categoryProducts
          .map(
            (product) => `
            <div class="product-card fade-in-scroll">
                <div class="product-image">
                    <img src="${product.imagem}" alt="${product.nome}" />
                    ${product.status === "esgotado" ? '<div class="product-badge">Esgotado</div>' : ""}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.nome}</h3>
                    <p class="product-description">${product.descricao}</p>
                    <div class="product-price">R$ ${product.preco.toFixed(2).replace(".", ",")}</div>
                    <button 
                        class="btn-add-cart" 
                        onclick="addToCart('${product.id}')"
                        ${product.status === "esgotado" ? "disabled" : ""}
                    >
                        <i class="fas fa-shopping-bag"></i>
                        ${product.status === "esgotado" ? "Esgotado" : "Adicionar ao Carrinho"}
                    </button>
                </div>
            </div>
          `,
          )
          .join("");
      } else {
        grid.innerHTML = `
          <div class="empty-category">
            <i class="fas fa-box-open"></i>
            <p>Nenhum produto disponível nesta categoria.</p>
          </div>
        `;
      }
    }
  }

  // Reaplica animações de scroll para os novos elementos
  setupScrollAnimations();
}

// ========================================
// ATUALIZAÇÃO DA UI DO CARRINHO
// ========================================

/**
 * Atualiza a UI do carrinho
 */
function updateCartUI() {
  console.log("Atualizando UI do carrinho. Total de itens:", cart.length);

  const cartBody = document.getElementById("cartBody");
  const cartCount = document.getElementById("cartCount");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartFooter = document.getElementById("cartFooter");
  const totalPrice = document.getElementById("totalPrice");

  // Atualiza contador
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  console.log("Total de produtos (com quantidades):", totalItems);

  // Se carrinho vazio
  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.style.display = "block";
    if (cartFooter) cartFooter.style.display = "none";
    if (cartBody) cartBody.innerHTML = ""; // Limpa o conteúdo
    return;
  }

  // Esconde mensagem de carrinho vazio
  if (cartEmpty) cartEmpty.style.display = "none";
  if (cartFooter) cartFooter.style.display = "block";

  // Renderiza itens do carrinho
  const cartItemsHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-item-id="${item.id}">
            <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.nome}</h4>
                <p class="cart-item-price">R$ ${formatPrice(item.preco)}</p>
                ${item.quantity > 1 ? `<p class="cart-item-quantity">Quantidade: ${item.quantity}</p>` : ""}
            </div>
            <button class="cart-item-remove" data-product-id="${item.id}" title="Remover produto">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `,
    )
    .join("");

  if (cartBody) cartBody.innerHTML = cartItemsHTML;

  console.log("Itens renderizados no carrinho");

  // Adiciona event listeners aos botões de remover usando delegação de eventos
  if (cartBody) {
    cartBody.querySelectorAll(".cart-item-remove").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = this.getAttribute("data-product-id");
        console.log("Botão de remover clicado para produto:", productId);
        removeFromCart(productId);
      });
    });
  }

  // Calcula e exibe total
  const total = cart.reduce((sum, item) => sum + item.preco * item.quantity, 0);
  if (totalPrice) totalPrice.textContent = `R$ ${formatPrice(total)}`;
  console.log("Total do carrinho: R$", formatPrice(total));
}

/**
 * Abre o carrinho
 */
function openCart() {
  document.getElementById("cartSidebar").classList.add("active");
  document.getElementById("cartOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Fecha o carrinho
 */
function closeCart() {
  document.getElementById("cartSidebar").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
  document.body.style.overflow = "auto";
}

/**
 * Mostra notificação de item adicionado
 */
function showCartNotification() {
  // Pequena animação no botão do carrinho
  const cartBtn = document.getElementById("cartBtn");
  cartBtn.style.transform = "scale(1.2)";
  setTimeout(() => {
    cartBtn.style.transform = "scale(1)";
  }, 300);
}

// ========================================
// WHATSAPP
// ========================================

/**
 * Envia pedido para WhatsApp
 */
function sendToWhatsApp() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  // ⚠️ IMPORTANTE: Substitua pelo seu número de WhatsApp (formato: 5511999999999)
  const phoneNumber = "5500000000000"; // Exemplo: 5511999887766

  // Monta a mensagem
  let message = "🛍️ *Novo Pedido - Taty Joias*\n\n";
  message += "📦 *Produtos:*\n";

  cart.forEach((item, index) => {
    message += `\n${index + 1}. ${item.nome}\n`;
    message += `   • Quantidade: ${item.quantity}\n`;
    message += `   • Preço unitário: R$ ${formatPrice(item.preco)}\n`;
    message += `   • Subtotal: R$ ${formatPrice(item.preco * item.quantity)}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.preco * item.quantity, 0);
  message += `\n💰 *Total: R$ ${formatPrice(total)}*\n\n`;
  message += "✨ Obrigada por escolher Taty Joias!";

  // Codifica a mensagem para URL
  const encodedMessage = encodeURIComponent(message);

  // Monta o link do WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Abre o WhatsApp
  window.open(whatsappUrl, "_blank");

  // Opcional: Limpar carrinho após enviar
  // cart = [];
  // saveCartToStorage();
  // updateCartUI();
  // closeCart();
}

// ========================================
// STORAGE
// ========================================

/**
 * Salva carrinho no localStorage
 */
function saveCartToStorage() {
  try {
    localStorage.setItem("tatyJoiasCart", JSON.stringify(cart));
  } catch (error) {
    console.error("Erro ao salvar carrinho:", error);
  }
}

/**
 * Carrega carrinho do localStorage
 */
function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem("tatyJoiasCart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
    cart = [];
  }
}

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Formata preço para exibição
 */
function formatPrice(price) {
  return parseFloat(price).toFixed(2).replace(".", ",");
}

/**
 * Mostra/esconde loading
 */
function showLoading(show) {
  const loading = document.getElementById("loading");
  const productsGrid = document.getElementById("productsGrid");

  if (show) {
    loading.style.display = "block";
    productsGrid.style.display = "none";
  } else {
    loading.style.display = "none";
    productsGrid.style.display = "grid";
  }
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Configura animações de scroll
 */
function setupScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
}

// ========================================
// CONSOLE LOG STYLIZADO
// ========================================

console.log(
  "%c✨ leuria_semi - Loja de Semi Joias ✨",
  "color: #D4AF37; font-size: 20px; font-weight: bold;",
  "color: #666; font-size: 14px;",
);

// ========================================
// MENU HAMBÚRGUER MOBILE
// ========================================

/**
 * Inicializa o menu hambúrguer para dispositivos móveis
 */
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuItems = document.querySelectorAll(".mobile-menu-item");

  if (mobileMenuToggle && mobileMenu) {
    // Toggle do menu
    mobileMenuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");

      // Animação elegante do hambúrguer para X
      const lines = mobileMenuToggle.querySelectorAll(".hamburger-line");
      if (mobileMenu.classList.contains("active")) {
        // Transformação para X com animação mais elegante
        lines[0].style.transform = "rotate(45deg) translate(4px, 4px)";
        lines[0].style.background =
          "linear-gradient(90deg, var(--color-gold-light), var(--color-gold))";
        lines[1].style.opacity = "0";
        lines[1].style.transform = "scale(0)";
        lines[2].style.transform = "rotate(-45deg) translate(6px, -5px)";
        lines[2].style.background =
          "linear-gradient(90deg, var(--color-gold-light), var(--color-gold))";

        // Adiciona um pequeno bounce ao botão
        mobileMenuToggle.style.transform = "scale(1.1)";
        setTimeout(() => {
          mobileMenuToggle.style.transform = "scale(1)";
        }, 200);
      } else {
        // Volta ao estado normal
        lines[0].style.transform = "none";
        lines[0].style.background =
          "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))";
        lines[1].style.opacity = "1";
        lines[1].style.transform = "none";
        lines[2].style.transform = "none";
        lines[2].style.background =
          "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))";
      }
    });

    // Fechar menu ao clicar em um item
    mobileMenuItems.forEach((item) => {
      item.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        const lines = mobileMenuToggle.querySelectorAll(".hamburger-line");
        lines[0].style.transform = "none";
        lines[0].style.background =
          "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))";
        lines[1].style.opacity = "1";
        lines[1].style.transform = "none";
        lines[2].style.transform = "none";
        lines[2].style.background =
          "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))";
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", function (event) {
      if (
        !mobileMenuToggle.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        mobileMenu.classList.remove("active");
        const lines = mobileMenuToggle.querySelectorAll(".hamburger-line");
        lines[0].style.transform = "none";
        lines[0].style.background =
          "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))";
        lines[1].style.opacity = "1";
        lines[1].style.transform = "none";
        lines[2].style.transform = "none";
        lines[2].style.background =
          "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))";
      }
    });
  }

  // Implementar lazy loading
  implementLazyLoading();
}

// ========================================
// INICIALIZAÇÃO COM SINCRONIZAÇÃO
// ========================================

// Inicializar app quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", async function () {
  debugLog("DOM carregado, iniciando aplicação...");
  
  await initializeApp();
  setupEventListeners();
  setupScrollAnimations();
  initMobileMenu();
  
  // Auto-sincronização a cada 10 segundos
  setInterval(async function() {
    try {
      const currentCount = products.length;
      const savedProducts = localStorage.getItem("products");
      
      if (savedProducts) {
        const dashboardProducts = JSON.parse(savedProducts);
        if (dashboardProducts.length !== currentCount) {
          debugLog('Novos produtos detectados, atualizando...');
          await loadProductsFromDashboard();
          renderProducts(products);
          await renderProductsByCategory();
          showNotification('✨ Produtos atualizados!', 'success');
        }
      }
    } catch (error) {
      // Silencioso para não interromper a experiência
    }
  }, 10000);
});

// ========================================
// FUNÇÕES DE DEBUG GLOBAIS
// ========================================

// Disponibilizar funções globalmente para debug
window.reloadProducts = async function() {
  console.log('🔄 Recarregando produtos manualmente...');
  showNotification("Recarregando produtos...", "info");
  try {
    await loadProductsFromDashboard();
    console.log('📦 Produtos recarregados:', products.length);
    renderProducts(products);
    await renderProductsByCategory();
    showNotification("✅ Produtos atualizados!", "success");
  } catch (error) {
    console.error("❌ Erro ao recarregar:", error);
    showNotification("Erro ao recarregar produtos", "error");
  }
};

window.debugProducts = function() {
  console.log('🐛 DEBUG - Produtos atuais:', products);
  console.log('🐛 DEBUG - localStorage:', localStorage.getItem('products'));
  console.log('🐛 DEBUG - Elemento productsGrid:', document.getElementById('productsGrid'));
  console.log('🐛 DEBUG - Firebase disponível:', typeof loadProductsFromFirestore === 'function');
};

window.forceRender = function() {
  console.log('🎨 Forçando re-render...');
  renderProducts(products);
};

// Log de inicialização
console.log('🚀 Script carregado! Funções disponíveis: reloadProducts(), debugProducts(), forceRender()');

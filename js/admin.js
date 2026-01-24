/* ========================================
   PAINEL ADMINISTRATIVO - JAVASCRIPT
   Sistema de gerenciamento de produtos
======================================== */

// DEV_MODE, devLog, devWarn, devError são definidos em admin-security.js

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

    // Se não há produtos no Firebase, verifica LocalStorage para migrar
    if (products.length === 0) {
      const localProducts = localStorage.getItem(STORAGE_KEY);

      if (localProducts && localProducts !== "[]") {
        // Migra produtos do LocalStorage para o Firebase
        const productsToMigrate = JSON.parse(localProducts);
        if (productsToMigrate.length > 0) {
          devLog(
            `📦 Migrando ${productsToMigrate.length} produtos para o Firebase...`,
          );
          await FirebaseProductService.saveAll(productsToMigrate);
          devLog("✅ Produtos migrados com sucesso para o Firebase!");
        }
      } else {
        // Se não tem nada, importa os produtos iniciais
        devLog("📦 Importando produtos iniciais para o Firebase...");
        await FirebaseProductService.saveAll(INITIAL_PRODUCTS);
        devLog(
          `✅ ${INITIAL_PRODUCTS.length} produtos importados com sucesso!`,
        );
      }
    } else {
      devLog(`✅ ${products.length} produtos já existem no Firebase`);
    }

    // Sincroniza Firebase com LocalStorage
    const finalProducts = await FirebaseProductService.getAll();
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
// INICIALIZAÇÃO
// ========================================
document.addEventListener("DOMContentLoaded", async function () {
  // Inicializa Firebase primeiro
  const firebaseReady = initFirebase();

  if (firebaseReady) {
    devLog("✅ Firebase conectado!");
    await initializeProducts();
  } else {
    devWarn("⚠️ Firebase não configurado. Usando LocalStorage como fallback.");
    devLog(
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

  // Botão de sincronização Firebase
  const btnSyncFirebase = document.getElementById("btn-sync-firebase");
  if (btnSyncFirebase) {
    btnSyncFirebase.addEventListener("click", syncAllToFirebase);
  }

  // Botão de importar produtos iniciais
  const btnImportInitial = document.getElementById("btn-import-initial");
  if (btnImportInitial) {
    btnImportInitial.addEventListener("click", importInitialProducts);
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
  // Verificar se usuário já está autenticado no Firebase
  if (firebase.auth && firebase.auth().currentUser) {
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

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("login-error");
  const submitButton = e.target.querySelector('button[type="submit"]');

  // Desabilitar botão durante o login
  submitButton.disabled = true;
  submitButton.textContent = "Entrando...";

  try {
    // 🔥 LOGIN NO FIREBASE AUTH
    await firebase.auth().signInWithEmailAndPassword(username, password);

    // Login bem-sucedido
    sessionStorage.setItem("admin_logged_in", "true");
    showAdminPanel();
    showNotification("✅ Login realizado com sucesso!", "success");
  } catch (error) {
    // Erro no login
    let errorMsg = "❌ Usuário ou senha incorretos!";

    if (error.code === "auth/user-not-found") {
      errorMsg = "❌ Usuário não encontrado!";
    } else if (error.code === "auth/wrong-password") {
      errorMsg = "❌ Senha incorreta!";
    } else if (error.code === "auth/too-many-requests") {
      errorMsg = "🚫 Muitas tentativas! Aguarde alguns minutos.";
    } else if (error.code === "auth/invalid-email") {
      errorMsg = "❌ Email inválido!";
    }

    errorMessage.textContent = errorMsg;
    errorMessage.style.display = "block";

    devError("Erro no login:", error);

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
  } finally {
    // Reabilitar botão
    submitButton.disabled = false;
    submitButton.textContent = "Entrar";
  }
}

async function handleLogout() {
  try {
    await firebase.auth().signOut();
    sessionStorage.removeItem("admin_logged_in");
    showLoginScreen();
    showNotification("👋 Você saiu do sistema", "success");
  } catch (error) {
    devError("Erro ao fazer logout:", error);
    showNotification("❌ Erro ao sair do sistema", "error");
  }
}

// ========================================
// GERENCIAMENTO DE PRODUTOS
// ========================================
function getProducts() {
  const productsJSON = localStorage.getItem(STORAGE_KEY);
  return productsJSON ? JSON.parse(productsJSON) : [];
}

async function getProductsFromFirebase() {
  // Tenta buscar do Firebase primeiro
  if (window.FirebaseProductService && window.firebaseInitialized) {
    try {
      const fbProducts = await window.FirebaseProductService.getAll();
      devLog(`🔥 Admin carregou ${fbProducts.length} produtos do Firebase`);
      devLog("📦 Produtos do Firebase:", fbProducts);

      // Sincroniza com LocalStorage
      if (fbProducts.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fbProducts));
        return fbProducts;
      }
    } catch (error) {
      devWarn("⚠️ Erro ao buscar do Firebase no admin:", error);
    }
  }

  // Fallback para LocalStorage
  const localProducts = getProducts();
  devLog("📦 Produtos do LocalStorage:", localProducts);
  return localProducts;
}

async function saveProducts(products) {
  // Salva no localStorage (backup)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  // Salva no Firebase
  if (window.FirebaseProductService && window.firebaseInitialized) {
    try {
      await window.FirebaseProductService.saveAll(products);
      devLog("✅ Produtos salvos no Firebase!");
    } catch (error) {
      devError("❌ Erro ao salvar no Firebase:", error);
    }
  }
}

function loadProducts() {
  // Chama a versão assíncrona
  loadProductsAsync();
}

async function loadProductsAsync() {
  const products = await getProductsFromFirebase();
  const productsList = document.getElementById("products-list");
  const emptyMessage = document.getElementById("empty-message");
  const btnImportInitial = document.getElementById("btn-import-initial");

  productsList.innerHTML = "";

  if (products.length === 0) {
    emptyMessage.style.display = "block";
    productsList.style.display = "none";
    // Mostra botão de importar exemplos quando não há produtos
    if (btnImportInitial) {
      btnImportInitial.style.display = "inline-block";
    }
  } else {
    emptyMessage.style.display = "none";
    productsList.style.display = "grid";
    // Esconde botão quando há produtos
    if (btnImportInitial) {
      btnImportInitial.style.display = "none";
    }

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

async function editProduct(id) {
  const products = await getProductsFromFirebase();
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
      const products = await getProductsFromFirebase();
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

    let products = await getProductsFromFirebase();

    if (id) {
      // Ao editar, preserva o firebaseKey e outros campos importantes
      products = products.map((p) =>
        p.id === id ? { ...p, ...product, firebaseKey: p.firebaseKey } : p,
      );
      showNotification("✅ Produto atualizado com sucesso!", "success");
    } else {
      products.push(product);
      showNotification("✅ Produto adicionado com sucesso!", "success");
    }

    await saveProducts(products);
    await loadProducts();
    closeModal();
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function toggleProductStatus(id) {
  try {
    let products = await getProductsFromFirebase();
    const product = products.find((p) => p.id === id);

    if (!product) {
      showNotification("❌ Produto não encontrado!", "error");
      return;
    }

    const updatedProduct = {
      ...product,
      soldOut: !product.soldOut,
      status: !product.soldOut ? "sold-out" : "available",
    };

    // Atualiza no array
    products = products.map((p) => (p.id === id ? updatedProduct : p));

    // Salva tudo no Firebase
    if (window.FirebaseProductService && window.firebaseInitialized) {
      const result = await window.FirebaseProductService.saveAll(products);
      if (!result.success) {
        throw new Error(result.error || "Erro ao salvar no Firebase");
      }
    }

    // Atualiza LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    await loadProducts();

    const status = updatedProduct.soldOut ? "esgotado" : "disponível";
    showNotification(`✅ Produto marcado como ${status}!`, "success");
  } catch (error) {
    showNotification("❌ Erro ao atualizar status: " + error.message, "error");
    devError("Erro ao atualizar status:", error);
  }
}

async function deleteProduct(id) {
  if (
    confirm(
      "⚠️ Tem certeza que deseja excluir este produto?\n\nEsta ação não pode ser desfeita!",
    )
  ) {
    try {
      let products = await getProductsFromFirebase();
      const product = products.find((p) => p.id === id);

      if (!product) {
        showNotification("❌ Produto não encontrado!", "error");
        return;
      }

      // Remove do array local
      products = products.filter((p) => p.id !== id);

      // Salva a nova lista no Firebase (sem o produto removido)
      if (window.FirebaseProductService && window.firebaseInitialized) {
        devLog(`🗑️ Salvando lista sem o produto ${id} no Firebase...`);
        const result = await window.FirebaseProductService.saveAll(products);
        if (!result.success) {
          throw new Error(result.error || "Erro ao salvar no Firebase");
        }
      }

      // Atualiza LocalStorage também
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      devLog(`🗑️ Produto removido do LocalStorage`);

      await loadProducts();
      showNotification("✅ Produto excluído com sucesso!", "success");
    } catch (error) {
      showNotification("❌ Erro ao excluir produto: " + error.message, "error");
      devError("Erro ao excluir produto:", error);
    }
  }
}

async function filterProducts() {
  try {
    const selectedCategory = document.getElementById("filter-category").value;
    const allProducts = await getProductsFromFirebase();

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
    devError("Erro ao filtrar produtos:", error);
  }
}

// ========================================
// SINCRONIZAÇÃO COM FIREBASE
// ========================================
async function syncAllToFirebase() {
  const btn = document.getElementById("btn-sync-firebase");
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = "🔄 Sincronizando...";

  try {
    if (!window.FirebaseProductService || !window.firebaseInitialized) {
      throw new Error("Firebase não está inicializado!");
    }

    // Busca todos os produtos atuais do Firebase
    const firebaseProducts = await window.FirebaseProductService.getAll();
    const localProducts = getProducts();

    devLog(
      `📊 Firebase: ${firebaseProducts.length} produtos | LocalStorage: ${localProducts.length} produtos`,
    );

    // Se há produtos no LocalStorage mas não no Firebase, faz upload
    if (localProducts.length > 0 && firebaseProducts.length === 0) {
      devLog("📤 Enviando produtos do LocalStorage para o Firebase...");
      await window.FirebaseProductService.saveAll(localProducts);
      showNotification(
        `✅ ${localProducts.length} produtos sincronizados com o Firebase!`,
        "success",
      );
    }
    // Se há produtos no Firebase, sincroniza com LocalStorage
    else if (firebaseProducts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(firebaseProducts));
      showNotification(
        `✅ ${firebaseProducts.length} produtos sincronizados do Firebase!`,
        "success",
      );
    }
    // Se ambos estão vazios, mantém vazio (produtos foram intencionalmente deletados)
    else {
      devLog("📭 Nenhum produto encontrado - mantendo catálogo vazio");
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      showNotification(
        "✅ Sincronização completa - catálogo está vazio",
        "success",
      );
    }

    await loadProducts();
    await updateStats();
  } catch (error) {
    devError("Erro ao sincronizar:", error);
    showNotification("❌ Erro ao sincronizar: " + error.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

// ========================================
// IMPORTAÇÃO DE PRODUTOS INICIAIS
// ========================================
async function importInitialProducts() {
  const btn = document.getElementById("btn-import-initial");
  const originalText = btn.textContent;

  if (
    !confirm("⚠️ Isso vai adicionar produtos de exemplo ao catálogo. Confirma?")
  ) {
    return;
  }

  btn.disabled = true;
  btn.textContent = "📦 Importando...";

  try {
    if (!window.FirebaseProductService || !window.firebaseInitialized) {
      throw new Error("Firebase não está inicializado!");
    }

    // Busca produtos atuais
    const currentProducts = await getProductsFromFirebase();

    // Adiciona produtos iniciais aos existentes
    const allProducts = [...currentProducts, ...INITIAL_PRODUCTS];

    // Salva no Firebase
    await window.FirebaseProductService.saveAll(allProducts);

    // Sincroniza LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));

    await loadProducts();
    await updateStats();

    showNotification(
      `✅ ${INITIAL_PRODUCTS.length} produtos de exemplo importados!`,
      "success",
    );
  } catch (error) {
    devError("Erro ao importar produtos:", error);
    showNotification("❌ Erro ao importar produtos: " + error.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

// ========================================
// ESTATÍSTICAS
// ========================================
async function updateStats() {
  try {
    const products = await getProductsFromFirebase();
    const available = products.filter((p) => !p.soldOut).length;
    const soldOut = products.filter((p) => p.soldOut).length;

    document.getElementById("total-products").textContent = products.length;
    document.getElementById("available-products").textContent = available;
    document.getElementById("sold-out-products").textContent = soldOut;
  } catch (error) {
    devError("Erro ao atualizar estatísticas:", error);
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

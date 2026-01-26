// ===== PAINEL ADMINISTRATIVO - LÉURIA =====

// Estado da aplicação admin
let adminState = {
  currentCategory: "bolsas",
  products: {
    bolsas: [],
    mochilas: [],
    carteiras: [],
    acessorios: [],
  },
  editingProduct: null,
  isLoading: false,
};

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticação
  if (!AdminSecurity.isAuthenticated()) {
    return; // O sistema de segurança já vai mostrar o login
  }

  console.log("👜 Painel administrativo da Léuria inicializando...");

  // Configurar eventos
  setupEventListeners();

  // Carregar dados iniciais
  loadInitialData();

  console.log("✅ Painel administrativo inicializado");
});

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
  // Tabs de categoria
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const category = e.target.dataset.category;
      if (category) {
        switchCategory(category);
      }
    });
  });

  // Adicionar produto
  const addProductBtn = document.getElementById("btn-add-product");
  if (addProductBtn) {
    addProductBtn.addEventListener("click", openAddProductModal);
  }

  // Modal de produto
  const closeModalBtn = document.getElementById("close-modal");
  const cancelBtn = document.getElementById("cancel-product");
  const productForm = document.getElementById("product-form");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeProductModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeProductModal);
  }

  if (productForm) {
    productForm.addEventListener("submit", handleProductSubmit);
  }

  // Modal de confirmação
  const cancelActionBtn = document.getElementById("cancel-action");
  const confirmActionBtn = document.getElementById("confirm-action");

  if (cancelActionBtn) {
    cancelActionBtn.addEventListener("click", closeConfirmModal);
  }

  if (confirmActionBtn) {
    confirmActionBtn.addEventListener("click", handleConfirmAction);
  }

  // Fechar modais clicando no overlay
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAllModals();
    }
  });
}

// ===== CARREGAR DADOS INICIAIS =====
function loadInitialData() {
  showLoading(true);

  // Carregar produtos de todas as categorias
  const categories = Object.keys(adminState.products);
  const loadPromises = categories.map((category) =>
    loadCategoryProducts(category),
  );

  Promise.all(loadPromises)
    .then(() => {
      updateProductStats();
      renderCurrentCategory();
      showToast("✅ Dados carregados com sucesso", "success");
    })
    .catch((error) => {
      console.error("❌ Erro ao carregar dados:", error);
      showToast("❌ Erro ao carregar dados", "error");
    })
    .finally(() => {
      showLoading(false);
    });
}

// ===== CARREGAR PRODUTOS DE CATEGORIA =====
function loadCategoryProducts(category) {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`products/${category}`)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          adminState.products[category] = Object.entries(data).map(
            ([key, value]) => ({
              id: key,
              ...value,
              category: category,
            }),
          );
        } else {
          adminState.products[category] = [];
        }
        console.log(
          `✅ ${adminState.products[category].length} produtos carregados para ${category}`,
        );
        resolve();
      })
      .catch((error) => {
        console.error(`❌ Erro ao carregar ${category}:`, error);
        adminState.products[category] = [];
        reject(error);
      });
  });
}

// ===== ATUALIZAR ESTATÍSTICAS =====
function updateProductStats() {
  const stats = {
    "bags-count": adminState.products.bolsas.length,
    "backpacks-count": adminState.products.mochilas.length,
    "wallets-count": adminState.products.carteiras.length,
    "accessories-count": adminState.products.acessorios.length,
  };

  Object.entries(stats).forEach(([id, count]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = count;
    }
  });
}

// ===== TROCAR CATEGORIA =====
function switchCategory(category) {
  if (category === adminState.currentCategory) return;

  adminState.currentCategory = category;

  // Atualizar tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.category === category) {
      btn.classList.add("active");
    }
  });

  // Atualizar título
  const titles = {
    bolsas: "👜 Gerenciar Bolsas",
    mochilas: "🎒 Gerenciar Mochilas",
    carteiras: "💳 Gerenciar Carteiras",
    acessorios: "✨ Gerenciar Acessórios",
  };

  const titleElement = document.getElementById("category-title");
  if (titleElement) {
    titleElement.textContent = titles[category] || "Gerenciar Produtos";
  }

  // Renderizar produtos
  renderCurrentCategory();
}

// ===== RENDERIZAR CATEGORIA ATUAL =====
function renderCurrentCategory() {
  const grid = document.getElementById("admin-products-grid");
  if (!grid) return;

  const products = adminState.products[adminState.currentCategory];

  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h3>Nenhum produto encontrado</h3>
        <p>Comece adicionando produtos para esta categoria</p>
        <button onclick="openAddProductModal()" class="btn-add-product">
          ➕ Adicionar Primeiro Produto
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
    <div class="admin-product-card">
      <img 
        src="${product.image || "../images/placeholder.jpg"}" 
        alt="${product.name}"
        class="admin-product-image"
        onerror="this.src='../images/placeholder.jpg'"
      />
      <div class="admin-product-info">
        <h3 class="admin-product-name">${product.name}</h3>
        <p class="admin-product-price">R$ ${parseFloat(product.price).toFixed(2).replace(".", ",")}</p>
        <span class="admin-product-category">${getCategoryIcon(product.category)} ${getCategoryName(product.category)}</span>
        <div class="admin-product-actions">
          <button class="btn-edit" onclick="editProduct('${product.id}')">
            ✏️ Editar
          </button>
          <button class="btn-delete" onclick="deleteProduct('${product.id}')">
            🗑️ Excluir
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ===== UTILITÁRIOS DE CATEGORIA =====
function getCategoryIcon(category) {
  const icons = {
    bolsas: "👜",
    mochilas: "🎒",
    carteiras: "💳",
    acessorios: "✨",
  };
  return icons[category] || "📦";
}

function getCategoryName(category) {
  const names = {
    bolsas: "Bolsas",
    mochilas: "Mochilas",
    carteiras: "Carteiras",
    acessorios: "Acessórios",
  };
  return names[category] || "Produto";
}

// ===== ABRIR MODAL DE PRODUTO =====
function openAddProductModal() {
  adminState.editingProduct = null;

  const modal = document.getElementById("product-modal");
  const form = document.getElementById("product-form");
  const title = document.getElementById("modal-title");

  if (title) {
    title.textContent = "➕ Adicionar Produto";
  }

  if (form) {
    form.reset();
    document.getElementById("product-category").value =
      adminState.currentCategory;
  }

  if (modal) {
    modal.style.display = "flex";
  }
}

// ===== EDITAR PRODUTO =====
function editProduct(productId) {
  const product = findProductById(productId);
  if (!product) {
    showToast("❌ Produto não encontrado", "error");
    return;
  }

  adminState.editingProduct = product;

  const modal = document.getElementById("product-modal");
  const title = document.getElementById("modal-title");

  if (title) {
    title.textContent = "✏️ Editar Produto";
  }

  // Preencher formulário
  document.getElementById("product-name").value = product.name || "";
  document.getElementById("product-price").value = product.price || "";
  document.getElementById("product-category").value = product.category || "";
  document.getElementById("product-description").value =
    product.description || "";
  document.getElementById("product-image").value = product.image || "";

  if (modal) {
    modal.style.display = "flex";
  }
}

// ===== EXCLUIR PRODUTO =====
function deleteProduct(productId) {
  const product = findProductById(productId);
  if (!product) {
    showToast("❌ Produto não encontrado", "error");
    return;
  }

  // Configurar modal de confirmação
  const confirmModal = document.getElementById("confirm-modal");
  const confirmMessage = document.getElementById("confirm-message");

  if (confirmMessage) {
    confirmMessage.textContent = `Tem certeza que deseja excluir "${product.name}"?`;
  }

  // Configurar ação de confirmação
  window.pendingAction = {
    type: "delete",
    productId: productId,
    category: product.category,
  };

  if (confirmModal) {
    confirmModal.style.display = "flex";
  }
}

// ===== SUBMETER FORMULÁRIO DE PRODUTO =====
function handleProductSubmit(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("product-name").value.trim(),
    price: parseFloat(document.getElementById("product-price").value),
    category: document.getElementById("product-category").value,
    description: document.getElementById("product-description").value.trim(),
    image: document.getElementById("product-image").value.trim(),
    available: true,
    featured: false,
    updatedAt: new Date().toISOString(),
  };

  // Validações
  if (!formData.name || !formData.price || !formData.category) {
    showToast("❌ Por favor, preencha todos os campos obrigatórios", "error");
    return;
  }

  if (formData.price <= 0) {
    showToast("❌ O preço deve ser maior que zero", "error");
    return;
  }

  showLoading(true);

  if (adminState.editingProduct) {
    // Editar produto existente
    updateProduct(adminState.editingProduct.id, formData);
  } else {
    // Criar novo produto
    createProduct(formData);
  }
}

// ===== CRIAR PRODUTO =====
function createProduct(productData) {
  const category = productData.category;
  const newProductRef = firebase.database().ref(`products/${category}`).push();

  newProductRef
    .set(productData)
    .then(() => {
      console.log("✅ Produto criado com sucesso");
      showToast("✅ Produto adicionado com sucesso!", "success");

      // Recarregar categoria
      loadCategoryProducts(category).then(() => {
        updateProductStats();
        renderCurrentCategory();
      });

      closeProductModal();
    })
    .catch((error) => {
      console.error("❌ Erro ao criar produto:", error);
      showToast("❌ Erro ao adicionar produto", "error");
    })
    .finally(() => {
      showLoading(false);
    });
}

// ===== ATUALIZAR PRODUTO =====
function updateProduct(productId, productData) {
  const category = productData.category;

  firebase
    .database()
    .ref(`products/${category}/${productId}`)
    .update(productData)
    .then(() => {
      console.log("✅ Produto atualizado com sucesso");
      showToast("✅ Produto atualizado com sucesso!", "success");

      // Recarregar categoria
      loadCategoryProducts(category).then(() => {
        updateProductStats();
        renderCurrentCategory();
      });

      closeProductModal();
    })
    .catch((error) => {
      console.error("❌ Erro ao atualizar produto:", error);
      showToast("❌ Erro ao atualizar produto", "error");
    })
    .finally(() => {
      showLoading(false);
    });
}

// ===== CONFIRMAR AÇÃO =====
function handleConfirmAction() {
  if (!window.pendingAction) return;

  const action = window.pendingAction;

  if (action.type === "delete") {
    showLoading(true);

    firebase
      .database()
      .ref(`products/${action.category}/${action.productId}`)
      .remove()
      .then(() => {
        console.log("✅ Produto excluído com sucesso");
        showToast("✅ Produto excluído com sucesso!", "success");

        // Recarregar categoria
        loadCategoryProducts(action.category).then(() => {
          updateProductStats();
          renderCurrentCategory();
        });
      })
      .catch((error) => {
        console.error("❌ Erro ao excluir produto:", error);
        showToast("❌ Erro ao excluir produto", "error");
      })
      .finally(() => {
        showLoading(false);
      });
  }

  closeConfirmModal();
  window.pendingAction = null;
}

// ===== FECHAR MODAIS =====
function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.style.display = "none";
  }
  adminState.editingProduct = null;
}

function closeConfirmModal() {
  const modal = document.getElementById("confirm-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

function closeAllModals() {
  closeProductModal();
  closeConfirmModal();
}

// ===== UTILITÁRIOS =====
function findProductById(productId) {
  for (const category in adminState.products) {
    const product = adminState.products[category].find(
      (p) => p.id === productId,
    );
    if (product) return product;
  }
  return null;
}

function showLoading(show) {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.style.display = show ? "flex" : "none";
  }
  adminState.isLoading = show;
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 5px;">${getToastIcon(type)} ${getToastTitle(type)}</div>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  // Remover após 5 segundos
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function getToastIcon(type) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };
  return icons[type] || "ℹ️";
}

function getToastTitle(type) {
  const titles = {
    success: "Sucesso",
    error: "Erro",
    warning: "Aviso",
    info: "Informação",
  };
  return titles[type] || "Informação";
}

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.openAddProductModal = openAddProductModal;

console.log("👜 Sistema administrativo da Léuria carregado");

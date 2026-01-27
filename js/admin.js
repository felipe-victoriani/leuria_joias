/* ========================================
   LEURIA - ADMIN SCRIPT
   Gerenciamento de Produtos (Admin)
   ======================================== */

// Elementos DOM
const productForm = document.getElementById("product-form");
const editForm = document.getElementById("edit-form");
const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");
const editModal = document.getElementById("edit-modal");

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  loadAdminProducts();
  setupEventListeners();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Adicionar produto
  productForm.addEventListener("submit", handleAddProduct);

  // Editar produto
  editForm.addEventListener("submit", handleEditProduct);
}

// ===== CARREGAR PRODUTOS =====
function loadAdminProducts() {
  db.collection("products")
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (querySnapshot) => {
        productList.innerHTML = "";

        if (querySnapshot.empty) {
          productList.innerHTML = `
          <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
            <p>Nenhum produto cadastrado ainda.</p>
          </div>
        `;
          productCount.textContent = "0 produtos";
          return;
        }

        let count = 0;
        querySnapshot.forEach((doc) => {
          const product = { id: doc.id, ...doc.data() };
          renderAdminProduct(product);
          count++;
        });

        productCount.textContent = `${count} produto${count !== 1 ? "s" : ""}`;
      },
      (error) => {
        console.error("Erro ao carregar produtos:", error);
        showNotification("Erro ao carregar produtos!", "error");
      },
    );
}

// ===== RENDERIZAR PRODUTO (ADMIN) =====
function renderAdminProduct(product) {
  const statusClass =
    product.status === "disponível" ? "disponivel" : "esgotado";

  const productItem = document.createElement("div");
  productItem.classList.add("product-item");
  productItem.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-item-image">
    <div class="product-item-info">
      <h4 class="product-item-name">${product.name}</h4>
      <p class="product-item-price">R$ ${formatPrice(product.price)}</p>
      <span class="product-item-status ${statusClass}">${product.status}</span>
    </div>
    <div class="product-item-actions">
      <button class="btn-edit" onclick="openEditModal('${product.id}', '${escapeHtml(product.name)}', '${escapeHtml(product.description || "")}', ${product.price}, '${product.image}', '${product.status}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Editar
      </button>
      <button class="btn-delete" onclick="confirmDelete('${product.id}', '${escapeHtml(product.name)}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
        Excluir
      </button>
    </div>
  `;

  productList.appendChild(productItem);
}

// ===== ADICIONAR PRODUTO =====
function handleAddProduct(e) {
  e.preventDefault();

  const name = document.getElementById("product-name").value.trim();
  const description = document
    .getElementById("product-description")
    .value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const image = document.getElementById("product-image").value.trim();
  const status = document.getElementById("product-status").value;

  // Validação
  if (!name || !image || isNaN(price) || price < 0) {
    showNotification("Preencha todos os campos corretamente!", "error");
    return;
  }

  // Adicionar ao Firestore
  db.collection("products")
    .add({
      name,
      description: description || "",
      price,
      image,
      status,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      showNotification("Produto adicionado com sucesso!", "success");
      productForm.reset();
    })
    .catch((error) => {
      console.error("Erro ao adicionar produto:", error);
      showNotification("Erro ao adicionar produto!", "error");
    });
}

// ===== ABRIR MODAL DE EDIÇÃO =====
function openEditModal(id, name, description, price, image, status) {
  document.getElementById("edit-product-id").value = id;
  document.getElementById("edit-product-name").value = name;
  document.getElementById("edit-product-description").value = description;
  document.getElementById("edit-product-price").value = price;
  document.getElementById("edit-product-image").value = image;
  document.getElementById("edit-product-status").value = status;

  editModal.classList.add("active");
}

// ===== FECHAR MODAL DE EDIÇÃO =====
function closeEditModal() {
  editModal.classList.remove("active");
  editForm.reset();
}

// ===== EDITAR PRODUTO =====
function handleEditProduct(e) {
  e.preventDefault();

  const id = document.getElementById("edit-product-id").value;
  const name = document.getElementById("edit-product-name").value.trim();
  const description = document
    .getElementById("edit-product-description")
    .value.trim();
  const price = parseFloat(document.getElementById("edit-product-price").value);
  const image = document.getElementById("edit-product-image").value.trim();
  const status = document.getElementById("edit-product-status").value;

  // Validação
  if (!name || !image || isNaN(price) || price < 0) {
    showNotification("Preencha todos os campos corretamente!", "error");
    return;
  }

  // Atualizar no Firestore
  db.collection("products")
    .doc(id)
    .update({
      name,
      description: description || "",
      price,
      image,
      status,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      showNotification("Produto atualizado com sucesso!", "success");
      closeEditModal();
    })
    .catch((error) => {
      console.error("Erro ao atualizar produto:", error);
      showNotification("Erro ao atualizar produto!", "error");
    });
}

// ===== CONFIRMAR EXCLUSÃO =====
function confirmDelete(id, name) {
  if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
    deleteProduct(id);
  }
}

// ===== EXCLUIR PRODUTO =====
function deleteProduct(id) {
  db.collection("products")
    .doc(id)
    .delete()
    .then(() => {
      showNotification("Produto excluído com sucesso!", "success");
    })
    .catch((error) => {
      console.error("Erro ao excluir produto:", error);
      showNotification("Erro ao excluir produto!", "error");
    });
}

// ===== FUNÇÕES UTILITÁRIAS =====
function formatPrice(price) {
  return price.toFixed(2).replace(".", ",");
}

function escapeHtml(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

function showNotification(message, type = "success") {
  const bgColor = type === "success" ? "#2d6a4f" : "#dc3545";

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideUp 0.3s ease;
    font-weight: 500;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideDown 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
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

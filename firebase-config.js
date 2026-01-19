/* ========================================
   CONFIGURAÇÃO DO FIREBASE
   
   ⚠️ IMPORTANTE: Siga os passos abaixo para configurar
======================================== */

/**
 * PASSO A PASSO PARA CONFIGURAR O FIREBASE:
 *
 * 1. Acesse: https://console.firebase.google.com
 * 2. Clique em "Adicionar projeto" ou "Create a project"
 * 3. Dê um nome (ex: "andreza-store")
 * 4. Desabilite o Google Analytics (não é necessário)
 * 5. Clique em "Criar projeto"
 *
 * 6. No menu lateral, clique em "Realtime Database"
 * 7. Clique em "Criar banco de dados"
 * 8. Escolha a localização: "United States (us-central1)"
 * 9. Modo de segurança: Escolha "Modo de teste" (por enquanto)
 * 10. Clique em "Ativar"
 *
 * 11. Vá em "Regras" e cole isto:
 *     {
 *       "rules": {
 *         "products": {
 *           ".read": true,
 *           ".write": "auth != null"
 *         }
 *       }
 *     }
 * 12. Clique em "Publicar"
 *
 * 13. Volte para "Visão geral do projeto" (ícone de engrenagem → Configurações do projeto)
 * 14. Role até "Seus apps" e clique no ícone "</>" (Web)
 * 15. Dê um apelido (ex: "andreza-web")
 * 16. NÃO marque "Firebase Hosting"
 * 17. Clique em "Registrar app"
 *
 * 18. COPIE as configurações que aparecerem e COLE ABAIXO substituindo os valores de exemplo
 */

// ⚠️ SUBSTITUA ESTAS CONFIGURAÇÕES PELAS SUAS DO FIREBASE
//Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmFDrG5ds2-GMpVGDR0spDfK_0-I51Tng",
  authDomain: "andreza-loja.firebaseapp.com",
  databaseURL: "https://andreza-loja-default-rtdb.firebaseio.com",
  projectId: "andreza-loja",
  storageBucket: "andreza-loja.firebasestorage.app",
  messagingSenderId: "922143079109",
  appId: "1:922143079109:web:f4fc642adaf14b538f8eac",
};

// ========================================
// INICIALIZAÇÃO DO FIREBASE
// ========================================

let database = null;
let firebaseInitialized = false;

/**
 * Inicializa o Firebase
 */
function initFirebase() {
  try {
    // Verifica se o Firebase está disponível
    if (typeof firebase === "undefined") {
      console.error(
        "❌ Firebase SDK não carregado. Verifique se os scripts estão no HTML.",
      );
      return false;
    }

    // Verifica se já foi inicializado
    if (firebaseInitialized) {
      return true;
    }

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    firebaseInitialized = true;
    window.firebaseInitialized = true; // Exporta globalmente

    console.log("✅ Firebase inicializado com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firebase:", error);
    return false;
  }
}

// ========================================
// SERVIÇO DE PRODUTOS (FIREBASE)
// ========================================

const FirebaseProductService = {
  /**
   * Obtém todos os produtos do Firebase
   */
  async getAll() {
    try {
      if (!firebaseInitialized) {
        console.warn("⚠️ Firebase não inicializado, usando fallback");
        return [];
      }

      const snapshot = await database.ref("products").once("value");
      const data = snapshot.val();

      if (!data) return [];

      // Converte objeto em array
      return Object.keys(data).map((key) => ({
        firebaseKey: key,
        ...data[key],
      }));
    } catch (error) {
      console.error("❌ Erro ao buscar produtos:", error);
      return [];
    }
  },

  /**
   * Obtém produtos disponíveis
   */
  async getAvailable() {
    const products = await this.getAll();
    return products.filter((p) => p.status === "available" && !p.soldOut);
  },

  /**
   * Obtém produtos por categoria
   */
  async getByCategory(category) {
    const products = await this.getAvailable();
    return products.filter((p) => p.category === category);
  },

  /**
   * Adiciona um novo produto
   */
  async add(product) {
    try {
      if (!firebaseInitialized) {
        throw new Error("Firebase não inicializado");
      }

      const newRef = database.ref("products").push();
      await newRef.set({
        ...product,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      console.log("✅ Produto adicionado com sucesso!");
      return { success: true, key: newRef.key };
    } catch (error) {
      console.error("❌ Erro ao adicionar produto:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Atualiza um produto existente
   */
  async update(firebaseKey, product) {
    try {
      if (!firebaseInitialized) {
        throw new Error("Firebase não inicializado");
      }

      await database.ref(`products/${firebaseKey}`).update({
        ...product,
        updatedAt: Date.now(),
      });

      console.log("✅ Produto atualizado com sucesso!");
      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao atualizar produto:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Remove um produto
   */
  async remove(firebaseKey) {
    try {
      if (!firebaseInitialized) {
        throw new Error("Firebase não inicializado");
      }

      await database.ref(`products/${firebaseKey}`).remove();

      console.log("✅ Produto removido com sucesso!");
      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao remover produto:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Salva múltiplos produtos de uma vez (para migração inicial)
   */
  async saveAll(products) {
    try {
      if (!firebaseInitialized) {
        throw new Error("Firebase não inicializado");
      }

      // Remove produtos antigos
      await database.ref("products").remove();

      // Adiciona novos produtos
      const updates = {};
      products.forEach((product) => {
        const newKey = database.ref().child("products").push().key;
        updates[`products/${newKey}`] = {
          ...product,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      });

      await database.ref().update(updates);

      console.log(`✅ ${products.length} produtos salvos com sucesso!`);
      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao salvar produtos:", error);
      return { success: false, error: error.message };
    }
  },
};

// ========================================
// MIGRAÇÃO DE LOCALSTORAGE PARA FIREBASE
// ========================================

/**
 * Migra produtos do LocalStorage para Firebase
 * (Execute apenas uma vez, depois pode remover)
 */
async function migrateFromLocalStorage() {
  try {
    const localProducts =
      JSON.parse(localStorage.getItem("outlet_makeup_products")) || [];

    if (localProducts.length === 0) {
      console.log("ℹ️ Nenhum produto no LocalStorage para migrar");
      return;
    }

    console.log(`🔄 Migrando ${localProducts.length} produtos...`);

    const result = await FirebaseProductService.saveAll(localProducts);

    if (result.success) {
      console.log("✅ Migração concluída!");
      console.log("💡 Você pode limpar o LocalStorage agora se quiser");
    }
  } catch (error) {
    console.error("❌ Erro na migração:", error);
  }
}

// Exporta para uso global
window.FirebaseProductService = FirebaseProductService;
window.initFirebase = initFirebase;
window.migrateFromLocalStorage = migrateFromLocalStorage;

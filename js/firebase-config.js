/* ========================================
   CONFIGURAÇÃO DO FIREBASE - OutLet MakeUp
======================================== */

// Firebase Configuration
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
// MODO DE DESENVOLVIMENTO
// ========================================

// Define se está em modo de desenvolvimento (console logs ativos)
const DEV_MODE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.search.includes("debug=true");

// Função de log condicional (só funciona em desenvolvimento)
const devLog = DEV_MODE ? console.log.bind(console) : () => {};
const devWarn = DEV_MODE ? console.warn.bind(console) : () => {};
const devError = console.error.bind(console); // Erros sempre aparecem

// ========================================
// INICIALIZAÇÃO DO FIREBASE
// ========================================

let database = null;
let firebaseInitialized = false;

/**
 * Inicializa o Firebase com App Check para segurança
 */
function initFirebase() {
  try {
    // Verifica se o Firebase está disponível
    if (typeof firebase === "undefined") {
      devError(
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

    // 🔒 SEGURANÇA: Firebase App Check (proteção contra abuso de API)
    // Descomente as linhas abaixo após configurar App Check no Console Firebase
    // Instruções em FIREBASE_SECURITY_GUIDE.md
    /*
    if (typeof firebase.appCheck !== 'undefined') {
      const appCheck = firebase.appCheck();
      appCheck.activate(
        'SITE_KEY_AQUI', // Substitua pela sua Site Key do reCAPTCHA v3
        true // Renovação automática de token
      );
      devLog("🔒 Firebase App Check ativado!");
    }
    */

    firebaseInitialized = true;
    window.firebaseInitialized = true; // Exporta globalmente

    devLog("✅ Firebase inicializado com sucesso!");
    return true;
  } catch (error) {
    devError("❌ Erro ao inicializar Firebase:", error);
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
        devWarn("⚠️ Firebase não inicializado, usando fallback");
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
      devError("❌ Erro ao buscar produtos:", error);
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

      devLog("✅ Produto adicionado com sucesso!");
      return { success: true, key: newRef.key };
    } catch (error) {
      devError("❌ Erro ao adicionar produto:", error);
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

      devLog("✅ Produto atualizado com sucesso!");
      return { success: true };
    } catch (error) {
      devError("❌ Erro ao atualizar produto:", error);
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

      devLog("✅ Produto removido com sucesso!");
      return { success: true };
    } catch (error) {
      devError("❌ Erro ao remover produto:", error);
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

      devLog(`✅ ${products.length} produtos salvos com sucesso!`);
      return { success: true };
    } catch (error) {
      devError("❌ Erro ao salvar produtos:", error);
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
      devLog("ℹ️ Nenhum produto no LocalStorage para migrar");
      return;
    }

    devLog(`🔄 Migrando ${localProducts.length} produtos...`);

    const result = await FirebaseProductService.saveAll(localProducts);

    if (result.success) {
      devLog("✅ Migração concluída!");
      devLog("💡 Você pode limpar o LocalStorage agora se quiser");
    }
  } catch (error) {
    devError("❌ Erro na migração:", error);
  }
}

// Exporta para uso global
window.FirebaseProductService = FirebaseProductService;
window.initFirebase = initFirebase;
window.migrateFromLocalStorage = migrateFromLocalStorage;

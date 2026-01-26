// ===== CONFIGURAÇÃO DO FIREBASE =====
// Configurações do Firebase para a Léuria
const firebaseConfig = {
  // IMPORTANTE: Substitua estas configurações pelas do seu projeto Firebase
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop",
};

// Inicializar Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("🔥 Firebase inicializado com sucesso!");
  console.log("🏪 Léuria - Sistema conectado ao Firebase");
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase:", error);
}

// Configurações específicas da Léuria
const LEURIA_CONFIG = {
  // Informações da loja
  STORE_NAME: "Léuria",
  STORE_DESCRIPTION: "Bolsas e Acessórios Femininos",

  // Contato
  WHATSAPP_NUMBER: "5567996149130",
  STORE_LOCATION: "Campo Grande, MS",
  INSTAGRAM: "@leuria.bolsas",

  // Configurações do Firebase
  COLLECTIONS: {
    PRODUCTS: "products",
    ORDERS: "orders",
    USERS: "users",
    SETTINGS: "settings",
  },

  // Categorias de produtos
  CATEGORIES: {
    BOLSAS: "bolsas",
    ACESSORIOS: "acessorios",
  },

  // Configurações de cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos

  // Configurações de imagem
  PLACEHOLDER_IMAGE: "images/placeholder.jpg",
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB

  // Configurações de carrinho
  MAX_CART_ITEMS: 50,
  CURRENCY: "BRL",
  CURRENCY_SYMBOL: "R$",
};

// Função para verificar conexão com Firebase
function checkFirebaseConnection() {
  return new Promise((resolve, reject) => {
    const testRef = firebase.database().ref(".info/connected");

    testRef.on("value", function (snapshot) {
      if (snapshot.val() === true) {
        console.log("✅ Conectado ao Firebase");
        resolve(true);
      } else {
        console.log("⚠️ Desconectado do Firebase");
        resolve(false);
      }
    });

    // Timeout após 10 segundos
    setTimeout(() => {
      console.log("⏰ Timeout na verificação de conexão");
      reject(new Error("Timeout na conexão com Firebase"));
    }, 10000);
  });
}

// Função para criar estrutura inicial no Firebase
function initializeFirebaseStructure() {
  console.log("🏗️ Inicializando estrutura do Firebase...");

  // Produtos de exemplo para a Léuria
  const sampleProducts = {
    bolsas: {
      bolsa_001: {
        name: "Bolsa Clássica Elegante",
        price: 89.9,
        description:
          "Bolsa feminina clássica em couro sintético de alta qualidade. Perfeita para o dia a dia.",
        image:
          "https://via.placeholder.com/400x400/c4a77d/ffffff?text=Bolsa+Classica",
        category: "bolsas",
        available: true,
        featured: true,
      },
      bolsa_002: {
        name: "Bolsa Transversal Moderna",
        price: 65.9,
        description:
          "Bolsa transversal compacta e moderna. Ideal para quem busca praticidade e estilo.",
        image:
          "https://via.placeholder.com/400x400/d4af8c/ffffff?text=Bolsa+Transversal",
        category: "bolsas",
        available: true,
        featured: false,
      },
      bolsa_003: {
        name: "Bolsa de Ombro Premium",
        price: 129.9,
        description:
          "Bolsa de ombro premium com acabamentos em dourado. Sofisticação em cada detalhe.",
        image:
          "https://via.placeholder.com/400x400/8b4513/ffffff?text=Bolsa+Premium",
        category: "bolsas",
        available: true,
        featured: true,
      },
    },
    acessorios: {
      acessorio_001: {
        name: "Óculos de Sol Feminino",
        price: 89.9,
        description:
          "Óculos de sol feminino com proteção UV. Estilo e proteção em um só produto.",
        image:
          "https://via.placeholder.com/400x400/c4a77d/ffffff?text=Oculos+Sol",
        category: "acessorios",
        available: true,
        featured: true,
      },
      acessorio_002: {
        name: "Cinto Feminino Dourado",
        price: 39.9,
        description:
          "Cinto feminino com fivela dourada. Acessório perfeito para valorizar qualquer look.",
        image:
          "https://via.placeholder.com/400x400/d4af8c/ffffff?text=Cinto+Dourado",
        category: "acessorios",
        available: true,
        featured: false,
      },
      acessorio_003: {
        name: "Lenço Sedoso Estampado",
        price: 34.9,
        description:
          "Lenço em tecido sedoso com estampa exclusiva. Versatilidade e elegância.",
        image:
          "https://via.placeholder.com/400x400/8b4513/ffffff?text=Lenco+Sedoso",
        category: "acessorios",
        available: true,
        featured: true,
      },
    },
  };

  // Configurações da loja
  const storeSettings = {
    store_info: {
      name: LEURIA_CONFIG.STORE_NAME,
      description: LEURIA_CONFIG.STORE_DESCRIPTION,
      whatsapp: LEURIA_CONFIG.WHATSAPP_NUMBER,
      location: LEURIA_CONFIG.STORE_LOCATION,
      instagram: LEURIA_CONFIG.INSTAGRAM,
      email: "contato@leuria.com.br",
      operating_hours: {
        weekdays: "9h às 18h",
        saturday: "9h às 14h",
        sunday: "Fechado",
      },
    },
    banners: {
      hero_title: "Elegância que Acompanha Você",
      hero_subtitle:
        "Descubra bolsas e acessórios únicos que combinam estilo, qualidade e sofisticação para todas as ocasiões.",
      featured_text: "Peças selecionadas especialmente para você",
    },
    categories: [
      {
        id: "bolsas",
        name: "Bolsas",
        icon: "👜",
        description: "Bolsas femininas para todos os estilos",
      },
      {
        id: "acessorios",
        name: "Acessórios",
        icon: "✨",
        description: "Acessórios para completar seu look",
      },
    ],
  };

  return {
    products: sampleProducts,
    settings: storeSettings,
  };
}

// Função para popular Firebase com dados iniciais (usar apenas uma vez)
function populateFirebaseWithSampleData() {
  console.log("🌱 Populando Firebase com dados de exemplo...");

  const initialData = initializeFirebaseStructure();

  // Salvar produtos
  firebase
    .database()
    .ref("products")
    .set(initialData.products)
    .then(() => {
      console.log("✅ Produtos de exemplo criados com sucesso!");
    })
    .catch((error) => {
      console.error("❌ Erro ao criar produtos:", error);
    });

  // Salvar configurações
  firebase
    .database()
    .ref("settings")
    .set(initialData.settings)
    .then(() => {
      console.log("✅ Configurações da loja criadas com sucesso!");
    })
    .catch((error) => {
      console.error("❌ Erro ao criar configurações:", error);
    });
}

// Exportar configurações para uso em outros arquivos
window.LEURIA_CONFIG = LEURIA_CONFIG;

// Log de inicialização
console.log("🔧 Configuração Firebase carregada para a Léuria");
console.log("📋 Configurações:", LEURIA_CONFIG);

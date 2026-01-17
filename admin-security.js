/* ========================================
   SISTEMA DE SEGURANÇA DO ADMIN
   Proteção avançada com CAPTCHA e recuperação de senha
======================================== */

// ========================================
// CONFIGURAÇÕES DE SEGURANÇA
// ========================================
const SECURITY_CONFIG = {
  maxLoginAttempts: 3,
  lockoutDuration: 60000, // 60 segundos
  resetCodeExpiration: 10 * 60 * 1000, // 10 minutos
  emailjs: {
    serviceId: "SEU_SERVICE_ID", // Configurar em emailjs.com
    templateId: "SEU_TEMPLATE_ID",
    publicKey: "SUA_PUBLIC_KEY",
  },
};

// ========================================
// CREDENCIAIS E ARMAZENAMENTO
// ========================================
const STORAGE_KEYS = {
  credentials: "outlet_admin_credentials",
  loginAttempts: "outlet_login_attempts",
  lockoutUntil: "outlet_lockout_until",
  resetCode: "outlet_reset_code",
};

// Senha padrão (hash simples para demonstração - em produção use bcrypt/SHA-256)
function hashPassword(password) {
  // Hash simples (em produção, use uma biblioteca de hashing real)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Inicializar credenciais padrão
function initializeCredentials() {
  const stored = localStorage.getItem(STORAGE_KEYS.credentials);
  if (!stored) {
    const defaultCredentials = {
      username: "admin",
      passwordHash: hashPassword("admin123"),
      email: "", // Será solicitado na primeira recuperação
    };
    localStorage.setItem(
      STORAGE_KEYS.credentials,
      JSON.stringify(defaultCredentials),
    );
  }
}

// ========================================
// SISTEMA DE TENTATIVAS DE LOGIN
// ========================================
function getLoginAttempts() {
  const attempts = localStorage.getItem(STORAGE_KEYS.loginAttempts);
  return attempts ? parseInt(attempts) : 0;
}

function incrementLoginAttempts() {
  const current = getLoginAttempts();
  localStorage.setItem(STORAGE_KEYS.loginAttempts, (current + 1).toString());
  return current + 1;
}

function resetLoginAttempts() {
  localStorage.removeItem(STORAGE_KEYS.loginAttempts);
}

function setLockout() {
  const lockoutUntil = Date.now() + SECURITY_CONFIG.lockoutDuration;
  localStorage.setItem(STORAGE_KEYS.lockoutUntil, lockoutUntil.toString());
}

function isLockedOut() {
  const lockoutUntil = localStorage.getItem(STORAGE_KEYS.lockoutUntil);
  if (!lockoutUntil) return false;

  if (Date.now() < parseInt(lockoutUntil)) {
    return true;
  }

  // Lockout expirado
  localStorage.removeItem(STORAGE_KEYS.lockoutUntil);
  resetLoginAttempts();
  return false;
}

function getRemainingLockoutTime() {
  const lockoutUntil = localStorage.getItem(STORAGE_KEYS.lockoutUntil);
  if (!lockoutUntil) return 0;

  const remaining = parseInt(lockoutUntil) - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000));
}

// ========================================
// VALIDAÇÃO DE LOGIN COM CAPTCHA
// ========================================
function validateLogin(username, password, captchaResponse) {
  // Verificar lockout
  if (isLockedOut()) {
    return {
      success: false,
      error: "locked",
      remainingTime: getRemainingLockoutTime(),
    };
  }

  // Verificar CAPTCHA (em desenvolvimento, aceita sem CAPTCHA)
  if (!captchaResponse && window.location.hostname !== "localhost") {
    return { success: false, error: "captcha", message: "Resolva o CAPTCHA!" };
  }

  // Buscar credenciais
  const credentials = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.credentials),
  );

  // Validar credenciais
  const passwordHash = hashPassword(password);
  if (
    username === credentials.username &&
    passwordHash === credentials.passwordHash
  ) {
    resetLoginAttempts();
    return { success: true };
  }

  // Login falhou
  const attempts = incrementLoginAttempts();

  if (attempts >= SECURITY_CONFIG.maxLoginAttempts) {
    setLockout();
    return {
      success: false,
      error: "locked",
      remainingTime: getRemainingLockoutTime(),
    };
  }

  return {
    success: false,
    error: "credentials",
    remainingAttempts: SECURITY_CONFIG.maxLoginAttempts - attempts,
  };
}

// ========================================
// SISTEMA DE RECUPERAÇÃO DE SENHA
// ========================================
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveResetCode(code, email) {
  const data = {
    code: code,
    email: email,
    expiresAt: Date.now() + SECURITY_CONFIG.resetCodeExpiration,
  };
  localStorage.setItem(STORAGE_KEYS.resetCode, JSON.stringify(data));
}

function verifyResetCode(code) {
  const stored = localStorage.getItem(STORAGE_KEYS.resetCode);
  if (!stored) return { valid: false, error: "no_code" };

  const data = JSON.parse(stored);

  // Verificar expiração
  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(STORAGE_KEYS.resetCode);
    return { valid: false, error: "expired" };
  }

  // Verificar código
  if (code === data.code) {
    return { valid: true };
  }

  return { valid: false, error: "invalid" };
}

function updatePassword(newPassword) {
  const credentials = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.credentials),
  );
  credentials.passwordHash = hashPassword(newPassword);
  localStorage.setItem(STORAGE_KEYS.credentials, JSON.stringify(credentials));
  localStorage.removeItem(STORAGE_KEYS.resetCode);
}

function updateEmail(email) {
  const credentials = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.credentials),
  );
  credentials.email = email;
  localStorage.setItem(STORAGE_KEYS.credentials, JSON.stringify(credentials));
}

function getStoredEmail() {
  const credentials = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.credentials),
  );
  return credentials.email;
}

// ========================================
// ENVIO DE EMAIL (EmailJS)
// ========================================
async function sendResetEmail(email, code) {
  // Verificar se EmailJS está configurado
  const config = SECURITY_CONFIG.emailjs;

  if (
    config.serviceId === "SEU_SERVICE_ID" ||
    !config.publicKey ||
    typeof emailjs === "undefined"
  ) {
    // Modo desenvolvimento: mostrar código no console
    console.log("=".repeat(50));
    console.log("🔐 CÓDIGO DE RECUPERAÇÃO (MODO DESENVOLVIMENTO)");
    console.log(`Email: ${email}`);
    console.log(`Código: ${code}`);
    console.log(`Válido por: 10 minutos`);
    console.log("=".repeat(50));

    // Simular sucesso
    return { success: true, devMode: true };
  }

  try {
    // Inicializar EmailJS
    emailjs.init(config.publicKey);

    // Enviar email
    const response = await emailjs.send(config.serviceId, config.templateId, {
      to_email: email,
      reset_code: code,
      user_name: "Administrador",
      expiration_time: "10 minutos",
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { success: false, error: error.text };
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================
initializeCredentials();

console.log("✅ Sistema de segurança carregado!");

// ===== SEGURANÇA DO PAINEL ADMINISTRATIVO - LÉURIA =====

// Configurações de segurança
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 60000, // 60 segundos
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos

  // Credenciais de admin (em produção, use Firebase Auth)
  ADMIN_CREDENTIALS: {
    username: "admin",
    password: "leuria2026",
  },
};

// Estado de segurança
let securityState = {
  loginAttempts: 0,
  isLocked: false,
  lockoutTimer: null,
  sessionTimer: null,
  isAuthenticated: false,
};

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔐 Sistema de segurança do admin inicializando...");

  // Verificar se já está autenticado
  checkExistingSession();

  // Configurar eventos de login
  setupLoginEvents();

  // Verificar estado de bloqueio
  checkLockoutState();

  console.log("✅ Sistema de segurança inicializado");
});

// ===== VERIFICAR SESSÃO EXISTENTE =====
function checkExistingSession() {
  const sessionData = localStorage.getItem("leuria-admin-session");

  if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      const now = Date.now();

      // Verificar se a sessão ainda é válida
      if (
        session.timestamp &&
        now - session.timestamp < SECURITY_CONFIG.SESSION_TIMEOUT
      ) {
        securityState.isAuthenticated = true;
        showAdminPanel();
        startSessionTimer();
        console.log("✅ Sessão válida encontrada");
        return;
      } else {
        // Sessão expirada
        clearSession();
        console.log("⚠️ Sessão expirada");
      }
    } catch (error) {
      console.error("❌ Erro ao verificar sessão:", error);
      clearSession();
    }
  }

  showLoginScreen();
}

// ===== CONFIGURAR EVENTOS DE LOGIN =====
function setupLoginEvents() {
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("btn-logout");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

// ===== VERIFICAR ESTADO DE BLOQUEIO =====
function checkLockoutState() {
  const lockoutData = localStorage.getItem("leuria-admin-lockout");

  if (lockoutData) {
    try {
      const lockout = JSON.parse(lockoutData);
      const now = Date.now();

      if (
        lockout.timestamp &&
        now - lockout.timestamp < SECURITY_CONFIG.LOCKOUT_DURATION
      ) {
        const remainingTime = Math.ceil(
          (SECURITY_CONFIG.LOCKOUT_DURATION - (now - lockout.timestamp)) / 1000,
        );
        showLockoutMessage(remainingTime);
        securityState.isLocked = true;

        // Timer para remover o bloqueio
        securityState.lockoutTimer = setTimeout(
          () => {
            clearLockout();
          },
          SECURITY_CONFIG.LOCKOUT_DURATION - (now - lockout.timestamp),
        );
      } else {
        clearLockout();
      }
    } catch (error) {
      console.error("❌ Erro ao verificar bloqueio:", error);
      clearLockout();
    }
  }
}

// ===== MANIPULAR LOGIN =====
function handleLogin(event) {
  event.preventDefault();

  // Verificar se está bloqueado
  if (securityState.isLocked) {
    showMessage("🚫 Sistema temporariamente bloqueado. Aguarde.", "error");
    return;
  }

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const recaptchaResponse = grecaptcha.getResponse();

  // Validações
  if (!username || !password) {
    showMessage("❌ Por favor, preencha todos os campos", "error");
    return;
  }

  if (!recaptchaResponse) {
    showMessage("❌ Por favor, complete o reCAPTCHA", "error");
    return;
  }

  // Verificar credenciais
  if (validateCredentials(username, password)) {
    handleSuccessfulLogin();
  } else {
    handleFailedLogin();
  }
}

// ===== VALIDAR CREDENCIAIS =====
function validateCredentials(username, password) {
  return (
    username === SECURITY_CONFIG.ADMIN_CREDENTIALS.username &&
    password === SECURITY_CONFIG.ADMIN_CREDENTIALS.password
  );
}

// ===== LOGIN BEM-SUCEDIDO =====
function handleSuccessfulLogin() {
  console.log("✅ Login bem-sucedido");

  // Resetar tentativas
  securityState.loginAttempts = 0;
  securityState.isAuthenticated = true;

  // Criar sessão
  createSession();

  // Mostrar painel
  showAdminPanel();

  // Iniciar timer de sessão
  startSessionTimer();

  // Feedback
  showMessage("✅ Login realizado com sucesso!", "success");

  // Log de segurança
  logSecurityEvent("LOGIN_SUCCESS", {
    timestamp: new Date().toISOString(),
    username: SECURITY_CONFIG.ADMIN_CREDENTIALS.username,
  });
}

// ===== LOGIN FALHADO =====
function handleFailedLogin() {
  securityState.loginAttempts++;

  console.log(
    `❌ Tentativa de login inválida (${securityState.loginAttempts}/${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS})`,
  );

  // Mostrar erro
  const remainingAttempts =
    SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - securityState.loginAttempts;
  showMessage(
    `❌ Credenciais incorretas. ${remainingAttempts} tentativas restantes.`,
    "error",
  );

  // Verificar se deve bloquear
  if (securityState.loginAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    activateLockout();
  }

  // Limpar formulário
  document.getElementById("password").value = "";
  grecaptcha.reset();

  // Log de segurança
  logSecurityEvent("LOGIN_FAILED", {
    timestamp: new Date().toISOString(),
    attempts: securityState.loginAttempts,
  });
}

// ===== ATIVAR BLOQUEIO =====
function activateLockout() {
  securityState.isLocked = true;
  securityState.loginAttempts = 0;

  // Salvar estado de bloqueio
  const lockoutData = {
    timestamp: Date.now(),
    reason: "MAX_ATTEMPTS_EXCEEDED",
  };

  localStorage.setItem("leuria-admin-lockout", JSON.stringify(lockoutData));

  // Mostrar mensagem de bloqueio
  showLockoutMessage(SECURITY_CONFIG.LOCKOUT_DURATION / 1000);

  // Timer para remover bloqueio
  securityState.lockoutTimer = setTimeout(() => {
    clearLockout();
  }, SECURITY_CONFIG.LOCKOUT_DURATION);

  console.log("🚫 Sistema bloqueado por excesso de tentativas");

  // Log de segurança
  logSecurityEvent("LOCKOUT_ACTIVATED", {
    timestamp: new Date().toISOString(),
    duration: SECURITY_CONFIG.LOCKOUT_DURATION,
  });
}

// ===== LIMPAR BLOQUEIO =====
function clearLockout() {
  securityState.isLocked = false;
  securityState.loginAttempts = 0;

  localStorage.removeItem("leuria-admin-lockout");

  if (securityState.lockoutTimer) {
    clearTimeout(securityState.lockoutTimer);
    securityState.lockoutTimer = null;
  }

  hideLockoutMessage();
  console.log("🔓 Bloqueio removido");
}

// ===== CRIAR SESSÃO =====
function createSession() {
  const sessionData = {
    timestamp: Date.now(),
    username: SECURITY_CONFIG.ADMIN_CREDENTIALS.username,
    id: generateSessionId(),
  };

  localStorage.setItem("leuria-admin-session", JSON.stringify(sessionData));
}

// ===== INICIAR TIMER DE SESSÃO =====
function startSessionTimer() {
  // Limpar timer existente
  if (securityState.sessionTimer) {
    clearTimeout(securityState.sessionTimer);
  }

  // Novo timer
  securityState.sessionTimer = setTimeout(() => {
    handleSessionTimeout();
  }, SECURITY_CONFIG.SESSION_TIMEOUT);
}

// ===== TIMEOUT DE SESSÃO =====
function handleSessionTimeout() {
  console.log("⏰ Sessão expirada");

  showMessage("⏰ Sessão expirada. Faça login novamente.", "warning");

  // Log de segurança
  logSecurityEvent("SESSION_TIMEOUT", {
    timestamp: new Date().toISOString(),
  });

  handleLogout();
}

// ===== LOGOUT =====
function handleLogout() {
  console.log("🚪 Fazendo logout...");

  // Log de segurança
  logSecurityEvent("LOGOUT", {
    timestamp: new Date().toISOString(),
  });

  // Limpar estado
  securityState.isAuthenticated = false;

  // Limpar timers
  if (securityState.sessionTimer) {
    clearTimeout(securityState.sessionTimer);
    securityState.sessionTimer = null;
  }

  // Limpar sessão
  clearSession();

  // Mostrar tela de login
  showLoginScreen();

  showMessage("✅ Logout realizado com sucesso", "success");
}

// ===== LIMPAR SESSÃO =====
function clearSession() {
  localStorage.removeItem("leuria-admin-session");
}

// ===== MOSTRAR TELAS =====
function showLoginScreen() {
  const loginScreen = document.getElementById("login-screen");
  const adminPanel = document.getElementById("admin-panel");

  if (loginScreen) loginScreen.style.display = "block";
  if (adminPanel) adminPanel.style.display = "none";
}

function showAdminPanel() {
  const loginScreen = document.getElementById("login-screen");
  const adminPanel = document.getElementById("admin-panel");

  if (loginScreen) loginScreen.style.display = "none";
  if (adminPanel) adminPanel.style.display = "block";
}

// ===== MENSAGENS =====
function showLockoutMessage(seconds) {
  const loginError = document.getElementById("login-error");
  const loginBlocked = document.getElementById("login-blocked");
  const countdown = document.getElementById("countdown");

  if (loginError) loginError.style.display = "none";
  if (loginBlocked) loginBlocked.style.display = "block";

  // Countdown
  let remainingSeconds = seconds;

  function updateCountdown() {
    if (countdown) {
      countdown.textContent = remainingSeconds;
    }

    remainingSeconds--;

    if (remainingSeconds >= 0) {
      setTimeout(updateCountdown, 1000);
    }
  }

  updateCountdown();
}

function hideLockoutMessage() {
  const loginBlocked = document.getElementById("login-blocked");
  if (loginBlocked) {
    loginBlocked.style.display = "none";
  }
}

// ===== UTILIDADES =====
function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function logSecurityEvent(event, data) {
  const logEntry = {
    event: event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  console.log(`🛡️ [SECURITY] ${event}:`, logEntry);

  // Em produção, enviar para sistema de logs
  // sendToSecurityLog(logEntry);
}

function showMessage(message, type = "info") {
  // Implementação simples de toast/alert
  console.log(`[${type.toUpperCase()}] ${message}`);

  // Você pode implementar um sistema de toast aqui
  if (type === "error") {
    alert(message);
  }
}

// ===== VERIFICAR AUTENTICAÇÃO (para outros scripts) =====
function isAuthenticated() {
  return securityState.isAuthenticated;
}

// ===== MIDDLEWARE DE PROTEÇÃO =====
function requireAuth() {
  if (!isAuthenticated()) {
    showLoginScreen();
    throw new Error("Acesso não autorizado");
  }
}

// ===== EXPORTAR FUNÇÕES =====
window.AdminSecurity = {
  isAuthenticated,
  requireAuth,
  handleLogout,
  clearSession,
};

console.log("🔐 Módulo de segurança carregado - Léuria Admin");

/* ========================================
   LÓGICA DE RECUPERAÇÃO DE SENHA
   Sistema completo de recuperação por email
======================================== */

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let userEmail = "";
let generatedCode = "";

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔑 Sistema de recuperação de senha carregado!");
  setupEventListeners();
});

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
  // Formulário de solicitação de código
  const requestForm = document.getElementById("request-code-form");
  if (requestForm) {
    requestForm.addEventListener("submit", handleRequestCode);
  }

  // Formulário de redefinição de senha
  const resetForm = document.getElementById("reset-password-form");
  if (resetForm) {
    resetForm.addEventListener("submit", handleResetPassword);
  }

  // Botão de reenviar código
  const resendBtn = document.getElementById("resend-code");
  if (resendBtn) {
    resendBtn.addEventListener("click", handleResendCode);
  }

  // Verificar força da senha em tempo real
  const newPasswordInput = document.getElementById("new-password");
  if (newPasswordInput) {
    newPasswordInput.addEventListener("input", checkPasswordStrength);
  }

  // Validar código em tempo real (apenas números)
  const codeInput = document.getElementById("code");
  if (codeInput) {
    codeInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
  }
}

// ========================================
// PASSO 1: SOLICITAR CÓDIGO
// ========================================
async function handleRequestCode(e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const errorMsg = document.getElementById("email-error");
  const successMsg = document.getElementById("email-success");

  // Desabilitar botão durante processamento
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ Enviando...";

  // Limpar mensagens anteriores
  errorMsg.style.display = "none";
  successMsg.style.display = "none";

  // Verificar se o email está cadastrado
  const storedEmail = getStoredEmail();

  if (!storedEmail) {
    // Primeira vez - registrar email
    updateEmail(email);
    console.log("📧 Email registrado:", email);
  } else if (storedEmail !== email) {
    // Email não corresponde
    errorMsg.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "📨 Enviar Código";
    return;
  }

  // Gerar código de recuperação
  generatedCode = generateResetCode();
  userEmail = email;
  saveResetCode(generatedCode, email);

  console.log("🔐 Código de recuperação gerado");

  // Tentar enviar email
  const result = await sendResetEmail(email, generatedCode);

  if (result.success) {
    successMsg.style.display = "block";

    if (result.devMode) {
      // Modo desenvolvimento - mostrar código
      const devMode = document.getElementById("dev-mode");
      const devCode = document.getElementById("dev-code");

      devCode.textContent = generatedCode;
      devMode.style.display = "block";

      successMsg.innerHTML = `
        ✅ Modo Desenvolvimento Ativado!<br>
        <strong>Código: ${generatedCode}</strong><br>
        <small>Em produção, seria enviado por email</small>
      `;
    }

    // Ir para próxima etapa após 2 segundos
    setTimeout(() => {
      goToStep2();
    }, 2000);
  } else {
    errorMsg.textContent = `❌ Erro ao enviar email: ${result.error || "Desconhecido"}`;
    errorMsg.style.display = "block";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "📨 Enviar Código";
}

// ========================================
// PASSO 2: REDEFINIR SENHA
// ========================================
async function handleResetPassword(e) {
  e.preventDefault();

  const codeInput = document.getElementById("code");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const errorMsg = document.getElementById("reset-error");
  const successMsg = document.getElementById("reset-success");

  const code = codeInput.value.trim();
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Limpar mensagens
  errorMsg.style.display = "none";
  successMsg.style.display = "none";

  // Validar senhas
  if (newPassword !== confirmPassword) {
    errorMsg.textContent = "❌ As senhas não coincidem!";
    errorMsg.style.display = "block";
    confirmPasswordInput.focus();
    return;
  }

  if (newPassword.length < 6) {
    errorMsg.textContent = "❌ A senha deve ter no mínimo 6 caracteres!";
    errorMsg.style.display = "block";
    newPasswordInput.focus();
    return;
  }

  // Desabilitar botão
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ Redefinindo...";

  // Verificar código
  const result = verifyResetCode(code);

  if (result.valid) {
    // Atualizar senha
    updatePassword(newPassword);

    // Mostrar sucesso
    successMsg.style.display = "block";
    errorMsg.style.display = "none";

    console.log("✅ Senha redefinida com sucesso!");

    // Redirecionar após 3 segundos
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 3000);
  } else {
    // Código inválido
    const messages = {
      invalid: "❌ Código incorreto! Verifique e tente novamente.",
      expired: "❌ Código expirado! Solicite um novo código.",
      no_code: "❌ Nenhum código encontrado. Solicite um novo código.",
    };

    errorMsg.textContent = messages[result.error] || "❌ Erro desconhecido!";
    errorMsg.style.display = "block";
    codeInput.focus();

    submitBtn.disabled = false;
    submitBtn.textContent = "🔐 Redefinir Senha";
  }
}

// ========================================
// REENVIAR CÓDIGO
// ========================================
async function handleResendCode() {
  const resendBtn = document.getElementById("resend-code");
  const originalText = resendBtn.textContent;

  resendBtn.disabled = true;
  resendBtn.textContent = "⏳ Reenviando...";

  // Gerar novo código
  generatedCode = generateResetCode();
  saveResetCode(generatedCode, userEmail);

  // Enviar email
  const result = await sendResetEmail(userEmail, generatedCode);

  if (result.success) {
    showTemporaryMessage("✅ Código reenviado com sucesso!", "success");

    if (result.devMode) {
      const devCode = document.getElementById("dev-code");
      devCode.textContent = generatedCode;
      console.log("🔐 Novo código:", generatedCode);
    }
  } else {
    showTemporaryMessage("❌ Erro ao reenviar código", "error");
  }

  resendBtn.disabled = false;
  resendBtn.textContent = originalText;
}

// ========================================
// NAVEGAÇÃO ENTRE ETAPAS
// ========================================
function goToStep2() {
  document.getElementById("step-1").classList.remove("active");
  document.getElementById("step-2").classList.add("active");

  // Atualizar display de email
  document.getElementById("email-display").textContent = userEmail;

  // Focar no campo de código
  document.getElementById("code").focus();
}

// ========================================
// VERIFICAR FORÇA DA SENHA
// ========================================
function checkPasswordStrength(e) {
  const password = e.target.value;
  const strengthBar = document.getElementById("password-strength");

  if (!password) {
    strengthBar.className = "password-strength";
    return;
  }

  let strength = 0;

  // Critérios de força
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  // Aplicar classe
  if (strength <= 2) {
    strengthBar.className = "password-strength weak";
  } else if (strength <= 4) {
    strengthBar.className = "password-strength medium";
  } else {
    strengthBar.className = "password-strength strong";
  }
}

// ========================================
// UTILITÁRIOS
// ========================================
function showTemporaryMessage(message, type) {
  const container = document.querySelector(".step.active");
  const messageDiv = document.createElement("div");
  messageDiv.className =
    type === "success" ? "success-message" : "error-message";
  messageDiv.textContent = message;
  messageDiv.style.marginTop = "1rem";

  container.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// ========================================
// LOG DE INICIALIZAÇÃO
// ========================================
console.log("✅ Sistema de recuperação de senha pronto!");
console.log(
  "📧 Para envio real de emails, configure EmailJS em admin-security.js",
);

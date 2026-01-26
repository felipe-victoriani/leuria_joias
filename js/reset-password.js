// ===== RESET PASSWORD - LÉURIA =====

// Configurações do EmailJS
const EMAIL_CONFIG = {
  SERVICE_ID: "your_service_id", // Substituir pelo ID do serviço EmailJS
  TEMPLATE_ID: "your_template_id", // Substituir pelo ID do template EmailJS
  USER_ID: "your_user_id", // Substituir pelo User ID do EmailJS
};

// Estado da aplicação
let resetState = {
  isLoading: false,
  emailInitialized: false,
};

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔑 Sistema de reset de senha inicializando...");

  // Inicializar EmailJS
  initializeEmailJS();

  // Configurar eventos
  setupEventListeners();

  console.log("✅ Sistema de reset de senha inicializado");
});

// ===== INICIALIZAR EMAILJS =====
function initializeEmailJS() {
  try {
    // Inicializar EmailJS (substitua pela sua chave pública)
    emailjs.init("your_public_key");
    resetState.emailInitialized = true;
    console.log("✅ EmailJS inicializado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao inicializar EmailJS:", error);
    resetState.emailInitialized = false;
  }
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
  const resetForm = document.getElementById("reset-form");

  if (resetForm) {
    resetForm.addEventListener("submit", handleResetSubmit);
  }

  // Validação em tempo real
  const requesterName = document.getElementById("requester-name");
  const requesterEmail = document.getElementById("requester-email");
  const justification = document.getElementById("justification");

  if (requesterName) {
    requesterName.addEventListener("input", validateName);
  }

  if (requesterEmail) {
    requesterEmail.addEventListener("input", validateEmail);
  }

  if (justification) {
    justification.addEventListener("input", validateJustification);
  }
}

// ===== VALIDAÇÕES =====
function validateName(event) {
  const name = event.target.value.trim();
  const isValid = name.length >= 2;

  updateFieldValidation(
    event.target,
    isValid,
    "Nome deve ter pelo menos 2 caracteres",
  );
  return isValid;
}

function validateEmail(event) {
  const email = event.target.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  updateFieldValidation(event.target, isValid, "Digite um e-mail válido");
  return isValid;
}

function validateJustification(event) {
  const justification = event.target.value.trim();
  const isValid = justification.length >= 20;

  updateFieldValidation(
    event.target,
    isValid,
    "Justificativa deve ter pelo menos 20 caracteres",
  );
  return isValid;
}

function updateFieldValidation(field, isValid, errorMessage) {
  // Remove mensagens de erro existentes
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  // Atualiza estilo do campo
  if (isValid) {
    field.style.borderColor = "#4caf50";
  } else if (field.value.length > 0) {
    field.style.borderColor = "#ff6b6b";

    // Adiciona mensagem de erro
    const errorElement = document.createElement("div");
    errorElement.className = "field-error";
    errorElement.style.cssText = `
      color: #ff6b6b;
      font-size: 0.85rem;
      margin-top: 5px;
      font-weight: 500;
    `;
    errorElement.textContent = errorMessage;
    field.parentNode.appendChild(errorElement);
  } else {
    field.style.borderColor = "";
  }
}

// ===== MANIPULAR SUBMISSÃO DO FORMULÁRIO =====
function handleResetSubmit(event) {
  event.preventDefault();

  if (resetState.isLoading) return;

  // Coletar dados do formulário
  const formData = {
    adminEmail: document.getElementById("admin-email").value.trim(),
    requesterName: document.getElementById("requester-name").value.trim(),
    requesterEmail: document.getElementById("requester-email").value.trim(),
    justification: document.getElementById("justification").value.trim(),
  };

  // Validar dados
  if (!validateFormData(formData)) {
    return;
  }

  // Enviar solicitação
  sendResetRequest(formData);
}

// ===== VALIDAR DADOS DO FORMULÁRIO =====
function validateFormData(data) {
  const errors = [];

  // Validar nome
  if (!data.requesterName || data.requesterName.length < 2) {
    errors.push("Nome deve ter pelo menos 2 caracteres");
  }

  // Validar e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.requesterEmail || !emailRegex.test(data.requesterEmail)) {
    errors.push("E-mail inválido");
  }

  // Validar justificativa
  if (!data.justification || data.justification.length < 20) {
    errors.push("Justificativa deve ter pelo menos 20 caracteres");
  }

  // Mostrar erros se houver
  if (errors.length > 0) {
    showError(errors.join("\n"));
    return false;
  }

  return true;
}

// ===== ENVIAR SOLICITAÇÃO DE RESET =====
function sendResetRequest(data) {
  showLoading(true);

  // Preparar dados para o email
  const emailData = {
    to_email: data.adminEmail,
    from_name: data.requesterName,
    from_email: data.requesterEmail,
    subject: "Solicitação de Redefinição de Senha - Léuria Admin",
    message: `
      SOLICITAÇÃO DE REDEFINIÇÃO DE SENHA
      
      Nome do Solicitante: ${data.requesterName}
      E-mail do Solicitante: ${data.requesterEmail}
      Data da Solicitação: ${new Date().toLocaleString("pt-BR")}
      
      JUSTIFICATIVA:
      ${data.justification}
      
      ========================================
      
      Esta solicitação foi enviada automaticamente pelo sistema de segurança da Léuria.
      Por favor, entre em contato com o solicitante para verificar a identidade antes de proceder.
    `,
    reply_to: data.requesterEmail,
  };

  // Simular envio (substitua pela integração real com EmailJS)
  setTimeout(() => {
    // Em produção, use:
    // emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, emailData, EMAIL_CONFIG.USER_ID)

    const success = Math.random() > 0.1; // 90% de chance de sucesso para demo

    if (success) {
      handleResetSuccess();

      // Log da solicitação
      logResetRequest(data);
    } else {
      handleResetError("Erro no serviço de e-mail. Tente novamente.");
    }

    showLoading(false);
  }, 2000);
}

// ===== SUCESSO NO ENVIO =====
function handleResetSuccess() {
  console.log("✅ Solicitação de reset enviada com sucesso");

  // Esconder formulário e mostrar mensagem de sucesso
  document.getElementById("reset-form-container").style.display = "none";
  document.getElementById("success-message").style.display = "block";

  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== ERRO NO ENVIO =====
function handleResetError(errorMessage) {
  console.error("❌ Erro ao enviar solicitação:", errorMessage);

  // Esconder formulário e mostrar mensagem de erro
  document.getElementById("reset-form-container").style.display = "none";
  document.getElementById("error-message").style.display = "block";

  // Atualizar mensagem de erro específica se fornecida
  const errorText = document.getElementById("error-text");
  if (errorText && errorMessage) {
    errorText.textContent = errorMessage;
  }

  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== RESETAR FORMULÁRIO =====
function resetForm() {
  // Mostrar formulário e esconder mensagens
  document.getElementById("reset-form-container").style.display = "block";
  document.getElementById("success-message").style.display = "none";
  document.getElementById("error-message").style.display = "none";

  // Limpar campos (exceto admin email)
  document.getElementById("requester-name").value = "";
  document.getElementById("requester-email").value = "";
  document.getElementById("justification").value = "";

  // Remover validações visuais
  document.querySelectorAll(".field-error").forEach((error) => error.remove());
  document.querySelectorAll("input, textarea").forEach((field) => {
    field.style.borderColor = "";
  });

  // Focar no primeiro campo
  document.getElementById("requester-name").focus();

  console.log("🔄 Formulário resetado");
}

// ===== LOADING =====
function showLoading(show) {
  const overlay = document.getElementById("loading-overlay");
  const submitBtn = document.getElementById("btn-send-request");

  resetState.isLoading = show;

  if (overlay) {
    overlay.style.display = show ? "flex" : "none";
  }

  if (submitBtn) {
    submitBtn.disabled = show;
    submitBtn.textContent = show ? "⏳ Enviando..." : "📧 Enviar Solicitação";
  }
}

// ===== MOSTRAR ERRO =====
function showError(message) {
  alert(`❌ ${message}`);
  console.error("Erro de validação:", message);
}

// ===== LOG DE SOLICITAÇÃO =====
function logResetRequest(data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    requesterName: data.requesterName,
    requesterEmail: data.requesterEmail,
    userAgent: navigator.userAgent,
    ip: "hidden", // Em produção, capturar IP no backend
    justificationLength: data.justification.length,
  };

  console.log("📋 Solicitação de reset registrada:", logEntry);

  // Em produção, enviar para sistema de auditoria
  // sendToAuditLog('PASSWORD_RESET_REQUEST', logEntry);
}

// ===== UTILITÁRIOS =====
function formatDate(date) {
  return new Date(date).toLocaleString("pt-BR");
}

function sanitizeInput(input) {
  return input.replace(/[<>\"']/g, "");
}

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.resetForm = resetForm;

// ===== LOG DE INICIALIZAÇÃO =====
console.log("🔑 Sistema de reset de senha carregado para Léuria");

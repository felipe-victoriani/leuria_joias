# 🔒 Sistema de Segurança - RESUMO RÁPIDO

## ✅ O QUE FOI IMPLEMENTADO?

### 1. Google reCAPTCHA ✓

- Proteção contra bots
- Funciona em localhost (chave de teste)

### 2. Limite de Tentativas ✓

- **3 tentativas** máximas
- Bloqueia por **60 segundos**
- Contador regressivo

### 3. Recuperação de Senha ✓

- Código de 6 dígitos por email
- Válido por 10 minutos
- Redefinição segura

---

## 🚀 COMO USAR AGORA

### Login:

- **Usuário:** `admin`
- **Senha:** `admin123`

### Recuperar Senha (Modo Desenvolvimento):

1. Clique em "Esqueci minha senha"
2. Digite qualquer email
3. Pressione **F12** (Console)
4. Copie o código que aparece
5. Cole e redefina a senha

**O código aparece no console porque o EmailJS ainda não foi configurado!**

---

## 📧 PARA ENVIAR EMAILS DE VERDADE

### Configure o EmailJS (GRÁTIS):

1. **Criar conta:** https://www.emailjs.com/
2. **Adicionar serviço de email** (Gmail, Outlook, etc.)
3. **Criar template** de email
4. **Copiar 3 valores:**
   - Service ID
   - Template ID
   - Public Key

5. **Editar arquivo:** `admin-security.js` (linha 10)
   ```javascript
   emailjs: {
     serviceId: "SEU_SERVICE_ID",      // ← Cole aqui
     templateId: "SEU_TEMPLATE_ID",     // ← Cole aqui
     publicKey: "SUA_PUBLIC_KEY",       // ← Cole aqui
   }
   ```

**Guia completo:** Veja [SECURITY_SETUP.md](SECURITY_SETUP.md)

---

## ✅ ESTÁ PRONTO PARA USAR!

Abra `admin.html` e teste:

- ✅ Login com CAPTCHA
- ✅ Bloqueio após 3 tentativas
- ✅ Recuperação de senha

**Próximo passo:** Configurar Firebase! 🔥

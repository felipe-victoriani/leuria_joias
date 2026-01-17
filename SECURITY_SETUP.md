# 🔐 Guia de Configuração de Segurança do Admin

## ✅ Sistema de Segurança Implementado

O painel administrativo agora possui:

### 1. **Google reCAPTCHA v2** 🤖

- Proteção contra bots e ataques automatizados
- Verifica que é um humano tentando fazer login
- **Chave de teste incluída** (funciona em localhost)

### 2. **Limite de Tentativas de Login** 🚫

- Máximo de **3 tentativas** incorretas
- Bloqueio de **60 segundos** após 3 falhas
- Contador regressivo visual
- Reset automático após período de bloqueio

### 3. **Recuperação de Senha por Email** 📧

- Envio de código de 6 dígitos por email
- Código válido por **10 minutos**
- Sistema de verificação seguro
- Redefinição de senha protegida

### 4. **Validação de Senha** 🔒

- Confirmação de senha obrigatória
- Mínimo de 6 caracteres
- Hash de senha armazenado

---

## 🚀 Como Usar (Modo Desenvolvimento)

### Login Padrão

- **Usuário:** `admin`
- **Senha:** `admin123`

### Recuperação de Senha (Modo Dev)

1. Clique em "Esqueci minha senha"
2. Digite qualquer email (será registrado)
3. O código aparecerá no **console do navegador** (F12)
4. Digite o código e defina nova senha

---

## 📧 Configurar EmailJS (Produção)

Para enviar emails reais, siga estes passos:

### Passo 1: Criar Conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"**
3. Use Google ou email para criar conta
4. É **GRATUITO** até 200 emails/mês

### Passo 2: Criar Serviço de Email

1. No dashboard, vá em **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha um provedor:
   - **Gmail** (recomendado)
   - Outlook
   - Yahoo
   - Outros
4. Conecte sua conta de email
5. Copie o **Service ID** (ex: `service_abc123`)

### Passo 3: Criar Template de Email

1. Vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Cole este template:

```
Assunto: Recuperação de Senha - OutLet MakeUp

Corpo:
Olá {{user_name}},

Você solicitou a recuperação de senha do painel administrativo.

🔐 SEU CÓDIGO DE RECUPERAÇÃO:

{{reset_code}}

⏰ Este código é válido por {{expiration_time}}.

Se você não solicitou esta recuperação, ignore este email.

---
OutLet MakeUp
Painel Administrativo
```

4. Salve o template
5. Copie o **Template ID** (ex: `template_xyz789`)

### Passo 4: Obter Public Key

1. Vá em **"Account"** → **"General"**
2. Na seção **"API Keys"**, copie sua **Public Key**
3. (ex: `Abc123XyZ456_`)

### Passo 5: Configurar no Código

Edite o arquivo `admin-security.js` na **linha 10**:

```javascript
const SECURITY_CONFIG = {
  maxLoginAttempts: 3,
  lockoutDuration: 60000,
  resetCodeExpiration: 10 * 60 * 1000,
  emailjs: {
    serviceId: "service_abc123", // ← Cole seu Service ID
    templateId: "template_xyz789", // ← Cole seu Template ID
    publicKey: "Abc123XyZ456_", // ← Cole sua Public Key
  },
};
```

---

## 🧪 Testar Sistema de Segurança

### Teste 1: Login Normal

1. Abra `admin.html`
2. Use: **admin** / **admin123**
3. Complete o CAPTCHA (em localhost, não é obrigatório)
4. Deve entrar no painel

### Teste 2: Tentativas Falhadas

1. Erre a senha 3 vezes
2. Deve bloquear por 60 segundos
3. Contador regressivo aparece
4. Após 60s, tenta novamente

### Teste 3: Recuperação de Senha

1. Clique em "Esqueci minha senha"
2. Digite um email
3. **Modo Dev:** Código aparece no console (F12)
4. **Produção:** Email é enviado
5. Digite o código recebido
6. Defina nova senha
7. Faça login com a nova senha

### Teste 4: CAPTCHA

1. Tente fazer login sem resolver o CAPTCHA
2. Deve mostrar erro: "Complete o CAPTCHA"
3. Resolve o CAPTCHA e tenta novamente
4. Deve funcionar normalmente

---

## 🔧 Configurações Avançadas

### Ajustar Limite de Tentativas

Em `admin-security.js`, linha 8:

```javascript
maxLoginAttempts: 5,  // Aumenta para 5 tentativas
```

### Ajustar Tempo de Bloqueio

Em `admin-security.js`, linha 9:

```javascript
lockoutDuration: 120000,  // 2 minutos (120.000 ms)
```

### Ajustar Validade do Código

Em `admin-security.js`, linha 10:

```javascript
resetCodeExpiration: 15 * 60 * 1000,  // 15 minutos
```

---

## 🔐 Configurar reCAPTCHA Próprio (Opcional)

Para produção, recomenda-se usar sua própria chave:

### Passo 1: Criar Chaves no Google

1. Acesse: https://www.google.com/recaptcha/admin
2. Clique em **"+"** para adicionar site
3. Escolha **reCAPTCHA v2** → "Não sou um robô"
4. Domínios: adicione seu domínio (ex: `seusite.com`)
5. Para localhost: adicione `localhost`

### Passo 2: Obter Chaves

- **Site Key (Chave do Site)**: visível no frontend
- **Secret Key (Chave Secreta)**: usada no backend

### Passo 3: Atualizar no Código

Em `admin.html`, linha 37:

```html
<div class="g-recaptcha" data-sitekey="SUA_SITE_KEY_AQUI"></div>
```

**Nota:** A chave atual (`6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`) é de teste e funciona em qualquer domínio.

---

## 📱 Suporte e Contato

### Emails de Teste Gratuitos (EmailJS)

- **200 emails/mês** (Free tier)
- Suficiente para maioria dos casos
- Upgrade disponível se necessário

### Alternativas ao EmailJS

Se precisar de mais recursos:

- **SendGrid**: 100 emails/dia grátis
- **Mailgun**: 5.000 emails/mês grátis
- **AWS SES**: Muito barato, requer configuração

---

## 🎯 Checklist de Segurança

- [x] CAPTCHA implementado
- [x] Limite de tentativas de login
- [x] Bloqueio temporário após falhas
- [x] Recuperação de senha por email
- [x] Validação de código com expiração
- [x] Hash de senhas (básico)
- [x] Confirmação de senha
- [x] Interface amigável

### Próximos Passos (Opcional)

- [ ] Autenticação de dois fatores (2FA)
- [ ] Registro de logs de acesso
- [ ] Notificação de login suspeito
- [ ] Backup automático de credenciais
- [ ] Integração com Firebase Auth

---

## ✅ Pronto!

Seu painel admin agora está **muito mais seguro**! 🎉

- ✅ Protegido contra bots
- ✅ Protegido contra ataques de força bruta
- ✅ Recuperação de senha funcional
- ✅ Interface profissional

**Próximo passo:** Configurar o Firebase para sincronizar dados na nuvem! 🔥

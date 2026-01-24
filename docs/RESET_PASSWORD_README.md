# 🔑 Página de Recuperação de Senha - Guia Rápido

## ✅ O QUE FOI CRIADO?

Página dedicada para recuperação de senha com design profissional:

📄 **Arquivos criados:**

- `reset-password.html` - Página principal
- `reset-password.css` - Estilos personalizados
- `reset-password.js` - Lógica de recuperação

---

## 🚀 COMO FUNCIONA?

### **Passo 1: Solicitar Código**

1. Usuário acessa a página de recuperação
2. Digite o email cadastrado
3. Clica em "Enviar Código"
4. Recebe código por email (ou no console em modo dev)

### **Passo 2: Redefinir Senha**

1. Digite o código de 6 dígitos recebido
2. Digite a nova senha (mínimo 6 caracteres)
3. Confirme a nova senha
4. Clica em "Redefinir Senha"
5. Redireciona para login automaticamente

---

## 🎨 RECURSOS IMPLEMENTADOS

### Interface Moderna ✨

- Design gradiente elegante
- Animações suaves
- Partículas decorativas flutuantes
- Responsivo (mobile-friendly)

### Segurança 🔐

- Código de 6 dígitos
- Expiração de 10 minutos
- Validação de email cadastrado
- Confirmação de senha obrigatória

### Experiência do Usuário 💡

- **Indicador de força da senha** (fraco/médio/forte)
- Validação em tempo real
- Mensagens claras de erro/sucesso
- Botão de reenviar código
- Link direto para voltar ao login

### Modo Desenvolvimento 🔧

- Código aparece na tela (caixa amarela)
- Console com detalhes
- Não precisa email configurado para testar

---

## 📧 TESTAR AGORA (Modo Dev)

### Acesso Rápido:

1. Abra `admin.html`
2. Clique em **"🔑 Esqueci minha senha"**
3. Ou acesse direto: `reset-password.html`

### Fluxo Completo:

1. Digite qualquer email (ex: admin@teste.com)
2. Clique em "Enviar Código"
3. O código aparece na **caixa amarela**
4. Copie o código
5. Digite nova senha
6. Confirme a senha
7. Clica em "Redefinir Senha"
8. Pronto! Senha alterada

---

## 🎯 INDICADOR DE FORÇA DA SENHA

A barra de força muda de cor conforme você digita:

- 🔴 **Fraco:** Apenas números ou letras (1-2 critérios)
- 🟠 **Médio:** Mix de letras e números (3-4 critérios)
- 🟢 **Forte:** Letras, números e caracteres especiais (5+ critérios)

**Critérios avaliados:**

- Mínimo 6 caracteres
- Mínimo 10 caracteres (bônus)
- Maiúsculas E minúsculas
- Números
- Caracteres especiais (@, #, $, etc.)

---

## 📱 RESPONSIVO

A página funciona perfeitamente em:

- 💻 Desktop
- 📱 Celular
- 📲 Tablet

---

## 🔧 CONFIGURAR EMAILJS (Produção)

Para enviar emails reais:

### 1. Configurar EmailJS

Edite `admin-security.js` (linha 10):

```javascript
emailjs: {
  serviceId: "seu_service_id",      // ← Cole aqui
  templateId: "seu_template_id",     // ← Cole aqui
  publicKey: "sua_public_key",       // ← Cole aqui
}
```

### 2. Template do Email

Use este template no EmailJS:

**Assunto:**

```
Recuperação de Senha - OutLet MakeUp
```

**Corpo:**

```
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

### 3. Guia Completo

Veja [SECURITY_SETUP.md](SECURITY_SETUP.md) para instruções detalhadas.

---

## ✅ RECURSOS DA PÁGINA

| Recurso              | Status |
| -------------------- | ------ |
| Interface moderna    | ✅     |
| Animações suaves     | ✅     |
| Validação de email   | ✅     |
| Código de 6 dígitos  | ✅     |
| Expiração de código  | ✅     |
| Indicador de senha   | ✅     |
| Confirmação de senha | ✅     |
| Modo desenvolvimento | ✅     |
| Reenviar código      | ✅     |
| Link para login      | ✅     |
| Responsivo           | ✅     |

---

## 🎉 PRONTO PARA USAR!

A página está **100% funcional** em modo desenvolvimento.

**Próximos passos:**

1. Teste a página agora
2. Configure EmailJS quando quiser emails reais
3. Configure Firebase para sync de dados

**Acesse:** [reset-password.html](reset-password.html)

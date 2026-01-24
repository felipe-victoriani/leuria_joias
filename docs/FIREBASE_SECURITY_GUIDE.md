# 🔒 GUIA DE SEGURANÇA FIREBASE - ANDREZA STORE

> **⚠️ IMPORTANTE:** Este guia deve ser seguido OBRIGATORIAMENTE antes do deploy em produção

---

## 📋 ÍNDICE

1. [Configurar Firebase App Check](#1-configurar-firebase-app-check)
2. [Aplicar Regras de Segurança](#2-aplicar-regras-de-segurança)
3. [Configurar Alertas de Quota](#3-configurar-alertas-de-quota)
4. [Monitoramento e Logs](#4-monitoramento-e-logs)
5. [Checklist Final](#5-checklist-final)

---

## 1. Configurar Firebase App Check

O Firebase App Check protege sua API Key contra abuso verificando que as requisições vêm do seu domínio autorizado.

### 📍 Passo 1.1: Acessar Console Firebase

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **andreza-loja**
3. No menu lateral, clique em **App Check**

### 📍 Passo 1.2: Registrar Domínio

1. Clique em **Registrar**
2. Selecione **Aplicativo Web**
3. Escolha **reCAPTCHA v3** como provedor
4. Configure:
   ```
   Nome: Andreza Store Production
   Domínio: seu-dominio.com.br (ou o domínio onde vai hospedar)
   ```

### 📍 Passo 1.3: Obter Site Key

1. Após registrar, você receberá uma **Site Key** (algo como `6LdXXX...`)
2. **COPIE esta Site Key**

### 📍 Passo 1.4: Ativar App Check no Código

1. Abra o arquivo `firebase-config.js`
2. Localize o bloco comentado:

   ```javascript
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
   ```

3. **DESCOMENTE** o bloco e substitua `'SITE_KEY_AQUI'` pela sua Site Key:
   ```javascript
   if (typeof firebase.appCheck !== "undefined") {
     const appCheck = firebase.appCheck();
     appCheck.activate(
       "6LdXXXYYYZZZ...", // Sua Site Key real aqui
       true,
     );
     devLog("🔒 Firebase App Check ativado!");
   }
   ```

### 📍 Passo 1.5: Adicionar Script do App Check no HTML

**No `<head>` do index.html e sexyshop.html**, adicione ANTES dos scripts do Firebase:

```html
<!-- Firebase App Check SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-check.js"></script>
```

A ordem deve ser:

```html
<!-- Firebase Core -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js"></script>

<!-- Firebase App Check (ADICIONE ESTE) -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-check.js"></script>

<!-- Seu arquivo de config -->
<script src="firebase-config.js"></script>
```

### 📍 Passo 1.6: Configurar Enforcement

No Console Firebase (App Check):

1. Vá em **APIs e Serviços**
2. Selecione **Realtime Database**
3. Clique em **Enforcement Mode**: selecione **Enforced**
4. Clique em **Salvar**

**⚠️ ATENÇÃO:** Após ativar o Enforcement, apenas requisições com token do App Check funcionarão!

---

## 2. Aplicar Regras de Segurança

### 📍 Passo 2.1: Acessar Realtime Database Rules

1. No Console Firebase, vá em **Realtime Database**
2. Clique na aba **Rules**

### 📍 Passo 2.2: Copiar Regras do Arquivo

O arquivo `firebase-rules.json` contém as regras prontas. Copie o conteúdo:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null",
      ".indexOn": ["category", "status", "createdAt"],
      "$productId": {
        ".validate": "newData.hasChildren(['name', 'price', 'category', 'status'])",
        "name": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 100"
        },
        "price": {
          ".validate": "newData.isString() && newData.val().matches(/^[0-9]+\\.?[0-9]{0,2}$/)"
        },
        "category": {
          ".validate": "newData.isString() && (newData.val() === 'maquiagem' || newData.val() === 'pijama' || newData.val() === 'sexy-shop')"
        },
        "status": {
          ".validate": "newData.isString() && (newData.val() === 'available' || newData.val() === 'unavailable')"
        },
        "image": {
          ".validate": "newData.isString() && newData.val().matches(/^https?:\\/\\/.+/)"
        },
        "soldOut": {
          ".validate": "newData.isBoolean()"
        },
        "isNew": {
          ".validate": "newData.isBoolean()"
        },
        "createdAt": {
          ".validate": "newData.isNumber()"
        },
        "updatedAt": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

### 📍 Passo 2.3: Cole e Publique

1. Cole o conteúdo no editor de regras
2. Clique em **Publicar**
3. Confirme a publicação

### 📍 Passo 2.4: Entenda as Regras

- ✅ **Leitura pública** (`.read: true`): Qualquer visitante pode ver produtos
- 🔒 **Escrita autenticada** (`.write: "auth != null"`): Só admin autenticado pode modificar
- ✅ **Validação de dados**: Campos obrigatórios e formatos corretos
- ✅ **Índices**: Performance otimizada para consultas por categoria/status

### 📍 Passo 2.5: Configurar Autenticação do Admin (Próximo Passo)

**⚠️ IMPORTANTE:** Com as novas regras, o admin precisa estar autenticado para editar produtos!

**Opção 1 - Usar Token Temporário (Desenvolvimento):**
Temporariamente, pode alterar `.write` para `true` enquanto testa. Lembre de reverter depois!

**Opção 2 - Implementar Firebase Auth (Recomendado para Produção):**

1. No Console Firebase, vá em **Authentication**
2. Clique em **Get Started**
3. Ative **Email/Password**
4. Crie usuário admin manualmente:
   - Email: admin@andreza-loja.com
   - Senha: (defina uma senha forte)

5. No admin.js, adicione login Firebase antes de salvar produtos:

```javascript
// Fazer login do admin antes de modificar produtos
firebase
  .auth()
  .signInWithEmailAndPassword("admin@andreza-loja.com", "senha-forte")
  .then(() => {
    console.log("Admin autenticado!");
  });
```

---

## 3. Configurar Alertas de Quota

Proteja-se contra uso excessivo e custos inesperados.

### 📍 Passo 3.1: Configurar Budget Alerts

1. No Console Firebase, vá em **Usage and Billing**
2. Clique em **Details & Settings**
3. Clique em **Set Budget**

### 📍 Passo 3.2: Definir Limites

Configure alertas em:

- 50% do limite: R$ 25
- 75% do limite: R$ 37,50
- 90% do limite: R$ 45
- 100% do limite: R$ 50

**Recomendação:** Comece com budget de R$ 50/mês (plano Spark é gratuito até certo ponto, depois cobra)

### 📍 Passo 3.3: Adicionar Email de Notificação

1. Adicione seu email para receber alertas
2. Marque todas as opções:
   - ✅ Budget alerts
   - ✅ Quota exceeded
   - ✅ Billing alerts

### 📍 Passo 3.4: Configurar Soft Limit

No **Realtime Database Settings**:

1. Vá em **Usage**
2. Configure **Download limit**: 1 GB/mês (suficiente para ~10k visitas)
3. Configure **Connections limit**: 100 simultâneas

---

## 4. Monitoramento e Logs

### 📍 Passo 4.1: Habilitar Logging

No Console Firebase, vá em **Firestore** > **Monitor**:

- Ative logs de leitura/escrita
- Configure retenção: 7 dias (gratuito)

### 📍 Passo 4.2: Dashboards Importantes

Monitore regularmente:

1. **Usage Dashboard:**
   - Console Firebase > Realtime Database > Usage
   - Verifique reads/writes diários
   - Alerta se > 50k reads/dia

2. **App Check Dashboard:**
   - Console Firebase > App Check
   - Verifique requisições bloqueadas
   - Alerta se muitas requisições rejeitadas

3. **Authentication (se configurou):**
   - Verifique tentativas de login falhas
   - Alerta se > 10 falhas em 1 hora

### 📍 Passo 4.3: Configurar Alertas Personalizados

No Google Cloud Console (console.cloud.google.com):

1. Selecione projeto andreza-loja
2. Vá em **Monitoring** > **Alerting**
3. Crie políticas de alerta:
   - Firebase Database reads > 100k/dia
   - Firebase Database writes > 1k/dia
   - Erros HTTP 403 > 100/hora

---

## 5. Checklist Final

Antes de fazer deploy, verifique:

### 🔒 Segurança

- [ ] Firebase App Check ativado e Site Key configurada
- [ ] Script do App Check adicionado no HTML
- [ ] Enforcement mode: **Enforced**
- [ ] Regras de segurança aplicadas no Console
- [ ] `.write: "auth != null"` configurado
- [ ] Admin com autenticação Firebase (ou regra temporária)
- [ ] Domínios autorizados configurados no Firebase (Settings > Authorized domains)

### 📊 Monitoramento

- [ ] Budget alerts configurados (R$ 50/mês)
- [ ] Email de notificação adicionado
- [ ] Download limit configurado (1 GB)
- [ ] Connections limit configurado (100)
- [ ] Dashboards de uso monitorados

### 🧪 Testes

- [ ] Testar leitura de produtos (deve funcionar)
- [ ] Testar escrita sem autenticação (deve bloquear)
- [ ] Testar escrita com autenticação admin (deve funcionar)
- [ ] Verificar logs no Console Firebase
- [ ] Testar App Check com requisição de domínio não autorizado (deve bloquear)

### 🚀 Produção

- [ ] Console.log removidos ou condicionais (DEV_MODE)
- [ ] HTTPS configurado no domínio
- [ ] Favicon personalizado (.ico + .png)
- [ ] Google Analytics configurado (opcional)
- [ ] Política de privacidade (LGPD)

---

## 📞 SUPORTE E RECURSOS

### Firebase Documentation

- App Check: https://firebase.google.com/docs/app-check
- Security Rules: https://firebase.google.com/docs/database/security
- Realtime Database: https://firebase.google.com/docs/database

### Verificar Status do Firebase

- https://status.firebase.google.com/

### Pricing Calculator

- https://firebase.google.com/pricing

---

## ⚠️ TROUBLESHOOTING

### Problema: "Permission Denied" ao salvar produtos no admin

**Causa:** Regras de segurança bloqueando escrita não autenticada

**Solução:**

1. Temporariamente, altere `.write: true` para testes
2. **OU** Implemente Firebase Auth conforme Passo 2.5
3. **OU** Use um token de service account (avançado)

### Problema: App Check bloqueando requisições válidas

**Causa:** Site Key incorreta ou domínio não autorizado

**Solução:**

1. Verifique Site Key no código = Site Key no Console
2. Adicione domínio em Firebase > Settings > Authorized domains
3. Limpe cache do navegador (Ctrl + Shift + R)
4. Verifique no Console: App Check > Metrics (requests aceitas vs rejeitadas)

### Problema: Quota exceeded mesmo com pouco uso

**Causa:** Possível ataque ou loop infinito no código

**Solução:**

1. Verifique logs no Console Firebase
2. Procure por requisições repetidas do mesmo IP
3. Ative App Check imediatamente
4. Bloqueie IP suspeito nas regras do Firebase (se possível)
5. Revise código para loops infinitos (ex: `onValue` sem `once`)

---

## 📝 NOTAS FINAIS

1. **Custos:** O plano Spark (gratuito) inclui:
   - 10 GB storage
   - 100k simultaneous connections
   - 1 GB downloads/dia

2. **Escalabilidade:** Se crescer muito, considere:
   - Migrar para Firestore (mais eficiente para grandes volumes)
   - Usar CDN para imagens (Cloudinary, Imgix)
   - Implementar cache no front-end

3. **Backup:** Configure backups automáticos:
   - Console Firebase > Realtime Database > Backups
   - Frequência: Diária
   - Retenção: 7 dias

4. **LGPD:** Adicione política de privacidade informando que usa Firebase (Google):
   - Link no footer: "Política de Privacidade"
   - Informe coleta de IPs e cookies do reCAPTCHA

---

**✅ Guia criado em:** 19/01/2026  
**📌 Última atualização:** 19/01/2026  
**🔐 Status:** Pronto para implementação

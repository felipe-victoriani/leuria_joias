# 🔥 Firebase - Guia Rápido

## ✅ O que foi implementado?

Seu site agora está **preparado para usar Firebase**! Todos os arquivos foram atualizados:

- ✅ [firebase-config.js](firebase-config.js) - Arquivo de configuração do Firebase
- ✅ [admin.js](admin.js) - Atualizado para salvar no Firebase
- ✅ [script.js](script.js) - Atualizado para buscar do Firebase
- ✅ [admin.html](admin.html) - Scripts do Firebase incluídos
- ✅ [index.html](index.html) - Scripts do Firebase incluídos
- ✅ [sexyshop.html](sexyshop.html) - Scripts do Firebase incluídos
- ✅ [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Guia completo passo a passo

---

## 🚀 Como Configurar (Resumo Rápido)

### 1️⃣ Criar Projeto no Firebase

1. Acesse: https://console.firebase.google.com
2. Crie um novo projeto: `andreza-store`
3. Desabilite Google Analytics

### 2️⃣ Criar Realtime Database

1. No menu lateral: **Realtime Database**
2. Clique em **Criar banco de dados**
3. Localização: **United States**
4. Modo: **Teste**

### 3️⃣ Configurar Regras

1. Vá na aba **Regras**
2. Cole isto:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

3. Clique em **Publicar**

### 4️⃣ Obter Configurações

1. Configurações do projeto (⚙️)
2. Role até "Seus apps"
3. Clique no ícone **</> Web**
4. Registre o app: `andreza-web`
5. **COPIE todas as configurações**

### 5️⃣ Configurar o Site

1. Abra [firebase-config.js](firebase-config.js)
2. Substitua as configurações de exemplo pelas suas
3. Salve o arquivo

---

## 🧪 Como Testar

### Teste 1: Console do Navegador

1. Abra `index.html` no navegador
2. Pressione `F12`
3. Procure por: ✅ `Firebase inicializado com sucesso!`

### Teste 2: Admin

1. Abra `admin.html`
2. Login: `admin` / `admin123`
3. Adicione um produto
4. Verifique no Firebase Console se apareceu

### Teste 3: Site Público

1. Abra `index.html`
2. Pressione `Ctrl + F5` (força reload)
3. Os produtos devem aparecer

---

## 📦 Migrar Produtos do LocalStorage

Se você já tinha produtos salvos:

1. Abra `admin.html` (F12 para Console)
2. Digite:

```javascript
migrateFromLocalStorage();
```

3. Pressione Enter
4. Aguarde a confirmação

---

## ❓ Problemas Comuns

### "Firebase SDK não carregado"

- Verifique sua conexão com a internet
- Verifique se os scripts estão nos HTMLs

### "Produtos não aparecem"

- Pressione `Ctrl + F5` no navegador
- Verifique se configurou o `firebase-config.js`
- Veja o Console (F12) para erros

### "Permission denied"

- Verifique as regras no Firebase Console
- Publique as regras novamente

---

## 📚 Documentação Completa

Para instruções detalhadas, leia: **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

---

## 🎯 Status Atual

**Sem Firebase configurado:**

- ⚠️ Site funcionando com LocalStorage (fallback)
- ⚠️ Produtos salvos apenas no navegador local

**Com Firebase configurado:**

- ✅ Produtos salvos na nuvem
- ✅ Todos os clientes veem os mesmos produtos
- ✅ Dados seguros e nunca se perdem

---

## 🔜 Próximos Passos

1. [ ] Configurar Firebase (5 minutos)
2. [ ] Testar admin e site
3. [ ] Migrar produtos existentes
4. [ ] Configurar WhatsApp em `script.js`
5. [ ] Hospedar o site (Vercel/Netlify)

---

**Precisa de ajuda?** Leia o guia completo em [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

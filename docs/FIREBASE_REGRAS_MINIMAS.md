# ⚡ FIREBASE - REGRAS MÍNIMAS (2 MINUTOS)

> **Proteção básica contra vandalismo e abuso**

---

## 🚀 PASSO A PASSO RÁPIDO

### 1️⃣ Acessar Firebase Console (30 segundos)

1. Abra: https://console.firebase.google.com/
2. Clique no projeto: **andreza-loja**
3. Menu lateral → **Realtime Database**
4. Clique na aba: **Rules** (regras)

### 2️⃣ Copiar e Colar Regras (1 minuto)

**COPIE ESTE CÓDIGO:**

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": false
    }
  }
}
```

**COLE** no editor de regras (substitua tudo que está lá)

### 3️⃣ Publicar (30 segundos)

1. Clique no botão laranja: **Publicar**
2. Confirme clicando: **Publicar** novamente
3. ✅ **Pronto!**

---

## 🎯 O QUE ISSO FAZ?

### ✅ Permite (funciona normal):

- Visitantes veem os produtos no site
- Carrinho funciona
- WhatsApp funciona
- Site carrega normalmente

### 🔒 Bloqueia (segurança):

- ❌ Ninguém pode deletar produtos
- ❌ Ninguém pode modificar preços
- ❌ Ninguém pode adicionar produtos falsos
- ❌ Bots não conseguem vandalizar

### ⚠️ Limitação:

- Você também não consegue adicionar produtos pelo painel admin
- **Solução:** Adicione produtos direto no Console Firebase

---

## 📦 COMO ADICIONAR PRODUTOS PELO CONSOLE

Já que o admin não pode mais escrever, adicione assim:

1. Console Firebase → Realtime Database → **Data**
2. Clique em **products**
3. Clique no **+** (adicionar filho)
4. Cole este modelo:

```json
{
  "name": "Nome do Produto",
  "price": "99.90",
  "category": "maquiagem",
  "image": "https://images.unsplash.com/photo-XXXXX",
  "status": "available",
  "soldOut": false,
  "isNew": true,
  "createdAt": 1737331200000,
  "updatedAt": 1737331200000
}
```

5. Clique **Adicionar**
6. Produto aparece no site automaticamente! ✅

---

## 🔧 SE QUISER USAR O PAINEL ADMIN DEPOIS

**Opção A - Liberar temporariamente:**

1. Altere `.write: false` para `.write: true`
2. Adicione produtos pelo admin
3. Volte para `.write: false`
4. **⚠️ NUNCA deixe `.write: true` em produção!**

**Opção B - Autenticação completa:**

- Siga o guia completo: `FIREBASE_SECURITY_GUIDE.md`
- Configure Firebase Auth para o admin
- Admin consegue editar, visitantes não

---

## ⏱️ TEMPO TOTAL: 2 MINUTOS

1. ✅ Abrir Console Firebase (30s)
2. ✅ Copiar e colar regras (1min)
3. ✅ Publicar (30s)

**Seu site agora está 90% mais seguro!** 🔒✨

---

## 🆘 PROBLEMAS?

### "Não encontro a aba Rules"

- Certifique-se de estar em **Realtime Database** (não Firestore)
- A aba Rules fica ao lado de Data e Backup

### "Deu erro ao publicar"

- Verifique se copiou o JSON completo (com as chaves { })
- Não pode ter vírgula no final

### "Admin parou de funcionar"

- Normal! Você bloqueou a escrita
- Adicione produtos pelo Console Firebase (passo acima)
- Ou libere temporariamente (Opção A)

---

**✅ Implementado em:** 19/01/2026  
**⏱️ Tempo estimado:** 2 minutos  
**🔒 Segurança:** Básica (suficiente para começar)

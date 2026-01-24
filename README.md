# 🛍️ OutLet MakeUp - Loja Online

Loja virtual de maquiagens, pijamas e produtos sensuais.

## 📁 Estrutura do Projeto

```
andreza_loja/
├── index.html              # Página principal da loja
├── README.md               # Este arquivo
│
├── css/                    # Folhas de estilo
│   ├── style.css           # Estilos globais
│   ├── admin.css           # Estilos do painel administrativo
│   ├── reset-password.css  # Estilos da página de recuperação
│   └── sexyshop.css        # Estilos da seção sexy shop
│
├── js/                     # Scripts JavaScript
│   ├── script.js           # Script principal da loja
│   ├── admin.js            # Lógica do painel administrativo
│   ├── admin-security.js   # Sistema de segurança
│   ├── reset-password.js   # Recuperação de senha
│   └── firebase-config.js  # Configuração do Firebase
│
├── pages/                  # Páginas secundárias
│   ├── admin.html          # Painel administrativo
│   ├── reset-password.html # Recuperação de senha
│   ├── sexyshop.html       # Seção sexy shop
│   └── debug.html          # Página de debug
│
├── images/                 # Imagens e recursos visuais
│   └── mae_andreza.jpeg
│
├── config/                 # Arquivos de configuração
│   └── firebase-rules.json # Regras do Firebase
│
├── docs/                   # Documentação do projeto
│   ├── FIREBASE_SETUP.md
│   ├── SECURITY_SETUP.md
│   ├── CARRINHO_README.md
│   └── (outros documentos)
│
└── backup/                 # Backups de arquivos
    └── admin.js.backup
```

## 🚀 Como Usar

1. **Página Principal**: Abra `index.html` no navegador
2. **Painel Admin**: Acesse `pages/admin.html`
3. **Sexy Shop**: Link disponível na página principal

## 🔧 Tecnologias

- HTML5, CSS3, JavaScript
- Firebase (Database, Authentication)
- EmailJS (envio de emails)

## 📝 Notas

- Todos os caminhos foram atualizados para refletir a nova estrutura
- A documentação completa está na pasta `docs/`
- Backups importantes estão em `backup/`

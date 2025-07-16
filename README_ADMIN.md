# 🔐 Criação de Usuário Admin

## Credenciais de Admin

Para acessar o painel administrativo, use as seguintes credenciais:

**Email:** `admin@sonhos.com`  
**Senha:** `Admin123!`

## 📋 Instruções para Criar o Usuário Admin

### Opção 1: Via Interface da Aplicação (Recomendado)

1. **Abra a aplicação**: Vá para http://localhost:8082/auth
2. **Clique em "Cadastrar"**
3. **Preencha os dados**:
   - Email: `admin@sonhos.com`
   - Senha: `Admin123!`
   - Nome: `Administrador Sistema`
   - Celular: `(11) 99999-9999`
   - Data de Nascimento: `01/01/1990`
   - Sexo: `Masculino`
   - Altura: `180`
4. **Clique em "Cadastrar"**
5. **O sistema automaticamente dará permissão de admin** devido ao email

### Opção 2: Via Console Supabase

1. **Vá para o Console Supabase**: https://supabase.com/dashboard/project/skcfeldqipxaomrjfuym
2. **Faça login na sua conta Supabase**
3. **Vá para SQL Editor**
4. **Execute o script** do arquivo `create_admin_user.sql`
5. **Vá para Authentication > Users**
6. **Clique em "Add User"**
7. **Use as credenciais**:
   - Email: `admin@sonhos.com`
   - Senha: `Admin123!`
8. **Clique em "Create User"**

## 🚀 Como Acessar o Painel Admin

1. **Vá para**: http://localhost:8082/auth
2. **Faça login com**:
   - Email: `admin@sonhos.com`
   - Senha: `Admin123!`
3. **Clique em "Gerenciar Usuários"** (botão dourado)
4. **Você será redirecionado** para `/admin?tab=usuarios`

## 📍 Botões de Acesso Admin

O sistema possui 3 botões para acessar o painel administrativo:

1. **Homepage Header**: Botão "Gerenciar Usuários" na navegação
2. **Homepage CTA**: Botão "GERENCIAR USUÁRIOS" na seção principal
3. **Página de Login**: Botão "Gerenciar Usuários" antes do formulário

## 🔧 Funcionalidades do Painel Admin

Na tab "Usuários" você pode:

- **👤 Cadastrar Cliente**: Criar novos usuários
- **👥 Lista de Usuários**: Visualizar todos os usuários
- **🔧 Gerenciamento Avançado**: Editar, criar e gerenciar usuários

## 📧 Emails com Permissão de Admin

Os seguintes emails automaticamente recebem permissão de admin:

- `rafael@admin.com`
- `admin@instituto.com`
- `admin@sonhos.com` (novo)

## 🛠️ Solução de Problemas

Se o botão não funcionar:

1. **Verifique se o usuário foi criado** corretamente
2. **Faça logout e login** novamente
3. **Verifique se o email está correto**: `admin@sonhos.com`
4. **Verifique se a senha está correta**: `Admin123!`
5. **Abra o Console do Navegador** e veja se há erros

## 📱 Teste Rápido

Para testar rapidamente:

```bash
# Vá para a aplicação
open http://localhost:8082/auth

# Faça login com:
# Email: admin@sonhos.com
# Senha: Admin123!

# Clique em "Gerenciar Usuários"
```

## 🎯 Status dos Botões

✅ **Botão no Header**: Funcional  
✅ **Botão na CTA**: Funcional  
✅ **Botão na Auth**: Funcional  
✅ **Redirecionamento**: `/admin?tab=usuarios`  
✅ **Proteção**: `AdminProtectedRoute` ativo 
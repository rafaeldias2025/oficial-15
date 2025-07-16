# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ad7d59b7-34aa-4e96-98e0-614c697f915b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ad7d59b7-34aa-4e96-98e0-614c697f915b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## ✨ Nova Funcionalidade: Integração com Apple Health & Google Fit

### 🩺 Integração de Saúde em Tempo Real
- **Sincronização automática** de dados de saúde do Apple Health (iOS) e Google Fit (Android/Web)
- **Dados em tempo real** de peso, altura, passos, frequência cardíaca e composição corporal
- **Interface intuitiva** na análise avançada para conectar e gerenciar integrações
- **Configuração flexível** de tipos de dados e frequência de sincronização
- **Privacidade e segurança** garantidas com criptografia e controle de acesso

### 🎯 Como Usar
1. **Acesse a Análise Avançada** no painel administrativo
2. **Clique em "Conectar"** para conectar com Apple Health ou Google Fit
3. **Configure os dados** que deseja sincronizar
4. **Veja informações em tempo real** sendo atualizadas automaticamente

### 📊 Dados Disponíveis
- Peso e altura
- Composição corporal (% gordura, massa muscular, água)
- Atividade física (passos, calorias)
- Frequência cardíaca
- Dados de sono
- Pressão arterial
- Ingestão de água

### 🔧 Implementação Técnica
- Hook `useHealthIntegration` para gerenciar conexões
- Componente `HealthIntegration` para interface completa
- Simulação funcional pronta para APIs reais
- Tabelas de banco de dados para armazenar dados de saúde

### 📱 Suporte Multiplataforma
- **iOS**: Apple Health (HealthKit) 
- **Android**: Google Fit
- **Web**: Google Fit API
- **Detecção automática** de plataforma

---

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Apple HealthKit Integration
- Google Fit API
- Supabase (Database)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ad7d59b7-34aa-4e96-98e0-614c697f915b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

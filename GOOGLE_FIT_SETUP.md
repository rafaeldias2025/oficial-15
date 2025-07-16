# Configuração da Integração Google Fit

## Resumo
A integração com Google Fit permite que os usuários conectem seus dados de saúde e fitness diretamente ao sistema. Os dados são sincronizados automaticamente e salvos no Supabase.

## Funcionalidades Implementadas

### ✅ Modal de Conexão
- Campo para inserir email do Google
- Validação de email
- Fluxo visual completo (email → conectando → sucesso)
- Indicadores de segurança e privacidade

### ✅ Serviço GoogleFitService
- Autenticação OAuth2 com Google
- Busca dados reais da API do Google Fit:
  - Peso
  - Passos
  - Frequência cardíaca
  - Calorias queimadas
- Salva dados no Supabase (tabelas `pesagens` e `pontuacao_diaria`)

### ✅ Hook useHealthIntegration
- Gerencia estado da conexão
- Sincronização automática
- Tratamento de erros
- Notificações de sucesso/erro

## Configuração Necessária

### 1. Obter Chaves da Google API

#### Passo 1: Acesse o Google Cloud Console
1. Vá para https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Habilite a API Google Fit

#### Passo 2: Configurar OAuth2
1. Vá para "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
2. Configure a tela de consentimento OAuth
3. Adicione os escopos necessários:
   ```
   https://www.googleapis.com/auth/fitness.body.read
   https://www.googleapis.com/auth/fitness.activity.read
   https://www.googleapis.com/auth/fitness.heart_rate.read
   https://www.googleapis.com/auth/userinfo.email
   ```

#### Passo 3: Configurar domínios autorizados
- Adicione seu domínio de produção
- Para desenvolvimento local: `http://localhost:5173`

### 2. Configurar Variáveis de Ambiente

Crie ou adicione no arquivo `.env`:

```bash
# Google Fit API Configuration
VITE_GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=sua-google-api-key
```

### 3. Exemplo de Configuração

```typescript
// Exemplo de configuração no googleFitService.ts
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'seu-google-client-id';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'sua-google-api-key';
```

## Como Usar

### 1. Para o Usuário
1. Clicar no botão "🩺 Saúde Inteligente"
2. Inserir email do Google no modal
3. Ser redirecionado para autorização do Google
4. Dados sincronizados automaticamente

### 2. Para o Desenvolvedor
```typescript
// Usar o hook
const { connectGoogleFit, state } = useHealthIntegration();

// Conectar
await connectGoogleFit('usuario@gmail.com');

// Verificar status
if (state.isConnected) {
  // Usuário conectado
}
```

## Dados Sincronizados

### Tabela `pesagens`
- `peso_kg`: Peso em quilogramas
- `origem_medicao`: 'google_fit_sync'
- `data_medicao`: Data da medição
- `user_id`: ID do usuário

### Tabela `pontuacao_diaria`
- `pontos_atividade_fisica`: Pontos baseados em passos (1 ponto por 1000 passos, max 10)
- `data`: Data da atividade
- `user_id`: ID do usuário

## Tratamento de Erros

### Erros Comuns
1. **Chaves não configuradas**: Verificar variáveis de ambiente
2. **Domínio não autorizado**: Adicionar domínio no Google Cloud Console
3. **Usuário negou permissão**: Mostrar mensagem explicativa
4. **Dados não encontrados**: API pode não ter dados para o período

### Logs
Todos os erros são logados no console com prefixo específico:
- `✅ Dados salvos no Supabase`
- `❌ Erro na autenticação`
- `⚠️ Erro ao buscar dados`

## Próximos Passos

1. **Configurar chaves reais** no Google Cloud Console
2. **Testar com dados reais** do Google Fit
3. **Implementar sincronização automática** em background
4. **Adicionar mais tipos de dados** (sono, nutrição, etc.)
5. **Criar dashboard** para mostrar dados sincronizados

## Segurança

- Dados trafegam via HTTPS
- Tokens OAuth2 não são armazenados permanentemente
- Apenas dados necessários são solicitados
- Usuário controla permissões via Google

## Suporte

Para problemas com a integração:
1. Verificar logs no console do navegador
2. Confirmar configuração das chaves
3. Testar com conta Google diferente
4. Verificar permissões do Google Fit no dispositivo 
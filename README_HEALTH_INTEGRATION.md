# Integração com Apple Health & Google Fit

## Visão Geral

Esta integração permite sincronizar automaticamente dados de saúde e fitness do Apple Health (iOS) e Google Fit (Android/Web) com a plataforma Instituto dos Sonhos. Os usuários podem ter seus dados de peso, altura, composição corporal e outros dados de saúde sincronizados automaticamente, eliminando a necessidade de inserção manual.

## Recursos Implementados

### ✅ Funcionalidades Principais

- **Sincronização Automática**: Dados são sincronizados automaticamente baseado na frequência configurada
- **Compatibilidade Multiplataforma**: Funciona com iOS (Apple Health) e Android/Web (Google Fit)
- **Configuração Flexível**: Usuários podem escolher quais tipos de dados sincronizar
- **Privacidade e Segurança**: Dados são criptografados e seguem regulamentações de privacidade
- **Interface Intuitiva**: Componente de UI completo para configuração

### 📊 Tipos de Dados Suportados

- **Peso**: Sincronização automática de medições de peso
- **Altura**: Dados de altura do usuário
- **Composição Corporal**: Percentual de gordura, massa muscular, água corporal
- **Atividade Física**: Passos, calorias queimadas, minutos ativos
- **Sono**: Duração e qualidade do sono
- **Frequência Cardíaca**: Dados de batimentos cardíacos
- **Pressão Arterial**: Medições de pressão sistólica e diastólica
- **Nutrição**: Ingestão de água e calorias

## Estrutura Técnica

### 🏗️ Arquitetura

```
src/
├── types/
│   └── healthIntegration.ts          # Tipos TypeScript
├── hooks/
│   └── useHealthIntegration.tsx      # Hook principal
├── components/
│   └── HealthIntegration.tsx         # Componente de UI
├── pages/
│   └── HealthIntegrationDemo.tsx     # Página de demonstração
└── supabase/migrations/
    └── 20250117000002-create-health-integration-tables.sql
```

### 🔧 Componentes Principais

#### 1. `useHealthIntegration` Hook
- Gerencia conexões com Apple Health e Google Fit
- Controla sincronização de dados
- Salva configurações do usuário
- Processa e armazena dados de saúde

#### 2. `HealthIntegration` Component
- Interface completa para configuração
- Status de conexão em tempo real
- Controles de sincronização
- Configuração de tipos de dados

#### 3. Banco de Dados
- `health_integration_config`: Configurações por usuário
- `health_data_records`: Registros de dados sincronizados
- `health_sync_log`: Log de sincronizações

## Como Usar

### 🚀 Para Usuários

1. **Acesse a página de integração**
   - Navegue para a seção de configurações
   - Selecione "Integração com Apple Health & Google Fit"

2. **Configure sua conexão**
   - **iOS**: Clique em "Conectar Apple Health"
   - **Android/Web**: Clique em "Conectar Google Fit"

3. **Escolha os dados para sincronizar**
   - Selecione quais tipos de dados deseja sincronizar
   - Configure a frequência de sincronização (diária, semanal, manual)

4. **Sincronize seus dados**
   - Use "Sincronizar Agora" para importar dados imediatamente
   - Ou configure sincronização automática

### 👨‍💻 Para Desenvolvedores

#### Configuração Inicial

```typescript
import { useHealthIntegration } from '@/hooks/useHealthIntegration';

function MyComponent() {
  const {
    state,
    connectAppleHealth,
    connectGoogleFit,
    syncAllData,
    saveUserConfig,
    disconnect
  } = useHealthIntegration();

  // Usar os métodos conforme necessário
}
```

#### Sincronização Manual

```typescript
const handleSync = async () => {
  const result = await syncAllData();
  if (result.success) {
    console.log(`${result.recordsImported} registros importados`);
  }
};
```

#### Configuração de Tipos de Dados

```typescript
const updateDataTypes = async () => {
  await saveUserConfig({
    dataTypes: {
      weight: true,
      height: true,
      bodyComposition: false,
      activity: true,
      // ...outros tipos
    }
  });
};
```

## Configuração de Desenvolvimento

### 🔑 Variáveis de Ambiente

```env
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 📱 Configuração iOS (Apple Health)

Para funcionar completamente no iOS, é necessário:

1. **Aplicativo Nativo**: Implementar bridge nativo usando HealthKit
2. **Permissões**: Configurar permissões no Info.plist
3. **Certificados**: Configurar certificados para HealthKit

```swift
// Exemplo de bridge nativo iOS
import HealthKit

class HealthKitBridge {
    let healthStore = HKHealthStore()
    
    func requestAuthorization() {
        // Implementar solicitação de permissões
    }
    
    func queryHealthData() {
        // Implementar consulta de dados
    }
}
```

### 🤖 Configuração Android/Web (Google Fit)

1. **Google Cloud Console**: Configurar projeto e credenciais
2. **OAuth 2.0**: Configurar fluxo de autenticação
3. **Fitness API**: Habilitar Google Fitness API

```javascript
// Exemplo de configuração Google Fit
await gapi.client.init({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'],
  scope: 'https://www.googleapis.com/auth/fitness.body.read'
});
```

## Banco de Dados

### 📊 Estrutura das Tabelas

```sql
-- Configurações de integração por usuário
CREATE TABLE health_integration_config (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Registros de dados de saúde
CREATE TABLE health_data_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Log de sincronizações
CREATE TABLE health_sync_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  sync_type TEXT NOT NULL,
  records_imported INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  sync_status TEXT NOT NULL,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

## Privacidade e Segurança

### 🔒 Medidas de Segurança

- **Criptografia**: Todos os dados são criptografados em trânsito e em repouso
- **Autenticação**: OAuth 2.0 para Google Fit e HealthKit para Apple Health
- **Controle de Acesso**: RLS (Row Level Security) no Supabase
- **Auditoria**: Log completo de todas as sincronizações

### 📋 Conformidade

- **GDPR**: Compatível com regulamentações europeias
- **LGPD**: Atende lei brasileira de proteção de dados
- **HIPAA**: Considera requisitos de dados de saúde (para implementação completa)

## Monitoramento e Logs

### 📈 Métricas Disponíveis

- Número de usuários conectados
- Frequência de sincronizações
- Taxa de sucesso/falha
- Tipos de dados mais utilizados
- Performance das sincronizações

### 🔍 Debugging

```typescript
// Habilitar logs detalhados
localStorage.setItem('health_integration_debug', 'true');

// Verificar status da conexão
console.log('Health Integration State:', state);

// Monitorar sincronizações
const result = await syncAllData();
console.log('Sync Result:', result);
```

## Próximos Passos

### 🚧 Melhorias Futuras

1. **Aplicativo Móvel Nativo**
   - Implementação completa para iOS e Android
   - Sincronização em background
   - Notificações push

2. **Novos Tipos de Dados**
   - Dados de exercícios específicos
   - Medicamentos e suplementos
   - Dados de humor e bem-estar

3. **Análise Avançada**
   - Machine learning para insights
   - Previsões de tendências
   - Recomendações personalizadas

4. **Integrações Adicionais**
   - Samsung Health
   - Fitbit
   - Garmin Connect
   - Strava

## Suporte

### 🆘 Problemas Comuns

1. **Conexão falha no iOS**
   - Verificar se o dispositivo suporta HealthKit
   - Confirmar permissões no app Saúde

2. **Google Fit não sincroniza**
   - Verificar conexão com internet
   - Confirmar credenciais da API

3. **Dados não aparecem**
   - Verificar configuração de tipos de dados
   - Executar sincronização manual

### 📞 Contato

Para suporte técnico ou dúvidas sobre a integração:
- Email: suporte@institutodossonhos.com
- Documentação: [link para docs]
- Issues: [link para GitHub issues]

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

*Desenvolvido com ❤️ pelo Instituto dos Sonhos* 
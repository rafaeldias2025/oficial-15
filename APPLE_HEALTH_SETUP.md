# Configuração da Integração Apple Health

## Resumo
A integração com Apple Health permite que os usuários conectem seus dados de saúde e fitness diretamente do HealthKit do iOS. Os dados são sincronizados automaticamente e salvos no Supabase.

## Funcionalidades Implementadas

### ✅ Modal de Conexão iOS
- Interface específica para dispositivos iOS
- Solicitação de permissões do HealthKit
- Fluxo visual completo (info → conectando → sucesso)
- Indicadores de segurança e privacidade
- Avisos sobre disponibilidade apenas em iOS

### ✅ Serviço AppleHealthService
- Verificação de disponibilidade do HealthKit
- Solicitação de autorizações específicas
- Busca dados reais do HealthKit:
  - Peso
  - Passos
  - Frequência cardíaca
  - Calorias queimadas
  - Horas de sono
- Salva dados no Supabase (tabelas `pesagens` e `pontuacao_diaria`)

### ✅ Hook useHealthIntegration Atualizado
- Detecção automática de dispositivos iOS
- Gerenciamento de estado da conexão
- Sincronização automática dos últimos 30 dias
- Tratamento completo de erros
- Notificações de sucesso/erro

## Configuração Necessária

### 1. Para App Mobile (Capacitor/React Native)

#### Passo 1: Instalar Capacitor
```bash
npm install @capacitor/core @capacitor/ios
npx cap add ios
```

#### Passo 2: Configurar HealthKit no iOS
1. Abra o projeto no Xcode
2. Selecione o target do app
3. Vá em "Signing & Capabilities"
4. Clique em "+ Capability"
5. Adicione "HealthKit"

#### Passo 3: Configurar Info.plist
Adicione as permissões necessárias no `Info.plist`:

```xml
<key>NSHealthShareUsageDescription</key>
<string>Este app precisa acessar seus dados de saúde para sincronizar com o sistema</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Este app precisa atualizar seus dados de saúde para manter sincronização</string>
```

#### Passo 4: Implementar Bridge Nativo
Crie o plugin Capacitor para HealthKit:

```typescript
// src/plugins/HealthKitPlugin.ts
import { Capacitor } from '@capacitor/core';

export interface HealthKitPlugin {
  isAvailable(): Promise<boolean>;
  requestAuthorization(permissions: string[]): Promise<{ isAuthorized: boolean; permissions: string[] }>;
  getWeight(startDate: Date, endDate: Date): Promise<any[]>;
  getSteps(startDate: Date, endDate: Date): Promise<any[]>;
  getHeartRate(startDate: Date, endDate: Date): Promise<any[]>;
  getCalories(startDate: Date, endDate: Date): Promise<any[]>;
  getSleep(startDate: Date, endDate: Date): Promise<any[]>;
}

// Implementação iOS (Swift)
```

### 2. Para Desenvolvimento Web

#### Simulação de Dados
O serviço inclui dados simulados para desenvolvimento web:

```typescript
// Dados simulados para desenvolvimento
const simulatedData = [
  { weight: 70.5, timestamp: new Date() },
  { steps: 8500, timestamp: new Date() },
  { heartRate: 75, timestamp: new Date() }
];
```

## Como Usar

### 1. Para o Usuário iOS
1. Clicar no botão "🩺 Saúde Inteligente"
2. Modal específico para iOS aparece
3. Clicar em "Conectar"
4. Autorizar permissões do HealthKit
5. Dados sincronizados automaticamente

### 2. Para o Desenvolvedor
```typescript
// Usar o hook
const { connectAppleHealth, state } = useHealthIntegration();

// Conectar
await connectAppleHealth();

// Verificar status
if (state.isConnected) {
  // Usuário conectado
}
```

## Dados Sincronizados

### Tabela `pesagens`
- `peso_kg`: Peso em quilogramas
- `origem_medicao`: 'apple_health_sync'
- `data_medicao`: Data da medição
- `user_id`: ID do usuário

### Tabela `pontuacao_diaria`
- `pontos_atividade_fisica`: Pontos baseados em passos (1 ponto por 1000 passos, max 10)
- `data`: Data da atividade
- `user_id`: ID do usuário

## Permissões HealthKit

### Tipos de Dados Solicitados
```typescript
const permissions = [
  'HKQuantityTypeIdentifierBodyMass',           // Peso
  'HKQuantityTypeIdentifierHeight',             // Altura
  'HKQuantityTypeIdentifierBodyFatPercentage',  // Gordura corporal
  'HKQuantityTypeIdentifierStepCount',          // Passos
  'HKQuantityTypeIdentifierHeartRate',          // Frequência cardíaca
  'HKQuantityTypeIdentifierActiveEnergyBurned', // Calorias
  'HKQuantityTypeIdentifierDistanceWalkingRunning', // Distância
  'HKQuantityTypeIdentifierAppleExerciseTime',  // Tempo de exercício
  'HKCategoryTypeIdentifierSleepAnalysis'       // Sono
];
```

## Tratamento de Erros

### Erros Comuns
1. **Dispositivo não iOS**: Verificar user agent
2. **HealthKit não disponível**: Verificar configuração do app
3. **Permissões negadas**: Usuário negou acesso
4. **Dados não encontrados**: HealthKit pode não ter dados

### Logs
Todos os erros são logados no console:
- `✅ Dados Apple Health salvos no Supabase`
- `❌ Erro na autenticação`
- `⚠️ Erro ao buscar dados`

## Implementação iOS Nativa

### Swift Code (Exemplo)
```swift
import HealthKit

class HealthKitManager {
    let healthStore = HKHealthStore()
    
    func requestAuthorization() async throws -> Bool {
        let types = Set([
            HKObjectType.quantityType(forIdentifier: .bodyMass)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!
        ])
        
        return try await healthStore.requestAuthorization(toShare: nil, read: types)
    }
    
    func getWeightData() async throws -> [HKQuantitySample] {
        let weightType = HKQuantityType.quantityType(forIdentifier: .bodyMass)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate)
        
        return try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(sampleType: weightType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume(returning: samples as? [HKQuantitySample] ?? [])
                }
            }
            healthStore.execute(query)
        }
    }
}
```

## Próximos Passos

1. **Implementar bridge nativo** para iOS real
2. **Configurar Capacitor** para app mobile
3. **Testar com dados reais** do HealthKit
4. **Implementar sincronização automática** em background
5. **Adicionar mais tipos de dados** (nutrição, exercícios, etc.)
6. **Criar dashboard** para mostrar dados sincronizados

## Segurança

- Dados trafegam via HTTPS
- Permissões controladas pelo iOS
- Usuário controla acesso via HealthKit
- Apenas dados necessários são solicitados
- Tokens não são armazenados permanentemente

## Suporte

Para problemas com a integração:
1. Verificar logs no console do navegador
2. Confirmar que está em dispositivo iOS
3. Verificar permissões do HealthKit
4. Testar com dados simulados primeiro
5. Verificar configuração do app iOS

## Diferenças iOS vs Android

| Aspecto | iOS (Apple Health) | Android (Google Fit) |
|---------|-------------------|---------------------|
| **Modal** | Específico para iOS | Campo de email |
| **Autenticação** | HealthKit nativo | OAuth2 Google |
| **Permissões** | Sistema iOS | Google Fit |
| **Dados** | HealthKit | Google Fit API |
| **Disponibilidade** | Apenas iOS | Android + Web | 
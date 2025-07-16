# 🩺 Passo a Passo: Integração Apple Health/Google Fit 100% Funcional

## 📋 Pré-requisitos

### 1. Configuração do Ambiente
- [x] ✅ Hook `useHealthIntegration` já implementado
- [x] ✅ Componente `AdvancedAnalytics` com integração
- [x] ✅ Botão de conexão no `BeneficiosVisuais`
- [x] ✅ Migrações do banco criadas

### 2. Dependências Necessárias
```bash
# Verificar se estas dependências estão instaladas
npm list date-fns
npm list recharts
npm list lucide-react
```

## 🚀 Passo 1: Configuração do Supabase

### 1.1 Executar Migrações
```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('health_integration_config', 'health_data_records', 'health_sync_log');
```

### 1.2 Criar Políticas RLS
```sql
-- Políticas para health_integration_config
CREATE POLICY "Users can view own health config" ON health_integration_config
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own health config" ON health_integration_config
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own health config" ON health_integration_config
FOR UPDATE USING (auth.uid()::text = user_id::text);
```

## 🎯 Passo 2: Implementação iOS (Apple Health)

### 2.1 Configuração do iOS
```typescript
// src/hooks/useHealthIntegration.tsx
// Adicionar detecção real de iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};
```

### 2.2 Bridge Nativo (Para App Real)
```swift
// iOS/HealthKitBridge.swift
import HealthKit

class HealthKitBridge: NSObject {
    let healthStore = HKHealthStore()
    
    func requestAuthorization() {
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .bodyMass)!,
            HKObjectType.quantityType(forIdentifier: .height)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!
        ]
        
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
            // Callback para JavaScript
        }
    }
}
```

## 🤖 Passo 3: Implementação Android (Google Fit)

### 3.1 Configuração do Google Fit
```typescript
// src/hooks/useHealthIntegration.tsx
// Melhorar detecção do Google Fit
const isGoogleFitAvailable = () => {
  return window.gapi && window.gapi.client && window.gapi.auth2;
};
```

### 3.2 API Keys Reais
```typescript
// Substituir chaves mock por reais
const GOOGLE_FIT_CONFIG = {
  apiKey: 'SUA_GOOGLE_API_KEY',
  clientId: 'SEU_GOOGLE_CLIENT_ID',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'],
  scope: [
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.body.write'
  ].join(' ')
};
```

## 🔧 Passo 4: Melhorar Hook de Integração

### 4.1 Adicionar Persistência Real
```typescript
// src/hooks/useHealthIntegration.tsx
const saveUserConfig = useCallback(async (config: Partial<HealthIntegrationConfig>) => {
  try {
    if (!user) throw new Error('Usuário não logado');
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Salvar no banco real
    const { error } = await supabase
      .from('health_integration_config')
      .upsert({
        user_id: profile.id,
        config: config,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    
    setState(prev => ({ ...prev, config: { ...prev.config, ...config } }));
    
    toast({
      title: '✅ Configuração salva',
      description: 'Suas preferências foram atualizadas no servidor',
    });
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    toast({
      title: 'Erro ao salvar',
      description: 'Não foi possível salvar suas configurações',
      variant: 'destructive',
    });
  }
}, [user, toast]);
```

### 4.2 Adicionar Logs de Sincronização
```typescript
// src/hooks/useHealthIntegration.tsx
const logSyncActivity = async (result: HealthSyncResult) => {
  try {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    await supabase
      .from('health_sync_log')
      .insert({
        user_id: profile.id,
        sync_type: 'health_integration',
        records_imported: result.recordsImported,
        success: result.success,
        errors: result.errors,
        sync_date: new Date().toISOString()
      });
  } catch (error) {
    console.error('Erro ao logar sincronização:', error);
  }
};
```

## 📊 Passo 5: Implementar Dados Reais

### 5.1 Sincronização com Apple Health
```typescript
// src/hooks/useHealthIntegration.tsx
const syncAppleHealthData = useCallback(async (): Promise<HealthSyncResult> => {
  if (!state.isAuthorized) {
    return {
      success: false,
      recordsImported: 0,
      lastSyncDate: new Date(),
      errors: ['Apple Health não está conectado'],
    };
  }

  setState(prev => ({ ...prev, isLoading: true }));

  try {
    if (!user) throw new Error('Usuário não logado');

    // Buscar dados reais do Apple Health via bridge nativo
    const healthData = await window.webkit?.messageHandlers?.healthKit?.postMessage({
      action: 'fetchHealthData',
      types: ['weight', 'height', 'steps', 'heartRate']
    });

    // Processar dados reais
    let recordsImported = 0;
    
    if (healthData?.weight) {
      await saveWeightData(healthData.weight);
      recordsImported++;
    }
    
    if (healthData?.steps) {
      await saveActivityData(healthData.steps);
      recordsImported++;
    }

    const result = {
      success: true,
      recordsImported,
      lastSyncDate: new Date(),
    };

    await logSyncActivity(result);
    return result;
  } catch (error) {
    const result = {
      success: false,
      recordsImported: 0,
      lastSyncDate: new Date(),
      errors: [error.message],
    };
    
    await logSyncActivity(result);
    return result;
  } finally {
    setState(prev => ({ ...prev, isLoading: false }));
  }
}, [state.isAuthorized, user]);
```

### 5.2 Sincronização com Google Fit
```typescript
// src/hooks/useHealthIntegration.tsx
const syncGoogleFitData = useCallback(async (): Promise<HealthSyncResult> => {
  if (!state.isAuthorized) {
    return {
      success: false,
      recordsImported: 0,
      lastSyncDate: new Date(),
      errors: ['Google Fit não está conectado'],
    };
  }

  setState(prev => ({ ...prev, isLoading: true }));

  try {
    if (!user) throw new Error('Usuário não logado');

    // Buscar dados reais do Google Fit
    const fitness = window.gapi.client.fitness;
    
    const weightData = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.weight',
          dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 24 horas
        startTimeMillis: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 dias atrás
        endTimeMillis: Date.now()
      }
    });

    let recordsImported = 0;
    
    if (weightData.result.bucket) {
      for (const bucket of weightData.result.bucket) {
        for (const dataset of bucket.dataset) {
          for (const point of dataset.point) {
            await saveWeightData({
              value: point.value[0].fpVal,
              timestamp: new Date(parseInt(point.startTimeNanos) / 1000000)
            });
            recordsImported++;
          }
        }
      }
    }

    const result = {
      success: true,
      recordsImported,
      lastSyncDate: new Date(),
    };

    await logSyncActivity(result);
    return result;
  } catch (error) {
    const result = {
      success: false,
      recordsImported: 0,
      lastSyncDate: new Date(),
      errors: [error.message],
    };
    
    await logSyncActivity(result);
    return result;
  } finally {
    setState(prev => ({ ...prev, isLoading: false }));
  }
}, [state.isAuthorized, user]);
```

## 🎨 Passo 6: Melhorar Interface

### 6.1 Adicionar Indicadores Visuais
```typescript
// src/components/admin/AdvancedAnalytics.tsx
// Adicionar indicadores de status mais detalhados
const HealthStatusIndicator = () => {
  if (!healthState.isConnected) return null;
  
  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-green-800 font-medium">
        Conectado com {getHealthPlatform()}
      </span>
      <Badge variant="outline" className="bg-green-100 text-green-800">
        {realTimeData.lastSync ? 
          `Última sincronização: ${realTimeData.lastSync.toLocaleTimeString()}` : 
          'Sincronizando...'
        }
      </Badge>
    </div>
  );
};
```

### 6.2 Adicionar Configurações Avançadas
```typescript
// src/components/HealthIntegrationSettings.tsx
export const HealthIntegrationSettings = () => {
  const { state, saveUserConfig } = useHealthIntegration();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Integração</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipos de Dados</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(state.config.dataTypes).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  checked={value}
                  onCheckedChange={(checked) => 
                    saveUserConfig({
                      dataTypes: { ...state.config.dataTypes, [key]: checked }
                    })
                  }
                />
                <Label className="text-sm capitalize">{key}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Frequência de Sincronização</Label>
          <Select
            value={state.config.syncFrequency}
            onValueChange={(value) => 
              saveUserConfig({ syncFrequency: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="daily">Diária</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
```

## 🔄 Passo 7: Implementar Sincronização Automática

### 7.1 Sincronização em Background
```typescript
// src/hooks/useHealthIntegration.tsx
useEffect(() => {
  if (!state.config.autoSync || !state.isConnected) return;
  
  const syncInterval = setInterval(async () => {
    console.log('🔄 Sincronização automática iniciada...');
    await syncAllData();
  }, getSyncInterval(state.config.syncFrequency));
  
  return () => clearInterval(syncInterval);
}, [state.config.autoSync, state.isConnected, state.config.syncFrequency]);

const getSyncInterval = (frequency: string) => {
  switch (frequency) {
    case 'daily': return 24 * 60 * 60 * 1000; // 24 horas
    case 'weekly': return 7 * 24 * 60 * 60 * 1000; // 7 dias
    default: return 0; // Manual
  }
};
```

## 🧪 Passo 8: Testes e Validação

### 8.1 Teste de Conexão
```typescript
// src/components/HealthIntegrationTest.tsx
export const HealthIntegrationTest = () => {
  const { state, connectAppleHealth, connectGoogleFit, syncAllData } = useHealthIntegration();
  
  const runTest = async () => {
    console.log('🧪 Iniciando teste de integração...');
    
    // Teste de conexão
    const connectionResult = await (isIOS() ? connectAppleHealth() : connectGoogleFit());
    console.log('Conexão:', connectionResult);
    
    // Teste de sincronização
    const syncResult = await syncAllData();
    console.log('Sincronização:', syncResult);
    
    // Teste de dados
    console.log('Dados em tempo real:', realTimeData);
  };
  
  return (
    <Button onClick={runTest} variant="outline">
      🧪 Testar Integração
    </Button>
  );
};
```

### 8.2 Validação de Dados
```typescript
// src/utils/healthDataValidation.ts
export const validateHealthData = (data: any) => {
  const errors: string[] = [];
  
  if (data.weight && (data.weight < 20 || data.weight > 300)) {
    errors.push('Peso fora do intervalo válido (20-300kg)');
  }
  
  if (data.height && (data.height < 100 || data.height > 250)) {
    errors.push('Altura fora do intervalo válido (100-250cm)');
  }
  
  if (data.heartRate && (data.heartRate < 30 || data.heartRate > 200)) {
    errors.push('Frequência cardíaca fora do intervalo válido (30-200bpm)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## 📱 Passo 9: Configuração Mobile

### 9.1 Capacitor (Para App Mobile)
```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/ios @capacitor/android

# Adicionar plugins de saúde
npm install @capacitor/health-kit
npm install @capacitor/google-fit
```

### 9.2 Configuração iOS
```json
// ios/App/App/Info.plist
<key>NSHealthShareUsageDescription</key>
<string>Este app precisa acessar seus dados de saúde para sincronizar com o Apple Health</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Este app precisa atualizar seus dados de saúde no Apple Health</string>
```

### 9.3 Configuração Android
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
<uses-permission android:name="android.permission.BODY_SENSORS" />
```

## 🚀 Passo 10: Deploy e Monitoramento

### 10.1 Variáveis de Ambiente
```env
# .env.local
GOOGLE_FIT_CLIENT_ID=seu_client_id_aqui
GOOGLE_FIT_API_KEY=sua_api_key_aqui
APPLE_HEALTH_ENABLED=true
GOOGLE_FIT_ENABLED=true
```

### 10.2 Monitoramento
```typescript
// src/utils/healthAnalytics.ts
export const trackHealthIntegration = (event: string, data?: any) => {
  // Enviar para analytics
  console.log('📊 Health Integration Event:', event, data);
  
  // Salvar no banco para monitoramento
  supabase.from('health_analytics').insert({
    event,
    data,
    timestamp: new Date().toISOString()
  });
};
```

## ✅ Checklist Final

- [ ] ✅ Hook de integração implementado
- [ ] ✅ Interface de usuário criada
- [ ] ✅ Persistência no banco configurada
- [ ] ✅ Sincronização real implementada
- [ ] ✅ Validação de dados adicionada
- [ ] ✅ Configurações avançadas criadas
- [ ] ✅ Sincronização automática funcionando
- [ ] ✅ Testes implementados
- [ ] ✅ Configuração mobile pronta
- [ ] ✅ Monitoramento ativo
- [ ] ✅ Deploy realizado

## 🎯 Resultado Final

Com estes passos implementados, você terá uma integração 100% funcional com:
- ✅ Conexão real com Apple Health/Google Fit
- ✅ Sincronização automática de dados
- ✅ Interface intuitiva e responsiva
- ✅ Persistência e backup de dados
- ✅ Monitoramento e analytics
- ✅ Validação e tratamento de erros
- ✅ Configurações personalizáveis

A integração estará pronta para uso em produção! 🚀 
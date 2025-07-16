// @ts-expect-error - Tipos de react-ga4 podem não estar instalados
import ReactGA from 'react-ga4';
// @ts-expect-error - Tipos de react-hotjar podem não estar instalados
import { hotjar } from 'react-hotjar';

let isInitialized = false;

/**
 * Inicializa Google Analytics e Hotjar usando variáveis de ambiente.
 * Necessário definir VITE_GA_ID, VITE_HOTJAR_ID e opcionalmente VITE_HOTJAR_SV.
 */
export function initAnalytics() {
  if (isInitialized) return;

  const gaId = import.meta.env.VITE_GA_ID as string | undefined;
  if (gaId) {
    ReactGA.initialize(gaId);
  }

  const hjId = import.meta.env.VITE_HOTJAR_ID as string | undefined;
  const hjSvRaw = import.meta.env.VITE_HOTJAR_SV as string | undefined;
  const hjSv = hjSvRaw ? parseInt(hjSvRaw, 10) : 6; // Versão padrão do script
  if (hjId) {
    hotjar.initialize(parseInt(hjId, 10), hjSv);
  }

  isInitialized = true;
}

/**
 * Envia um page-view para o Google Analytics.
 * @param path Caminho da página (pathname + search)
 */
export function trackPageView(path: string) {
  if (!isInitialized) return;
  ReactGA.send({ hitType: 'pageview', page: path });
} 
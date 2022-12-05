import { InjectionToken } from '@angular/core';
import { Gtag, ConfigParams, CustomParams } from './gtag-definitions';

export interface GtagConfig {

  targetId: string; // gtag('config', 'targetId', configInfo )
  configInfo?: ConfigParams;
  setParams?: CustomParams; // gtag('set', setParams)
  moreIds?: string[];
}

export const GtagConfigToken = new InjectionToken<GtagConfig>('wizdm.gtag.config');

/** Reproduces the standard code snippet we would paste in index.html
 * @see: https://developers.google.com/analytics/devguides/collection/gtagjs */
export function gtagFactory(config: GtagConfig): Gtag {

  if((window as any).gtag) { return (window as any).gtag; }

  const script = document.createElement('script');

  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.targetId;
  script.type = 'text/javascript';
  script.async = true;
 
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args:any){ (window as any).dataLayer.push(arguments);}

  gtag('js', new Date());

  gtag('config', config.targetId, { send_page_view: false, ...config.configInfo });

  ('setParams' in config) && gtag('set', config.setParams );

  ('moreIds' in config) && config.moreIds ? config.moreIds.forEach( id => gtag('config', id) ) : "";

  return (window as any).gtag = gtag;
}
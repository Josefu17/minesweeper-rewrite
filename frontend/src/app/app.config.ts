import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { IconRegistryService } from './services/icon-registry.service'
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader'
import { provideTranslateService } from '@ngx-translate/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),

    // translation
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
    }),

    // icon registry
    provideAppInitializer(() => {
      const registry = inject(IconRegistryService)
      registry.registerIcons()
    }),
  ],
}

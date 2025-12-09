import { TranslateModule } from '@ngx-translate/core'
import { MatIconRegistry } from '@angular/material/icon'
import { FakeMatIconRegistry } from '@angular/material/icon/testing'

export const COMMON_TEST_IMPORTS = [TranslateModule.forRoot()]
export const COMMON_TEST_PROVIDERS = [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }]

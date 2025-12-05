import { inject, Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

interface IconConfig {
  iconName: string // The filename part (e.g., 'videogame_asset')
  alias?: string // The optional alias (e.g., 'controller')
}

@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
  private readonly registry = inject(MatIconRegistry)
  private readonly sanitizer = inject(DomSanitizer)

  public registerIcons() {
    const icons: IconConfig[] = [
      { iconName: 'add' },
      { iconName: 'close' },
      { iconName: 'flag' },
      { iconName: 'flag_2' },
      { iconName: 'info' },
      { iconName: 'leaderboard' },
      { iconName: 'refresh' },
      { iconName: 'remove' },
      { iconName: 'timer' },
      { iconName: 'trophy' },

      { iconName: 'bomb', alias: 'bomb' },
      { iconName: 'explosion', alias: 'mine' },
      { iconName: 'favorite', alias: 'lives' },
      { iconName: 'sentiment_calm', alias: 'diff-easy' },
      { iconName: 'sentiment_neutral', alias: 'diff-medium' },
      { iconName: 'sentiment_very_dissatisfied', alias: 'diff-hard' },
      { iconName: 'tune', alias: 'diff-custom' },
      { iconName: 'videogame_asset', alias: 'controller' },
    ]

    icons.forEach((config) => {
      const alias = config.alias ?? config.iconName
      const url = `assets/icons/${config.iconName}_24dp.svg`

      this.registry.addSvgIcon(alias, this.sanitizer.bypassSecurityTrustResourceUrl(url))
    })
  }
}

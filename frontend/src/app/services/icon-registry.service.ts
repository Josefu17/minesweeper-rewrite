import {inject, Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

interface IconConfig {
  iconName: string; // The filename part (e.g., 'videogame_asset')
  name?: string;    // The optional alias (e.g., 'controller')
}

@Injectable({
  providedIn: 'root'
})
export class IconRegistryService {
  private readonly registry = inject(MatIconRegistry)
  private readonly sanitizer = inject(DomSanitizer)

  public registerIcons() {
    const icons: IconConfig[] = [
      {iconName: 'add'},
      {iconName: 'flag'},
      {iconName: 'flag_2'},
      {iconName: 'remove'},
      {iconName: 'info'},

      {iconName: 'videogame_asset', name: 'controller'},
      {iconName: 'explosion', name: 'mine'},
      {iconName: 'favorite', name: 'lives'},
      {iconName: 'bomb', name: 'bomb'},
    ]

    icons.forEach(config => {
      const alias = config.name ?? config.iconName;
      const url = `assets/icons/${config.iconName}_24dp.svg`;

      this.registry.addSvgIcon(
        alias,
        this.sanitizer.bypassSecurityTrustResourceUrl(url)
      );
    });
  }
}

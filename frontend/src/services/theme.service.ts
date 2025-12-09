import { effect, Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkMode = signal<boolean>(this.getInitialState())

  constructor() {
    effect(() => {
      const isDark = this.darkMode()

      if (isDark) {
        document.body.classList.add('dark-theme')
      } else {
        document.body.classList.remove('dark-theme')
      }

      localStorage.setItem('darkMode', JSON.stringify(isDark))
    })
  }

  toggle() {
    this.darkMode.update((val) => !val)
  }

  private getInitialState(): boolean {
    const saved = localStorage.getItem('darkMode')
    if (saved != null) {
      return JSON.parse(saved)
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}

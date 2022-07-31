import { Level } from "./level"

export type ThemeResourceType = {
  id: number
  name: string
  utilisations: number
}

export type InternalThemeResourceFile = {
  name: string
  path?: string
  url?: string
  file?: File
}

export type ExternalThemeResourceFile = {
  url: string
}

export type ThemeResourceFile = InternalThemeResourceFile | ExternalThemeResourceFile

export type ThemeResource = {
  uuid: string
  date: string
  name: string,
  correction: boolean,
  message: string,
  content: ThemeResourceFile[],
  type: string,
  visible: boolean,
}

export type Theme = {
  name: string
  description: string
  uuid: string
  level: Level
  visible: boolean
}

export class SchoolProgram {
  themesByLevel = new Map<Level, Theme[]>()

  constructor() {
    Level.LEVELS.forEach(level => {
      this.themesByLevel.set(level, [])
    })
  }

  add(level: Level, theme: Theme) {
    this.themesByLevel.get(level)!!.push(theme)
  }

  get(level: Level): Theme[] {
    return this.themesByLevel.get(level) ?? []
  }

  find(condition: (theme: Theme) => boolean): Theme | null {
    for (const themes of this.themesByLevel.values()) {
      for (const theme of themes) {
        if (condition(theme)) {
          return theme
        }
      }
    }

    return null
  }

  contains(uuid: string): boolean {
    for (const themes of this.themesByLevel.values()) {
      for (const theme of themes) {
        if (theme.uuid === uuid) {
          return true
        }
      }
    }

    return false
  }

  updateTheme(uuid: string, newTheme: Theme) {
    const theme = this.find(theme => theme.uuid === uuid)

    if (!theme) {
      throw new Error(`Theme ${uuid} not found`)
    }

    // First we change the location of the theme in the map
    if (theme.level !== newTheme.level) {
      this.themesByLevel.get(theme.level)!.splice(
        this.themesByLevel.get(theme.level)!.indexOf(theme),
        1
      )
      this.themesByLevel.get(newTheme.level)!.push(theme)
    }

    // Then we update the theme
    theme.name = newTheme.name
    theme.description = newTheme.description
    theme.level = newTheme.level
    theme.visible = newTheme.visible
    theme.numberOfExercises = newTheme.numberOfExercises
    theme.numberOfInterrogations = newTheme.numberOfInterrogations
    theme.numberOfCorrections = newTheme.numberOfCorrections
  }

  deleteTheme(uuid: string) {
    for (const themes of this.themesByLevel.values()) {
      for (let i = 0; i < themes.length; i++) {
        if (themes[i].uuid === uuid) {
          themes.splice(i, 1)
          return
        }
      }
    }

    throw new Error(`Theme ${uuid} not found`)
  }

  clone(): SchoolProgram {
    const program = new SchoolProgram()
    for (const [level, themes] of this.themesByLevel) {
      program.themesByLevel.set(level, themes.map(theme => ({ ...theme })))
    }
    return program
  }
}

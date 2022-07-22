import { Level } from "./level"

export enum ThemeResourceType {
  EXERCISES = 0,
  INTERROGATION = 1,
  OTHER = 2
}

export type ThemeResource = {
  name: string,
  message?: string,
  internalResource: boolean,
  contentURL?: string,
  type: ThemeResourceType,
}

export type Theme = {
  name: string
  description: string
  uuid: string
  numberOfExercises: number
  numberOfInterrogations: number
  numberOfCorrections: number
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
}

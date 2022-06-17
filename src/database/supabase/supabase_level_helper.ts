import { Level } from '../interface/level'

export class SupabaseLevelHelper {
  /**
   * Return the level from the id in the database
   */
  static getLevelById(id: number): Level {
    switch (id) {
      case 1:
        return Level.SIXIEME
      case 2:
        return Level.CINQUIEME
      case 3:
        return Level.QUATRIEME
      case 4:
        return Level.TROISIEME
      case 5:
        return Level.SECONDE
      case 6:
        return Level.PREMIERE
      case 7:
        return Level.TERMINALE
      default:
        throw Error(`Unknwon level of id ${id}`)
    }
  }

  /**
   * Return the id in the database from the level
   */
  static getIdByLevel(level: Level): number {
    switch (level.index) {
      case Level.SIXIEME.index:
        return 1
      case Level.CINQUIEME.index:
        return 2
      case Level.QUATRIEME.index:
        return 3
      case Level.TROISIEME.index:
        return 4
      case Level.SECONDE.index:
        return 5
      case Level.PREMIERE.index:
        return 6
      case Level.TERMINALE.index:
        return 7
      default:
        throw Error(`Unknwon level, ${level}`)
    }
  }
}

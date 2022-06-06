import { Level } from "../interface/level";

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
        switch (level) {
            case Level.SIXIEME:
                return 1
            case Level.CINQUIEME:
                return 2
            case Level.QUATRIEME:
                return 3
            case Level.TROISIEME:
                return 4
            case Level.SECONDE:
                return 5
            case Level.PREMIERE:
                return 6
            case Level.TERMINALE:
                return 7
            default:
                throw Error(`Unknwon level, ${level}`)
        }
    }
}

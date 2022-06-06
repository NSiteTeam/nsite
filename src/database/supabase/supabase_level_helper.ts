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
}

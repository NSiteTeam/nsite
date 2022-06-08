/**
 * As they just have sense in the french school system, we wrote them in french.
 */
 export class Level {
    fullName: string
    abbreviated: string
    index: number
    nameInURL: string

    static SIXIEME = new Level('Sixième', 'sixieme', '6ème', 0)
    static CINQUIEME = new Level('Cinquième', 'cinquieme', '5ème', 1)
    static QUATRIEME = new Level('Quatrième', 'quatrieme', '4ème', 2)
    static TROISIEME = new Level('Troisième', 'troisieme', '3ème', 3)
    static SECONDE = new Level('Seconde', 'seconde', '2nd', 4)
    static PREMIERE = new Level('Première', 'premiere', '1ère', 5)
    static TERMINALE = new Level('Terminale', 'terminale', 'Tal', 6)

    // The levels sorted by their index in ascending order
    static LEVELS = [this.SIXIEME, this.CINQUIEME, this.QUATRIEME, this.TROISIEME, this.SECONDE, this.PREMIERE, this.TERMINALE]

    static levelFromIndex(index: number) {
        for (let level of this.LEVELS) {
            if (level.index == index) {
                return level
            }
        }

        console.log('No level of index', index)
        return null
    }

    static levelFromNameInURL(nameInURL: string) {
        for (let level of this.LEVELS) {
            if (level.nameInURL == nameInURL) {
                return level
            }
        }

        console.log('No level of name in URL', nameInURL)
        return null
    }

    constructor(fullName: string, nameInURL: string, abbreviated: string, index: number) {
        this.fullName = fullName
        this.nameInURL = nameInURL
        this.abbreviated = abbreviated
        this.index = index
    }
}

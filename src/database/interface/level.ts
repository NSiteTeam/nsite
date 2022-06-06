/**
 * As they just have sense in the french school system, we wrote them in french.
 */
 export class Level {
    fullName: string
    abbreviated: string
    index: number

    static SIXIEME = new Level('Sixième', '6ème', 0)
    static CINQUIEME = new Level('Cinquième', '5ème', 1)
    static QUATRIEME = new Level('Quatrième', '4ème', 2)
    static TROISIEME = new Level('Troisième', '3ème', 3)
    static SECONDE = new Level('Seconde', '2nd', 4)
    static PREMIERE = new Level('Première', '1ère', 5)
    static TERMINALE = new Level('Terminale', 'Tal', 6)

    constructor(fullName: string, abbreviated: string, index: number) {
        this.fullName = fullName
        this.abbreviated = abbreviated
        this.index = index
    }
}

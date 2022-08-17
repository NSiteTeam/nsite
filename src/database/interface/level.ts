/**
 * As they just have sense in the french school system, we wrote them in french.
 */
export class School {
  static readonly LYCEE = new School('Lycée', 'lycee')
  static readonly COLLEGE = new School('Collège', 'college')

  static readonly SCHOOLS = [School.COLLEGE, School.LYCEE]

  constructor(
    public readonly name: string,
    public readonly nameInUrl: string,
  ) {}
}

/**
 * As they just have sense in the french school system, we wrote them in french.
 */
export class Level {
  static readonly SIXIEME = new Level('Sixième', 'sixieme', '6ème', School.COLLEGE, 1)
  static readonly CINQUIEME = new Level('Cinquième', 'cinquieme', '5ème', School.COLLEGE, 2)
  static readonly QUATRIEME = new Level('Quatrième', 'quatrieme', '4ème', School.COLLEGE, 3)
  static readonly TROISIEME = new Level('Troisième', 'troisieme', '3ème', School.COLLEGE, 4)
  static readonly SECONDE = new Level('Seconde', 'seconde', '2nd', School.LYCEE, 5)
  static readonly PREMIERE = new Level('Première', 'premiere', '1ère', School.LYCEE, 6)
  static readonly TERMINALE = new Level('Terminale', 'terminale', 'Tal', School.LYCEE, 7)

  // The levels sorted by their index in ascending order
  static LEVELS = [
    this.SIXIEME,
    this.CINQUIEME,
    this.QUATRIEME,
    this.TROISIEME,
    this.SECONDE,
    this.PREMIERE,
    this.TERMINALE,
  ]

  static COLLEGE_LEVELS = [
    this.SIXIEME,
    this.CINQUIEME,
    this.QUATRIEME,
    this.TROISIEME,
  ]

  static LYCEE_LEVELS = [
    this.SECONDE,
    this.PREMIERE,
    this.TERMINALE,
  ]

  static levelFromIndex(index: number) {
    return this.LEVELS.find(level => level.index == index)
  }

  static levelFromNameInURL(nameInURL: string): Level | undefined {
    return this.LEVELS.find(level => level.nameInURL == nameInURL)
  }

  static levelFromName(name: string) {
    return this.LEVELS.find(level => level.fullName == name)
  }


  constructor(
    public readonly fullName: string,
    public readonly nameInURL: string,
    public readonly abbreviated: string,
    public readonly school: School,
    public readonly index: number,
  ) {}
}

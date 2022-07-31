export class Cacheable<T> {
  private cache: T | null = null
  private fetching: boolean = false
  private fetchingPromise: Promise<T> | null = null

  constructor (
    private readonly name: String,
    private readonly fetch: () => Promise<T>,
  ) {}

  public async get(): Promise<T> {
    console.log(`Cache asked for ${this.name}`)

    if (this.cache != null) {
      console.log(`Using cached value for "${this.name}"`)

      return this.cache
    }

    console.log(`No cached value for "${this.name}"`)
    if (!this.fetching) {
      console.log(`Fetching value for "${this.name}"`)

      this.fetching = true
      this.fetchingPromise = this.fetch()

      this.fetchingPromise.then(value => {
        console.log(`Fetched value for "${this.name}"`)

        this.cache = value
        this.fetching = false
        this.fetchingPromise = null
      })
    } else {
      console.log(`Waiting for fetching value for "${this.name}"`)
    }

    return this.fetchingPromise!!
  }

  public invalidate(): void {
    console.log(`Invalidating cache for "${this.name}"`)

    this.cache = null
  }

  public localInit(initialValue: T): void {
    console.log(`Initializing cache by local computing for "${this.name}"`)

    this.cache = initialValue
  }

  public localUpdate(updater: (previousValue: T) => T): void {
    console.log(`Updating cache by local computing for "${this.name}"`)

    if (this.cache != null) {
      this.cache = updater(this.cache)
    }
  }
}

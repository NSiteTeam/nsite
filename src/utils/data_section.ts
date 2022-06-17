import { ref } from "vue"

export class DataSection<T> {
    name: string
    values: T[]
    expanded = ref(true)

    constructor (name: string, values: T[]) {
        this.name = name
        this.values = values
    }

    flipExpansion() {
        this.expanded.value = !this.expanded.value
    }

    static makeSections<T>(dataArray: T[], stringOf: (object: T) => string, sortBy: ((object: DataSection<T>) => number) | undefined = undefined) {
        const dataMap = new Map<string, T[]>()
        for (const dataElement of dataArray) {
            const dataElementKey = stringOf(dataElement)

            if (!dataMap.has(dataElementKey)) {
                dataMap.set(dataElementKey, [])
            }

            dataMap.get(dataElementKey)?.push(dataElement)
        }

        const result: DataSection<T>[] = []

        for (const [key, value] of dataMap.entries()) {
            result.push(new DataSection(
                key,
                value
            ))
        }

        if (sortBy) {
            result.sort((a, b) => sortBy(a) - sortBy(b))
        }

        return result
    }
}

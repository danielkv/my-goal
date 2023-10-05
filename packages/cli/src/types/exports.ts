export type CollectionValue = {
    __collections__?: CollectionData
    [K: string]: any | CollectionValue
}

export type CollectionData = Record<string, CollectionValue>

export class StorageResponse {
    id: number
    name: string
    quantity: number
}

export class StorageLogResponse extends StorageResponse {
    createdAt: Date
}
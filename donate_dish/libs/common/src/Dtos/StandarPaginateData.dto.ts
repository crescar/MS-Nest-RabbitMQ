export class StandarPaginatedData<T> {
    items: T
    page: number
    limit: number
    totalPages: number
    totalItems: number
}
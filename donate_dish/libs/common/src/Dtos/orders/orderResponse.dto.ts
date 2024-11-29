export class StatusOrderResponse {
    id?: number
    name: string
    createdAt?: Date
    updatedAt?: Date
}

export class DishOrderResponse {
    name: string
    description: string
}

export class OrderResponse {
    id: number
    statusId: number
    dish: DishOrderResponse
    status: StatusOrderResponse
}
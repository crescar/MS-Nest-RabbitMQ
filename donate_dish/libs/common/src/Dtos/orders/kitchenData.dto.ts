export class KitchenDataDto {
    orderId: number
    dishId: number
    ingredients: IngredientDto[]
}

export class IngredientDto {
    ingredientId: number
    quantityToPrepared: number
    quantityStorage: number
    name: string
    needToBuy: boolean
}
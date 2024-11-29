
export class IngredientsDishResponse {
    name:string
    quantity:number
}


export class DishResponse {
    id: number
    name: string
    description: string
    ingredients: IngredientsDishResponse[]
}
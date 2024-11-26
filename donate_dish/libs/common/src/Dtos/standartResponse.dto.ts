import { ApiProperty } from "@nestjs/swagger"

export class StandartResponse<T> {
    @ApiProperty()
    status:boolean
    @ApiProperty()
    message:string
    @ApiProperty()
    error: any = undefined
    @ApiProperty()
    data: T
}
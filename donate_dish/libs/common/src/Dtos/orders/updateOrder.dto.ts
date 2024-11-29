import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    statusId: number;
}
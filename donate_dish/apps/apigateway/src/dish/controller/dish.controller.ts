import { microservicesDishConfiguration } from '@app/common/config/ms.config';
import { Controller, Inject, Get,Query, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';

@Controller('dish')
export class DishController {

    constructor(
        @Inject(microservicesDishConfiguration.name) private readonly dishService: ClientProxy
    ){}

    @Get()
    @ApiParam({ name: 'page', required: false })
    @ApiParam({ name: 'limit', required: false })
    @ApiParam({ name: 'search', required: false })
    @ApiResponse({
        status: 200,
        type: StandartResponse<any>
    })
    async getStorage(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string
    ): Promise<StandartResponse<any>> 
    {
        const response = await firstValueFrom(this.dishService.send('get_all_dishes', {page, limit, search}));
        if(response.error) throw new HttpException(response.error, 400);
        return response;
    }
    
}

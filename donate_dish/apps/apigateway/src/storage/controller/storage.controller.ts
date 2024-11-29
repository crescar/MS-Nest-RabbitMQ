import { microservicesStorageConfiguration } from '@app/common/config/ms.config';
import { Controller, Inject, Get, Query, HttpException} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { StorageLogResponse, StorageResponse } from '@app/common/Dtos/storage/storageResponse.dto';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';

@Controller('storage')
export class StorageController {
    constructor(
    @Inject(microservicesStorageConfiguration.name) private readonly storageService: ClientProxy
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
  ): Promise<StandartResponse<StandarPaginatedData<StorageResponse>>> 
  {
    const response = await firstValueFrom(this.storageService.send('get_storage', {page, limit, search}));
    if(response.error) throw new HttpException(response, 400);
    return response;
  }

  @Get('shoppingLogs')
  @ApiParam({ name: 'page', required: false })
  @ApiParam({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    type: StandartResponse<any>
  })
  async shoppingLogs(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<StandartResponse<StandarPaginatedData<StorageLogResponse>>> 
  {
    const response = await firstValueFrom(this.storageService.send('get_shopping_logs', {page, limit} as PaginateParamsDto));
    if(response.error) throw new HttpException(response, 400);
    return response;
  }

}

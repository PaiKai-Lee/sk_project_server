import { Controller, Req, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, FindAllDto } from './dto/index.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('交易清單')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const { id } = req.user;
    const createOrderData = {
      id,
      ...createOrderDto,
    };
    return this.orderService.create(createOrderData);
  }

  @Get()
  findAll(@Query() queryString: FindAllDto) {
    const page = +queryString.page || 1;
    const take = +queryString.limit || 10;
    const skip = (page - 1) * take;
    const include = {
      user: {
        select: {
          name: true,
        },
      },
    };

    return this.orderService.findAll({ skip, take, include });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateOrder } from './interface';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderData: CreateOrder) {
    const { id, data: transferData } = createOrderData;

    await this.prisma.$transaction(async (tx) => {
      // 取得玩家現有金額
      const foundUsersAndPoints = await tx.user.findMany({
        where: {
          id: {
            in: transferData.map((item) => item.id),
          },
        },
        select: {
          id: true,
          points: true,
        },
      });

      //調整金額
      const updatedUsers = foundUsersAndPoints.map((user) => {
        const transferItem = transferData.find((item) => item.id === user.id);
        if (transferItem) {
          user.points += transferItem.save - transferItem.cost;
          return { points: user.points, ...transferItem };
        }
      });

      // 更新金額
      const updatePromise = updatedUsers.map((user) =>
        tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            points: user.points,
          },
        }),
      );
      await Promise.all(updatePromise);

      // 產生交易紀錄
      const createTransactions = updatedUsers.map((user) => {
        return {
          userId: user.id,
          save: user.save,
          cost: user.cost,
          remark: user.remark,
        };
      });

      // 不知道為什麼prisma ts 錯誤
      await tx.order.create({
        //@ts-ignore
        data: {
          createdById: id,
          transaction: {
            create: createTransactions,
          },
        },
      });
    });
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

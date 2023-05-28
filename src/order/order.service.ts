import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/lib/services/prisma.service';
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
            in: transferData.map((item) => item.id)
          }
        },
        select: {
          id: true,
          points: true
        }
      });

      //調整金額
      let updatedUsers = foundUsersAndPoints.map((user) => {
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
            id: user.id
          },
          data: {
            points: user.points
          }
        })
      );
      await Promise.all(updatePromise);

      // 產生交易紀錄
      const createTransactions = updatedUsers.map((user) => {
        return {
          userId: user.id,
          save: user.save,
          cost: user.cost,
          remark: user.remark
        };
      });

      // TODO 更新時間處理
      // 不知道為什麼prisma ts 錯誤
      await tx.order.create({
        //@ts-ignore
        data: {
          createdById: id,
          transaction: {
            create: createTransactions
          }
        }
      });
    });
    return 'This action adds a new order';
  }

  findAll(params: { skip?: number; take?: number; include?: Prisma.OrderInclude }) {
    const { skip, take, include } = params;
    return this.prisma.order.findMany({
      skip,
      take,
      include,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        },
        transaction: {
          select: {
            id: true,
            save: true,
            cost: true,
            remark: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      where: {
        id
      }
    });
  }
}

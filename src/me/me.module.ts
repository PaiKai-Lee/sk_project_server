import { Module, UnsupportedMediaTypeException } from '@nestjs/common';
import { MeController } from './me.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/lib/services/prisma.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './public/upload',
  filename: (req, file, callback) => {
    const { name, id } = req.user;
    const uniqueName = name.toLowerCase() + id + '-' + Math.random().toString(36).slice(2, 7);
    const extension = extname(file.originalname);
    callback(null, `${uniqueName}${extension}`);
  }
});

@Module({
  controllers: [MeController],
  imports: [
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          storage,
          fileFilter: (req, file, callback) => {
            const acceptType = ['image/jpeg', 'image/jpg', 'image/png'];
            if (acceptType.includes(file.mimetype)) {
              callback(null, true);
            } else {
              callback(new UnsupportedMediaTypeException('mimeType Error'), false);
            }
          },
          limits: {
            fileSize: parseInt(configService.get('AVATAR_SIZE'))
          }
        };
      },
      inject: [ConfigService]
    })
  ],
  providers: [UserService, PrismaService, TransactionService]
})
export class MeModule {}

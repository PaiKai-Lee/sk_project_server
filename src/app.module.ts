import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './lib/services/auth.service';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './lib/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { MeModule } from './me/me.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    OrderModule,
    TransactionModule,
    UserModule,
    AdminModule,
    MeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      serveRoot: '/',
      rootPath: join(__dirname, '../../', 'public'),
      serveStaticOptions: {
        index: false
      }
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5h' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { Admin } from './modules/auth/entities/admin.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Product } from './modules/products/entities/product.entity';
import { Media } from './modules/media/entities/media.entity';
import { Store } from './modules/stores/entities/store.entity';
import { Enquiry } from './modules/enquiries/entities/enquiry.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { StorageModule } from './modules/storage/storage.module';
import { MediaModule } from './modules/media/media.module';
import { StoresModule } from './modules/stores/stores.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        if (url) {
          return {
            type: 'postgres',
            url,
            autoLoadEntities: true,
            synchronize: true,
            entities: [Admin, Category, Product, Media, Store, Enquiry],
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST', 'localhost'),
          port: Number(configService.get<number>('DATABASE_PORT', 5433)),
          username: configService.get<string>('DATABASE_USER', 'postgres'),
          password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
          database: configService.get<string>('DATABASE_NAME', 'savitri_db'),
          autoLoadEntities: true,
          synchronize: true,
          entities: [Admin, Category, Product, Media, Store, Enquiry],
        };
      },
    }),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    StorageModule,
    MediaModule,
    StoresModule,
    EnquiriesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT Authentication Guard (secures all routes unless decorated with @Public())
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Role-Based Authorization Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global API Response Serialization Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Global Centralized Exception Filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

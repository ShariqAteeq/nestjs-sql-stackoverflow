import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          username: process.env.DB_USERNAME,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          entities: [__dirname + '/../**/entities/*{.js,.ts}'],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseOrmModule {}

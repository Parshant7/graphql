import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "users", schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}

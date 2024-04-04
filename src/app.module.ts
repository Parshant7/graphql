import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/schemas/user.schema';
// import { UserResolver } from './user/user.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: {
        settings: {
          'request.credentials': 'include', // Otherwise cookies won't be sent
        },
      },
      cors: {
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      },
      context: ({ req, res }) => ({ req, res }),
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    JwtModule.register({
      global: true,
      secret: 'this is the secret key',
      signOptions: { expiresIn: '2m' },
    }),
    MongooseModule.forRoot('mongodb://localhost/graphql'),
    UserModule,
  ],
  controllers: [],
  // providers: [UserResolver],
})
export class AppModule {}

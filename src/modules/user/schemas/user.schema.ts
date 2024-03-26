import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Schema()
class User {
  @Prop()
  email: string;
  @Prop()
  username: string;
  @Prop()
  lastDate: Date;
  @Prop()
  role: number;
  @Prop()
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
export type UserModel = Model<UserDocument>;

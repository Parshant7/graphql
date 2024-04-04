import { Schema } from 'mongoose';
import { role } from '../enums/role.enum';

export const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  role: {
    type: String,
    enum: role
  },
  password: String,
})
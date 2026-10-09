import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { encrypt, decrypt } from '../../common/utils/crypto.util';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'users',
  toJSON: { getters: true },
  toObject: { getters: true },
})
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  user_id: string; // UUID, hyphens stripped

  @Prop({ required: true, unique: true, index: true, lowercase: true })
  email: string;

  @Prop({ required: false, select: false })
  password_hash: string;



  @Prop({ required: true, default: 'local' })
  provider: string; // "local" | etc.

  @Prop({ required: true, default: false })
  email_verified: boolean;

  @Prop({ required: true, default: 'student' })
  role: string; // "student" | "admin"

  @Prop({ required: true, get: decrypt, set: encrypt })
  full_name: string;

  @Prop({ required: true, default: 0 })
  failed_login_attempts: number;

  @Prop({ required: false, type: Date })
  locked_until?: Date;

  @Prop({ required: false, type: Date })
  last_login?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfessionDocument = HydratedDocument<Confession>;

@Schema()
export class Confession {
  @Prop()
  message: string;
}

export const ConfessionSchema = SchemaFactory.createForClass(Confession);

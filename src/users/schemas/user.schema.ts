import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MqttOptions } from 'src/mqtt/schemas/mqttOptions.schema';
import { Template } from 'src/templates/schemas/template.schema';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: String, default: uuidv4 })
    _id: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop([{type: String, ref: Template.name}])
    templates: Template[];

    @Prop([{type: String, ref: MqttOptions.name}])
    mqttOptions: MqttOptions[];

    @Prop()
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

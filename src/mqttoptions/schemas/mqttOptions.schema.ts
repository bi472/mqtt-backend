import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MqttOptionsDocument = MqttOptions & Document;

@Schema()
export class MqttOptions {
    @Prop({ type: String, default: uuidv4 })
    _id;

    @Prop({ required: true, type: String })
    host;

    @Prop({ required: true, type: Number})
    port;

    @Prop({ type: String })
    username;

    @Prop({ type: String })
    password;

    @Prop({ type: Boolean })
    sslConnection;

    @Prop({ type: String})
    connectionType;
}

export const MqttOptionsSchema = SchemaFactory.createForClass(MqttOptions);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TemplateDocument = Template & Document;

@Schema()
export class Template {
    @Prop({ type: String, default: uuidv4 })
    _id: string;

    @Prop({required: true, type: String, default: 'template_name'})
    templateName: string;

    @Prop()
    topic: string;

    @Prop()
    message: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
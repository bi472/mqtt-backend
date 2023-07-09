import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TemplateDto {
    @ApiProperty()
    templateName: string;
    @ApiProperty()
    topic: string;
    @ApiPropertyOptional()
    message: string;
}
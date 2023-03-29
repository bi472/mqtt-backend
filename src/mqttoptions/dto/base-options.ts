import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class MqttOptionsDto {
    @ApiProperty()
    @IsNotEmpty({message: 'Please enter hostname'})
    host: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Please enter port'})
    port: number;

    @ApiPropertyOptional()
    username?: string;

    @ApiPropertyOptional()
    password?: string;
    
    @ApiPropertyOptional()
    sslConnection?: boolean;

    @ApiPropertyOptional()
    connectionType?: string;
}
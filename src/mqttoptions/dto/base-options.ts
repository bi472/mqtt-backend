import { IsNotEmpty } from "class-validator";

export class MqttOptionsDto {
    @IsNotEmpty({message: 'Please enter hostname'})
    host: string;

    @IsNotEmpty({message: 'Please enter port'})
    port: number;

    @IsNotEmpty({message: 'Please enter username'})
    username: string;

    @IsNotEmpty({message: 'Please enter password'})
    password: string;
    
    sslConnection: boolean;

    connectionType: string;
}
export class CreateUserDto {
    username: string;
    password: string;
    templates: string[];
    refreshToken: string;
}
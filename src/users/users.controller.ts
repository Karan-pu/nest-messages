import { Body, Controller, Post, Get, Query, Delete, Param, Patch, NotFoundException, Session } from '@nestjs/common';
import { CreateUserDto } from './Dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './Dto/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './Dto/user.dto';
import { authServices } from './auth.service';
import { retry } from 'rxjs';

@Controller('auth')
export class UsersController {
    constructor(private userService: UsersService, private authService: authServices) {}
    
    @Serialize(UserDto)
    @Get('/users')
    getAllUsers () {
        return this.userService.findAllUsers();
    }

    @Post('/signup')
    async createUser (@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Serialize(UserDto)
    @Post('/signin')
    async loginUser (@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;
        return user; 
    }

    @Get('/identity')
    identity(@Session() session:any) {
        return this.userService.findOne(session.userId);
    }

    @Serialize(UserDto)
    @Get('/:id')
    async findUser (@Param('id') id:string) {
        console.log("Handler is working");
        const user = this.userService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found');
        } 
        return user;
    }
    @Serialize(UserDto)
    @Get()
    findUserViaEmail (@Query('email') email: string){
        return this.userService.find(email);
    }
    
    @Delete('/:id')
    deleteUser (@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Delete()
    deleteAllUsers () {
        return this.userService.removeAll();
    }

    @Patch('/:id')
    updateUser (@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }
    
}   

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(
    @Body('password') password: string,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('role') role: number,
  ): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const result = await this.userService.createUser(
      username,
      hashedPassword,
      email,
      role,
    );
    return result;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch()
  async update(@Body() updateUserDto: any) {
    console.log(updateUserDto, 'updateUserDto');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      updateUserDto.password,
      saltOrRounds,
    );
    updateUserDto.password = hashedPassword;
    return this.userService.update(updateUserDto);
  }

  @Delete()
  remove(@Body() userToDelete: any) {
    if (!Array.isArray(userToDelete)) userToDelete = [userToDelete];
    return this.userService.remove(userToDelete);
  }
}

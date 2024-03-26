import { Injectable, Logger } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(username: string, password: string, email: string, role: number): Promise<User> {
        return this.userModel.create({
            username,
            password,
            email,
            role,
        });
    }

    async createSuperUser(username: string, temppassword: string, email: string, role: number): Promise<User> {
        const saltOrRounds = 10;
        const password = await bcrypt.hash(temppassword, saltOrRounds);
        return this.userModel.create({
            username,
            password,
            email,
            role,
        });
    }

    async getUser(query: object): Promise<User> {
        return this.userModel.findOne(query);
    }

    async updateJournalDay(username: string) {
        Logger.log('************* username *************');
        console.log(username);
        const filter = { username: username };
        const update = { $set: { lastDate: new Date() } };

        return await this.userModel.updateOne(filter, update);
    }

    async countWhere(query: any) {
        return this.userModel.count(query);
    }

    findAll() {
        return this.userModel.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(updateUserDto: any) {
        const filter = { username: updateUserDto.username };
        return this.userModel.updateOne(filter, updateUserDto);
    }

    remove(username: any) {
        const filter = { username: { $in: username } };
        return this.userModel.deleteMany(filter);
    }
}

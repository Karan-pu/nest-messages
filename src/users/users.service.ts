import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {
    }
    create(email: string, password: string) {
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneBy({id});
    }
    
    find(email: string) {
        return this.repo.find({where: {email}});
    }

    findAllUsers() {
        return this.repo.find();
    }

    async update(id: number, attr: Partial<UserEntity>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error("User not found");
        } 
        Object.assign(user, attr)
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.repo.findOneBy({id});
        if (!user) {
            throw new error("user not found");
        }
        return this.repo.remove(user);
    }

    async removeAll() {
        const user = await this.repo.find();
        return this.repo.remove(user);
    }
    
    

}

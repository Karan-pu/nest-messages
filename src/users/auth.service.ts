import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class authServices {
    constructor (private userServices: UsersService) {}

    async signup(email: string, password: string) {
        const usermail = await this.userServices.find(email);
        if (usermail.length) {
            throw new BadRequestException('email in use');
        }
        const salt = randomBytes(8).toString('hex');
        const hash = (await(scrypt(password, salt, 32)) as Buffer).toString("hex") 
        const result = salt + '.' + hash;
        const user = await this.userServices.create(email, result);
        return user;
    }

    async signIn(email: string, password: string) {
        const [user] = await this.userServices.find(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        const[salt, storedHash] = user.password.split('.');
        const hash = (await(scrypt(password, salt, 32)) as Buffer).toString("hex");
        if (hash == storedHash) {
            return user;
        } else {
            throw new BadRequestException("wrong password");
        }
    }
}      

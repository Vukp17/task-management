import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredientialsDto } from './dto/auth-credientials.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) // NOTICE: here
        private userRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }


    async createUser(authCredientials: AuthCredientialsDto): Promise<void> {
        const { username, password } = authCredientials;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({ username, password: hashedPassword });
        try {
            await this.userRepository.save(user);

        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('User name already exists')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signUp(authCredientials: AuthCredientialsDto): Promise<void> {
        await this.createUser(authCredientials);
        console.log(authCredientials);
    }
    async signIn(authCredientials: AuthCredientialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredientials;
        console.log(username)
        const user = await this.userRepository.findOne({
            where: {
                username
            }
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.sign(payload)
            return { accessToken };
        } else {
            throw new UnauthorizedException("pleas check your login credinetials");
        }
    }
    
}

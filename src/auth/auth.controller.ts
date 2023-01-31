import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredientialsDto } from './dto/auth-credientials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){

    }
   @Post('/signup')
   signUp(@Body() authCredientialsDto:AuthCredientialsDto):Promise<void> {
    return this.authService.signUp(authCredientialsDto);
   }

   @Post('/signin')
   signIn(@Body() authCredientialsDto:AuthCredientialsDto):Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredientialsDto);
   }
   @Post('/test')
   @UseGuards(AuthGuard())
   test(@Req() req){
    console.log(req);
   }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserTokenService } from './user-token.service';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { UpdateUserTokenDto } from './dto/update-user-token.dto';

@Controller('user-token')
export class UserTokenController {
  constructor(private readonly userTokenService: UserTokenService) {}

  @Post()
  create(@Body() createUserTokenDto: CreateUserTokenDto) {
    return this.userTokenService.create(createUserTokenDto);
  }

  @Get()
  findAll() {
    return this.userTokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userTokenService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserTokenDto: UpdateUserTokenDto,
  ) {
    return this.userTokenService.update(id, updateUserTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userTokenService.remove(id);
  }
}

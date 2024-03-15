import {UsersDTO} from './UsersDTO';

export class JwtResponse{
  token: string;
  type: string;
  usersDTO: UsersDTO;

  constructor(token: string, type: string, usersDTO: UsersDTO) {
    this.token = token;
    this.type = type;
    this.usersDTO = usersDTO;
  }
}

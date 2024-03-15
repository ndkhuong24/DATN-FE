export class SignUpRepquest{
  fullname: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  description: string;
  role: string;
  idel: number;

  constructor(fullname: string, username: string, password: string, email: string, phone: string, birthday: string, gender: string, description: string, role: string, idel: number) {
    this.fullname = fullname;
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.birthday = birthday;
    this.gender = gender;
    this.description = description;
    this.role = role;
    this.idel = idel;
  }
}

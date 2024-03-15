export class SignUpRepquest {
  fullname: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  role: string;

  constructor(fullname: string, username: string, password: string, email: string, phone: string, birthday: string, gender: string, role: string) {
    this.fullname = fullname;
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.birthday = birthday;
    this.gender = gender;
    this.role = role;
  }
}

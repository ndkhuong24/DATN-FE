export class CustomerSalesDTO {
  id: number;
  code: string;
  fullname: string;
  birthday: string;
  gender: string;
  phone: string;
  email: string;
  username: string;

  constructor(id: number, code: string, fullname: string, birthday: string, gender: string, phone: string, email: string, username: string) {
    this.id = id;
    this.code = code;
    this.fullname = fullname;
    this.birthday = birthday;
    this.gender = gender;
    this.phone = phone;
    this.email = email;
    this.username = username;
  }
}

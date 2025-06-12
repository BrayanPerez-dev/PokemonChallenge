import { FormControl } from "@angular/forms";

export interface IUserForm {
  name: FormControl<string>;
  birthday: FormControl<string>;
  dui: FormControl<string>;
  minority_card:FormControl<string>;
}
export interface IUser {
  name: string;
  birthday: string;
  dui?: string | null;
  hobbies?: string[];
  photo: string;
  minority_card?:string | null;
  raw_birthday:string;
}

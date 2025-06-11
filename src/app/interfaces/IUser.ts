import { FormControl } from "@angular/forms";

export interface IUserForm {
  name: FormControl<string>;
  birthday: FormControl<string>;
  dui: FormControl<string>;
}
export interface IUser {
  name: string;
  birthday: string;
  dui: string;
  hobbies?: string[];
  photo: string
}

import { Component, inject, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/IUser';
import { UserInfoService } from '../../services/UserInfo/user-info.service';

@Component({
  selector: 'app-user-info',
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent implements OnInit {
  private userService$ = inject(UserInfoService);
  userInfo:IUser | null = null;
  ngOnInit(): void {
    this.userService$.user$.subscribe((user: IUser | null) => {
      if (user) {
        this.userInfo = user
      } 
    });
  }
}

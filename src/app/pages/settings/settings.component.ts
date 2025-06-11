import { Component, inject, OnInit } from '@angular/core';
import { ProfileSetupHeaderComponent } from '../../components/profile-setup-header/profile-setup-header.component';
import { ProfilePictureComponent } from '../../components/profile-picture/profile-picture.component';
import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { LoadingService } from '../../services/Loading/loading.service';
import { AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading/loading.component';
import { UserInfoService } from '../../services/UserInfo/user-info.service';

@Component({
  selector: 'app-settings',
  imports: [
    ProfileSetupHeaderComponent,
    ProfilePictureComponent,
    UserProfileFormComponent,
    LoadingComponent,
    AsyncPipe,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  loadingService = inject(LoadingService);
  userService = inject(UserInfoService);
  loading$ = this.loadingService.loading$;
  userExists: boolean = false;
  ngOnInit(): void {
    this.userService.user$.subscribe({
      next: (user) => {
        if (user?.name) {
          this.userExists = true;
        } else {
          this.userExists = false;
        }
      },
    });
  }
}

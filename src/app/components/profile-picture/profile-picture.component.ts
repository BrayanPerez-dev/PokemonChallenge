import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { UserInfoService } from '../../services/UserInfo/user-info.service';
import { IUser } from '../../interfaces/IUser';
import { UserInfoComponent } from '../user-info/user-info.component';
import { SelectedPokemonService } from '../../services/SelectedPokemon/selected-pokemon.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile-picture',
  imports: [MatCardModule,ImageUploadComponent,UserInfoComponent,AsyncPipe],
  templateUrl: './profile-picture.component.html',
  styleUrl: './profile-picture.component.scss'
})
export class ProfilePictureComponent {
  private userService = inject(UserInfoService);
  private selectedPokemonService = inject(SelectedPokemonService)

  hasPokemon$ = this.selectedPokemonService.hasThreePokemons$;

  uploadedImageUrl: string = '';
  userInfo:IUser | null = null;

   ngOnInit(): void {
    this.userService.user$.subscribe((user: IUser | null) => {
      if (user) {
        this.userInfo = user
      } 
    });
  }

  onImageUploaded($imageUrl: string) {
    this.uploadedImageUrl = $imageUrl;
  }

}

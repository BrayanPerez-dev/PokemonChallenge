import { Component, inject, OnInit } from '@angular/core';
import { ProfileSetupHeaderComponent } from '../../components/profile-setup-header/profile-setup-header.component';
import { ProfilePictureComponent } from '../../components/profile-picture/profile-picture.component';
import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { LoadingService } from '../../services/Loading/loading.service';
import { AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';
import { UserInfoService } from '../../services/UserInfo/user-info.service';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';
import { ListSavedPokemonComponent } from '../../components/list-saved-pokemon/list-saved-pokemon.component';
import { SelectedPokemonService } from '../../services/SelectedPokemon/selected-pokemon.service';
import { IUser } from '../../interfaces/IUser';
import { ButtonComponent } from '../../components/button/button.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-settings',
  imports: [
    ProfileSetupHeaderComponent,
    ProfilePictureComponent,
    UserProfileFormComponent,
    LoadingComponent,
    PokemonListComponent,
    ListSavedPokemonComponent,
    ButtonComponent,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private userService = inject(UserInfoService);
  private selectedPokemonService = inject(SelectedPokemonService)

  loading$ = this.loadingService.loading$;
  hasPokemon$ = this.selectedPokemonService.hasThreePokemons$;
  
  showStepLabel:boolean = false
  userExists: boolean = false;
  userInfo:IUser | null = null;

  ngOnInit(): void {
    this.userService.user$.subscribe({
      next: (user) => {
        if (user?.name) {
          this.userExists = true;
          this.userInfo = user
        } else {
          this.userExists = false;
        }
      },
    });
    
    this.selectedPokemonService.hasThreePokemons$.subscribe({
      next:(pokemon)=>{
        console.log(pokemon)
        this.showStepLabel = pokemon
      }
    })

  }

}

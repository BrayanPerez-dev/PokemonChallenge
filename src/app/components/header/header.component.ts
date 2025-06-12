import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoService } from '../../services/UserInfo/user-info.service';
import { IUser } from '../../interfaces/IUser';
import { SelectedPokemonService } from '../../services/SelectedPokemon/selected-pokemon.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ButtonComponent, MatIconModule,AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserInfoService);
  private selectedPokemonService = inject(SelectedPokemonService)

  hasPokemon$ = this.selectedPokemonService.hasThreePokemons$;
  userInfo: IUser | null = null;
  ngOnInit(): void {
    this.userService.user$.subscribe((user: IUser | null) => {
      if (user) {
        this.userInfo = user
      }
    });
  }
}

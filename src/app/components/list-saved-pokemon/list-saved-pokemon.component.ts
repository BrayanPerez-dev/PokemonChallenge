import { Component, inject, OnInit } from '@angular/core';
import { SelectedPokemonService } from '../../services/SelectedPokemon/selected-pokemon.service';
import { IPokemon } from '../../interfaces/IPokemon';
import { StatsComponent } from '../stats/stats.component';
import { ButtonComponent } from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-saved-pokemon',
  imports: [StatsComponent,ButtonComponent,MatIconModule],
  templateUrl: './list-saved-pokemon.component.html',
  styleUrl: './list-saved-pokemon.component.scss'
})
export class ListSavedPokemonComponent implements OnInit {
  private selectedPokemonService = inject(SelectedPokemonService)
  pokemon: IPokemon[] = []

  ngOnInit(): void {
     this.selectedPokemonService.selectedPokemons$.subscribe({
      next:(pokemon) => {
        this.pokemon = pokemon;
      },
    });
  }

  setTypes(pokemon:IPokemon):string{
  return  pokemon.types.map((t)=> t.type.name).join('/');
  }
}

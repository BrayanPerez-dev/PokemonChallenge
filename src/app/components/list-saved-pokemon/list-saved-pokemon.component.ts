import { Component, inject, OnInit } from '@angular/core';
import { SelectedPokemonService } from '../../services/SelectedPokemon/selected-pokemon.service';
import { IPokemon } from '../../interfaces/IPokemon';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-list-saved-pokemon',
  imports: [StatsComponent],
  templateUrl: './list-saved-pokemon.component.html',
  styleUrl: './list-saved-pokemon.component.scss'
})
export class ListSavedPokemonComponent implements OnInit {
  private selectedPokemonService = inject(SelectedPokemonService)
  pokemons: IPokemon[] = []

  ngOnInit(): void {
    this.pokemons = this.selectedPokemonService.getSavedPokemons();
    console.log(this.pokemons)
  }

  setTypes(pokemon:IPokemon):string{
  return  pokemon.types.map((t)=> t.type.name).join('/');
  }
}

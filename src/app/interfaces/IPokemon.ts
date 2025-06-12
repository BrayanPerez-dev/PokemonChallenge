
interface sprites{
    other:{
        home:{
            front_default:string
        }
    }
}
export interface IPokemonType {
  slot: number;
  type: {
    name: string;
  };
}
export interface IPokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
  };
}
export interface IPokemon{
  [x: string]: any;
  name:string;
  url:string;
  sprites:sprites;
  stats: IPokemonStat[];
  types: IPokemonType[];
}

export interface IPokemonList{
  results:IPokemon[]
}
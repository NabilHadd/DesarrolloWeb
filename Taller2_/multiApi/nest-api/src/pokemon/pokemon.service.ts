import { Injectable } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';

@Injectable()
export class PokemonService {
    constructor(
        private readonly repository: PokemonRepository
    ){}



    async getPokemons(id: number){
        const pokemon = await this.repository.getPokemon(id)
        return pokemon
    }


    async getTypes(id: number) {
        const types = await this.repository.getTypesPokemon(id);
        const type_ids = types.map(x => x.id_type);

        return Promise.all(
            type_ids.map(idType => this.repository.getType(idType))
        );
    }

    async getAbilities(id: number) {
        const abilities = await this.repository.getAbilitiesPokemon(id);
        const ability_ids = abilities.map(x => x.id_ability);

        return Promise.all(
            ability_ids.map(idAbility => this.repository.getAbility(idAbility))
        );
    }

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PokemonRepository {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async getPokemon(id: number){
        return await this.prisma.pokemon.findUnique({
            where:{
                id: id,
            },
        });
    }


    async getAbilitiesPokemon(id: number){
        return await this.prisma.pokemon_ability.findMany({
            where:{
                id_pokemon: id,
            },
        });
    }

    async getTypesPokemon(id: number){
        return await this.prisma.pokemon_type.findMany({
            where:{
                id_pokemon: id,
            },
        });
    }

    async getType(id_type: number){
        return await this.prisma.type.findUnique({
            where:{
                id: id_type,
            },
        });
    }
        
    
    async getAbility(id_ability: number){
        return await this.prisma.ability.findUnique({
            where:{
                id: id_ability,
            },
        });
    }
}

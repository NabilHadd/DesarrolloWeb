import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getPokemons(@Query('id') id: string) {
    const pokemonId = Number(id); // convertir a número
    return this.pokemonService.getPokemons(pokemonId);
  }

  @Get('tipos')
  getTipos(@Query('id') id: string) {
    const pokemonId = Number(id);
    return this.pokemonService.getTypes(pokemonId);
  }

  @Get('habilidades')
  getHabilidades(@Query('id') id: string) {
    const pokemonId = Number(id);
    return this.pokemonService.getAbilities(pokemonId);
  }
}
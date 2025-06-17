import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  allPokemons: any[] = [];
  limit = 20;
  offset = 0;
  selectedPokemon: any = null;

  constructor(private http: HttpClient) {}


ngOnInit() {
  this.loadPokemons();
  this.loadAllPokemonNames();
}

loadAllPokemonNames() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`;
  this.http.get<any>(url).subscribe((response) => {
    this.allPokemons = response.results.map((pokemon: any) => {
      const id = pokemon.url.split('/').filter(Boolean).pop();
      return {
        name: pokemon.name,
        id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });
  });
}


  loadPokemons() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`;
    this.http.get<any>(url).subscribe((response) => {
      this.pokemons = response.results.map((pokemon: any) => {
        const id = pokemon.url.split('/').filter(Boolean).pop();
        return {
          name: pokemon.name,
          id,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });
      this.allPokemons = [...this.allPokemons, ...this.pokemons];
    });
  }

  nextPage() {
    this.offset += this.limit;
    this.loadPokemons();
  }

  prevPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }

  onLimitChange() {
    this.offset = 0;
    this.allPokemons = [];
    this.loadPokemons();
  }

  filterPokemons() {
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.pokemons = this.allPokemons.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(term) ||
          pokemon.id.toString().includes(term)
      );
    } else {
      this.pokemons = [...this.allPokemons];
    }
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      normal: 'assets/icon/normal.svg',
      fighting: 'assets/icon/fighting.svg',
      flying: 'assets/icon/flying.svg',
      poison: 'assets/icon/poison.svg',
      ground: 'assets/icon/ground.svg',
      rock: 'assets/icon/rock.svg',
      bug: 'assets/icon/bug.svg',
      ghost: 'assets/icon/ghost.svg',
      steel: 'assets/icon/steel.svg',
      fire: 'assets/icon/fire.svg',
      water: 'assets/icon/water.svg',
      grass: 'assets/icon/grass.svg',
      electric: 'assets/icon/electric.svg',
      psychic: 'assets/icon/psychic.svg',
      ice: 'assets/icon/ice.svg',
      dragon: 'assets/icon/dragon.svg',
      dark: 'assets/icon/dark.svg',
      fairy: 'assets/icon/fairy.svg',
      unknown: 'assets/icon/unknown.svg',
    };

    return icons[type as keyof typeof icons] || 'assets/icon/unknown.svg';
  }

  goToDetails(pokemon: any) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
    this.http.get<any>(url).subscribe((pokemonData) => {
      this.selectedPokemon = pokemonData;
      this.scrollToTop();
    });
      console.log(this.selectedPokemon);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }






searchTerm: string = '';
filteredSuggestions: any[] = [];
showSuggestions: boolean = false;

onSearchInput() {
  const term = this.searchTerm.toLowerCase().trim();
  if (term.length > 1) {
    this.filteredSuggestions = this.allPokemons.filter(p =>
      p.name.toLowerCase().includes(term)
    ).slice(0, 10); // sugestões limitadas
    this.showSuggestions = true;
  } else {
    this.filteredSuggestions = [];
    this.showSuggestions = false;
  }
}

onPokemonSelected(pokemon: any) {
  this.searchTerm = pokemon.name;
  this.filteredSuggestions = [];
  this.showSuggestions = false;
  this.goToDetails(pokemon);
}

searchPokemon() {
  const match = this.allPokemons.find(p =>
    p.name.toLowerCase() === this.searchTerm.toLowerCase()
  );
  if (match) {
    this.goToDetails(match);
  } else {
    alert('Pokémon não encontrado!');
  }
  this.filteredSuggestions = [];
  this.showSuggestions = false;
}

clearSuggestions() {
  setTimeout(() => {
    this.showSuggestions = false;
  }, 200); // aguarda clique no item antes de fechar
}


  
}

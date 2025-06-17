

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
})
export class PokemonDetailPage implements OnInit {
  pokemon: any = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loadPokemon(name);
    }
  }

  loadPokemon(name: string) {
    this.isLoading = true;
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    this.http.get(url).subscribe((data) => {
      this.pokemon = data;
      this.isLoading = false;
    });
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

  goBack() {
    history.back();
  }
}

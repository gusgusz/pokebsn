import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const favSpy = jasmine.createSpyObj('FavoriteService', ['loadFavorites', 'addFavorite', 'removeFavorite'], {
      favorites$: of([]),
    });
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [
        HomePage, // ✅ Importando como standalone
        IonicModule.forRoot(),
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: FavoriteService, useValue: favSpy },
        { provide: AuthService, useValue: authSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    favoriteServiceSpy = TestBed.inject(FavoriteService) as jasmine.SpyObj<FavoriteService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadFavorites and loadPokemons on init', () => {
    spyOn(component, 'loadAllPokemonNames');
    spyOn(component, 'loadPokemons');

    component.ngOnInit();

    expect(favoriteServiceSpy.loadFavorites).toHaveBeenCalled();
    expect(component.loadAllPokemonNames).toHaveBeenCalled();
    expect(component.loadPokemons).toHaveBeenCalled();
  });

  it('should toggle favorite - add when not favorited', () => {
    const mockPokemon = { id: 1, name: 'bulbasaur' };
    component.favorites = [{ poke_id: 2 }];
    component.toggleFavorite(mockPokemon);
    expect(favoriteServiceSpy.addFavorite).toHaveBeenCalledWith(mockPokemon);
  });

  it('should toggle favorite - remove when already favorited', () => {
    const mockPokemon = { id: 1, name: 'bulbasaur' };
    component.favorites = [{ poke_id: 1 }];
    component.toggleFavorite(mockPokemon);
    expect(favoriteServiceSpy.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('should return true if pokemon is favorited', () => {
    const mockPokemon = { id: 10 };
    component.favorites = [{ poke_id: 10 }];
    expect(component.isFavorite(mockPokemon)).toBeTrue();
  });

  it('should return false if pokemon is not favorited', () => {
    const mockPokemon = { id: 20 };
    component.favorites = [{ poke_id: 10 }];
    expect(component.isFavorite(mockPokemon)).toBeFalse();
  });

  it('should navigate to /favorites', () => {
    const spy = spyOn(router, 'navigate');
    component.goToFavorites();
    expect(spy).toHaveBeenCalledWith(['/favorites']);
  });

  it('should navigate to /pokemon/:name', () => {
    const spy = spyOn(router, 'navigate');
    component.goToPokemon('pikachu');
    expect(spy).toHaveBeenCalledWith(['/pokemon', 'pikachu']);
  });

  it('should remove token and navigate to login on logout', () => {
    localStorage.setItem('token', '123');
    const spy = spyOn(router, 'navigate');
    component.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(spy).toHaveBeenCalledWith(['/login']);
  });
});

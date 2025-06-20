import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://pokedexapi-2ssf.onrender.com/api/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  // Método para fazer o login
  async login(email: string, password: string) {
    const loading = await this.loadingCtrl.create({ message: 'Entrando...' });
    await loading.present();

    try {
      const res = await this.http.post<any>(`${this.apiUrl}auth/login`, {
        email, password
      }).toPromise();
      console.log(res, 'login console');

      // Salva o token e o userId no localStorage
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.userId); // Armazenando o userId

      await loading.dismiss();
      await this.showToast('Login realizado com sucesso!', 'success');
      this.router.navigateByUrl('/');
      return true;
    } catch (error) {
      await loading.dismiss();
      await this.showToast('Credenciais inválidas. Tente novamente.', 'danger');
      return false;
    }
  }

  // Método para fazer o registro
  async register(name: string, email: string, password: string, password_confirmation: string) {
    const loading = await this.loadingCtrl.create({ message: 'Registrando...' });
    await loading.present();

    try {
      await this.http.post<any>(`${this.apiUrl}auth/register`, {
        name, email, password, password_confirmation
      }).toPromise();

      await loading.dismiss();
      await this.showToast('Registro realizado com sucesso!', 'success');
      this.router.navigateByUrl('/login');
      return true;
    } catch (error) {
      await loading.dismiss();
      await this.showToast('Erro no registro. Verifique seus dados.', 'danger');
      return false;
    }
  }

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    console.log(token);

    // Verificando se o token e o userId estão presentes
    if (token && token !== 'null' && token !== 'undefined' && localStorage.getItem('userId')) {
      return true;
    }

    return false;
  }

  // Método para sair
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove o userId também
    this.router.navigateByUrl('/login');
  }

  // Método privado para exibir Toasts
  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.showToast('Por favor, preencha todos os campos.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Entrando...' });
    await loading.present();

    this.http.post<any>('https://pokedexapi-2ssf.onrender.com/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: async (res) => {
        await loading.dismiss();
        localStorage.setItem('token', res.token.token);
        this.showToast('Login realizado com sucesso!', 'success');
        this.router.navigateByUrl('/');
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Credenciais inválidas. Tente novamente.', 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}

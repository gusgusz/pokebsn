import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importando FormsModule para usar ngModel
import { IonicModule } from '@ionic/angular';  // Importando IonicModule
import { RouterModule } from '@angular/router';  // Importando RouterModule para navegação
import { AuthService } from '../services/auth.service';  // Serviço de autenticação
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],  // Assegurando que esses módulos estão aqui
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,  // Serviço de autenticação
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.showToast('Por favor, preencha todos os campos.', 'danger');
      return;
    }

    const isLoggedIn = await this.authService.login(this.email, this.password);
    if (isLoggedIn) {
      this.router.navigateByUrl('/');  // Aqui você pode redirecionar para a página inicial, por exemplo.
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}

// En login.component.ts
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  statusMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      try {
        const res = await firstValueFrom(this.authService.login(loginData)); // Convierte a promesa
        if (!res) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          return
        }
        this.authService.setUserInfo(res); // Asigna la información del usuario en el servicio
        this.errorMessage = null;

        // Llama a getUsers y espera su resultado
        const usersInfo = await firstValueFrom(this.userService.getUsers());
        if (!usersInfo || usersInfo.length === 0) {
          this.errorMessage = 'Error al obtener la información de los usuarios';
          return
        }

        this.statusMessage = 'Logged successfully';


        this.router.navigate(['/tasks']);
      } catch (err) {
        if (err instanceof HttpErrorResponse) {
          const { error } = err.error;
          this.statusMessage = null;
          this.errorMessage = error;
        }
      }
    }
  }


  get passwordControl() {
    return this.loginForm.get('password');
  }

  get nameControl() {
    return this.loginForm.get('name'); // Asegúrate de tener este método también
  }

  clearMessageError() {
    this.errorMessage = null;
  }
}

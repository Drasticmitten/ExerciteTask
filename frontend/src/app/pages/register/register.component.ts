import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // corregido aquí
})
export class RegisterComponent {
  registerForm: FormGroup;
  statusMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private readonly router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: this.passwordMatchValidator }); // Validación para contraseñas coincidentes
  }

  // Validador para comprobar si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('passwordConfirmation')?.value
      ? null : { mismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value; // Extraemos valores del formulario
      console.log('Datos de register:', registerData);
      try {
        const res = await firstValueFrom(this.authService.register(registerData));
        if (!res) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          return
        }

        this.authService.setUserInfo(res);
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
        if (err instanceof HttpErrorResponse)
        {
          this.statusMessage = null;
          const { error } = err.error;
          this.errorMessage = error;
        }
      }
    }
  }


  clearMessageError(): void {
    this.errorMessage = null;
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get nameControl() {
    return this.registerForm.get('name');
  }
}

import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: ''          ,   redirectTo  : '/login', pathMatch: 'full' },
    { path: 'login'     ,   component   : LoginComponent },
    { path: 'register'  ,   component   : RegisterComponent },
    { path: 'tasks' ,   component   : DashboardComponent, canActivate: [authGuard] },
    { path: '**'        ,   redirectTo  : '/register' },
];

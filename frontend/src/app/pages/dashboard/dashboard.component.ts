import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar el servicio de autenticación
import { UserService } from '../../services/users.service'; // Asegúrate de importar el servicio de usuarios
import { UserInfo } from '../../users/user.model';
import { CardComponent } from "./shared/card/card.component";
import { Task } from './tasks/task.model';
import { TasksComponent } from './tasks/tasks.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, TasksComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css', // Corrige 'styleUrl' a 'styleUrls'
})
export class DashboardComponent implements OnInit {
  userSelected      ?: string;
  userInfo          : UserInfo = { _id: '', name: '', email: '', tasksAsigned: [] };
  usersInfo         : UserInfo[] = [];
  selectedUserInfo  ?: UserInfo;
  constructor(
    private route       : ActivatedRoute,
    private authService : AuthService,
    private router      : Router,
    private userService : UserService
  ) {}

  ngOnInit(): void {
    // Escuchar los parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      this.userInfo._id           = params['userId'] || '';
      this.userInfo.name          = params['name'] || '';
      this.userInfo.email         = params['email'] || '';
      this.userInfo.tasksAsigned  = params['tasksAsigned'] ? JSON.parse(params['tasksAsigned']) : [];
    });

    
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.userInfo = userInfo;
      }
    });
    
    this.userService.getUsers().subscribe((users) => {
      this.usersInfo = users;
    });

  }
  

  logout() {
    this.authService.clearUserInfo();
    this.router.navigate(['/login']);
  }

  userSelectedHandler(userName: string) {
    console.log(userName);
    this.userSelected = userName;
    this.selectedUserInfo = this.usersInfo.find((user) => user.name === userName);

    
  }

  unSelectUser() {
    this.userSelected = '';
  }

  getSelectedUserTasks(): Task[] {
    const user = this.usersInfo.find((user) => {
      console.log(`Users: ${user.tasksAsigned}`);
    });
  
    if (!user) {
      return [];
    }
    const { tasksAsigned } = user;
    console.log(tasksAsigned);
    return user ? user.tasksAsigned || [] : [];
  }
}

import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../services/tasks.service';
import { CardComponent } from "../shared/card/card.component";
import { NewTaskComponent } from "./new-task/new-task.component";
import { Task } from './task.model';
import { TaskComponent } from "./task/task.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CardComponent, DatePipe, FormsModule, TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  @Input({required: true}) name!: string;
  @Input({required: true}) userId!: string;
  isAddingTask = false;
  selectedUserTasks: Task[] = [];

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadUserTasks();
  }

  ngOnChanges(): void {
    this.loadUserTasks();
  }

  loadUserTasks() {
    this.tasksService.getTasksByName(this.name).subscribe({
      next: (tasks) => {
        console.log('User tasks:', tasks);
        this.selectedUserTasks = tasks;
      },
      error: (err) => {
        console.error('Error fetching user tasks', err);
      }
    });
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCancelAddTask() {
    this.isAddingTask = false;
  }

  onTaskCreated() {
    this.loadUserTasks();
    this.isAddingTask = false;
  }
}

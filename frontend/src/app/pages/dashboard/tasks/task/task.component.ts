import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../../services/tasks.service';
import { CardComponent } from "../../shared/card/card.component";
import { type Task, enumStatus } from '../task.model';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CardComponent, FormsModule, DatePipe, CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  statusOptions = Object.values(enumStatus);
  statusOptionOriginal: string = '';
  descriptionOriginal   !: string;
  showButton = false;
  @Input({ required: true }) task!: Task;
  @Output() taskChanged = new EventEmitter<void>();

  ngOnInit(): void {
    this.statusOptionOriginal = this.task.status;
    this.descriptionOriginal = this.task.description;
  }

  constructor(
    private tasksService: TasksService
  ) { }

  onCompleted() {
    this.task.updatedAt = undefined;
    this.tasksService.updateTask(this.task.nameUser, this.task.name, this.task).subscribe((taskUpdated) => {
      if (taskUpdated) {
        this.showButton = false;
        this.taskChanged.emit();
      }
    });
  }

  onDeleted() {
    this.tasksService.deleteTask(this.task.nameUser, this.task.name).subscribe({
      next: (deleteTask) => {
        this.taskChanged.emit();
      },
      error: (err) => {
        console.error('Error deleting task', err);
      }
    });
  }

  onStatusChange(status: enumStatus) {
    if (this.statusOptionOriginal !== status) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
    this.task.status = status;
    console.log(this.statusOptionOriginal)
  }

  onDescriptionChange(description: string) {
    if (description && this.descriptionOriginal !== description) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
    this.task.description = description;
  }
}

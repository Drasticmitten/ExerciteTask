import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksService } from '../../../../services/tasks.service';
import { Task } from '../task.model';



@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  @Input({ required: true }) name   !: string;
  @Input({ required: true }) userId !: string;
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();
  task                              !: Task;
  new_tasks: FormGroup;

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder
  ) {
    this.new_tasks = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  get nameControl() {
    return this.new_tasks.get('name');
  }

  get descriptionControl() {
    return this.new_tasks.get('description');
  }

  get statusControl() {
    return this.new_tasks.get('status');
  }

  get start_dateControl() {
    return this.new_tasks.get('start_date');
  }

  onClose() {
    this.close.emit();
  }

  async onSubmit() {
    if (this.new_tasks.valid) {
      this.task = {
        ...this.new_tasks.value,
        userId: this.userId,
        nameUser: this.name,
      }

      console.log(`Task to create: ${this.task.nameUser}`);

      this.tasksService.createTask(this.task).subscribe({
        next: (createdTask) => {
          if (createdTask) {
            console.log('Task created:', createdTask);
            this.taskCreated.emit();
            this.close.emit();
          }
        },
        error: (error) => {
          console.error('Error creating task:', error);
        },
      });
    }
  }
}

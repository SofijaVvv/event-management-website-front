import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Details, EventDetails } from '../../../interfaces/events';
import { AssignmentsDetails } from '../../../interfaces/assignments';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiCallsService } from '../../../service/api-calls.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.sass'],
})
export class TaskInputComponent implements OnInit {
  @Input() taskForInput: AssignmentsDetails = {} as AssignmentsDetails;
  @Output() closeTask = new EventEmitter<AssignmentsDetails>();

  prioritiesList: Details[] = [];

  constructor(
    private fb: FormBuilder,
    public apiCalls: ApiCallsService,
    private translate: TranslateService,
  ) {}

  formEditTask = this.fb.group({
    id: [0],
    description: ['', Validators.required],
    status: [0, Validators.required],
    priority: [{ id: 0, name: 'Low' }, Validators.required],
    user: { id: -1, name: '' },
    event_id: [0],
    created_date: new Date(),
    end_date: new Date(),
  });

  async ngOnInit(): Promise<void> {
    this.prioritiesList = await this.getPriorities();
    if (!this.taskForInput.id) {
      this.taskForInput.priority = this.prioritiesList[0];
    }
    this.formEditTask.patchValue({
      id: this.taskForInput.id,
      description: this.taskForInput.description,
      status: this.taskForInput.status,
      priority: this.taskForInput.priority,
      user: this.taskForInput.user,
      event_id: this.taskForInput.event_id,
      created_date: this.taskForInput.created_date,
      end_date: this.taskForInput.end_date,
    });
  }

  closeTaskForm() {
    this.closeTask.emit({ id: -1 } as AssignmentsDetails);
  }

  saveTask() {
    Swal.fire({
      title: this.translate.instant('entertheassignment'),
      text: this.translate.instant('entertheassignmentquestion'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: this.translate.instant('accept.yes'),
      cancelButtonText: this.translate.instant('cancel.button'),
    }).then((result) => {
      if (result.isConfirmed) {
        const forInsert = JSON.parse(JSON.stringify(this.formEditTask.value));
        this.apiCalls.addAssignment(forInsert).subscribe((data) => {
          console.log(data);
          if (data.error) {
            Swal.fire({
              title: this.translate.instant('Error'),
              text: this.translate.instant('errorwhileenteringtheassignmentt'),
              icon: 'error',
              confirmButtonColor: '#894CB2',
            });
          } else {
            Swal.fire({
              title: this.translate.instant('Success'),
              text: this.translate.instant('successfullyenteredassignment'),
              icon: 'success',
              confirmButtonColor: '#894CB2',
            });
            this.closeTask.emit(data['message']);
          }
        });
      }
    });
  }

  getPriorities(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getPriorities());
  }
}

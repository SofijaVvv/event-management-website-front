import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Details, EventDetails} from "../../../interfaces/events";
import {AssignmentsDetails} from "../../../interfaces/assignments";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.sass']
})
export class TaskInputComponent implements OnInit{
  @Input() taskForInput: AssignmentsDetails = {} as AssignmentsDetails;
  @Output() closeTask = new EventEmitter<AssignmentsDetails>();



  constructor(
    private fb: FormBuilder,
    public apiCalls: ApiCallsService,

  ) {}

  formEditTask = this.fb.group({
    id: [0],
    description: ['', Validators.required],
    status: [0, Validators.required],
    priority: [{id: 0, name: "Low"}, Validators.required],
    user: {id: -1, name: ""},
    event_id: [0],
    created_date: new Date(),
    end_date: new Date(),

  });

  prioritiesList: Details[] = []

  defaultTask = {
    id: 0,
    description: "",
    status: 1,
    priority: {id: 0, name: "Low"},
    user: {id: -1, name: ""},
    event_id: 0,
    created_date: new Date(),
    end_date: new Date(),
  }


  async ngOnInit(): Promise<void> {
    this.prioritiesList = await this.getPriorities()
    console.log(this.prioritiesList, "priorities")
    if (!this.taskForInput.id){
      this.taskForInput.priority = this.prioritiesList[0]
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
  console.log("forma", this.formEditTask.value, this.taskForInput)

    }

closeTaskForm() {

    this.closeTask.emit({id:-1} as AssignmentsDetails);



}

saveTask() {
  Swal.fire({
    title: 'Upis taska',
    text: "Da upišem task?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#894CB2',
    cancelButtonColor: '#',
    confirmButtonText: 'Da,upiši!',
    cancelButtonText: 'Nazad na program'
  }).then((result) => {
    if (result.isConfirmed) {

      const forInsert = JSON.parse(JSON.stringify(this.formEditTask.value))

      console.log(forInsert)
      this.apiCalls.addAssignment(forInsert).subscribe(
        (data) => {
          console.log(data)
          if (data.error){
            Swal.fire({
              title: 'Greška',
              text: "Greška prilikom upisa taska",
              icon: 'error',
              confirmButtonColor: '#894CB2',
            })


          } else {
            Swal.fire({
              title: 'Uspeh',
              text: "Uspešno upisan task",
              icon: 'success',
              confirmButtonColor: '#894CB2',
            })
            this.closeTask.emit(data['message']);
          }

        }

      )


    }

  })
}

getPriorities(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getPriorities())

}



}

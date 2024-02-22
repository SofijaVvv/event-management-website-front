import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ScheduleDetails} from "../../../interfaces/schedule";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-schedule-input',
  templateUrl: './schedule-input.component.html',
  styleUrls: ['./schedule-input.component.sass']
})
export class ScheduleInputComponent implements OnInit{
  @Input() scheduleForInput: ScheduleDetails = {} as ScheduleDetails;
  @Output() closeSchedule = new EventEmitter<ScheduleDetails>();


  // @ts-ignore
  formEditSchedule = this.fb.group({
    id: [0],
    description: ['', Validators.required],
    user: {id: -1, name: ""},
    event_id: [0],
    start_time: {id: 6, name: "06:000"},
    end_time: {id: 7, name: "07:00"},
  });


  constructor(
    private fb: FormBuilder,
    public apiCalls: ApiCallsService,

  ) {}

  ngOnInit(): void {

    this.formEditSchedule.patchValue({
      id: this.scheduleForInput.id,
      description: this.scheduleForInput.description,
      user: this.scheduleForInput.user,
      event_id: this.scheduleForInput.event_id,
      start_time: this.scheduleForInput.start_time,
      end_time: this.scheduleForInput.end_time,
    });
    }

closeScheduleForm(){
    this.closeSchedule.emit({id:-1} as ScheduleDetails);
}



  saveSchedule() {
    console.log(this.formEditSchedule.value)
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
        const forInsert = JSON.parse(JSON.stringify(this.formEditSchedule.value))
        console.log(forInsert)
        this.apiCalls.addSchedule(forInsert).subscribe(
          (data) => {
            console.log(data)
            if (data.error){
              void Swal.fire({
                title: 'Greška',
                text: "Greška prilikom upisa taska",
                icon: 'error',
                confirmButtonColor: '#894CB2',
              })

            } else {
              void Swal.fire({
                title: 'Uspeh',
                text: "Uspešno upisan task",
                icon: 'success',
                confirmButtonColor: '#894CB2',
              })
              this.closeSchedule.emit(data['message']);
            }

          }

        )


      }

    })
  }

}

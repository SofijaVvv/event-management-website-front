import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiCallsService} from "../../../service/api-calls.service";
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {Details, EventDetails} from "../../../interfaces/events";
import {FormBuilder, Validators} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {DateAdapter} from "@angular/material/core";
import * as moment from "moment";
import {AssignmentsDetails} from "../../../interfaces/assignments";
import {ScheduleDetails} from "../../../interfaces/schedule";
import {RevenuesDetails} from "../../../interfaces/revenues";
import {EventCostsDetails} from "../../../interfaces/costs";
import Swal from "sweetalert2";
import {AuthService} from "../../../service/auth.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-event-input',
  templateUrl: './event-input.component.html',
  styleUrls: ['./event-input.component.sass']
})
export class EventInputComponent implements OnInit {

  editEventID = parseInt(this.activate_route.snapshot.paramMap.get('id') || '');

  ///expenses
  newExpense = false;
  showExpense = false;

  defaultExpense: EventCostsDetails = {
    id: 0,
    type_of_cost: {id: -1, name: ""},
    event_id: this.editEventID,
    user: {id: -1, name: ""},
    amount: 0,
    description: "",
    client: {id: -1, name: ""},
    date: new Date(),
  }

  selectedExpense: EventCostsDetails = JSON.parse(JSON.stringify(this.defaultExpense));

  ///expenses


  ///revenue
  newRevenue = false;
  showRevenue = false;

  defaultRevenue: RevenuesDetails = {
    id: 0,
    type_of_revenue: {id: -1, name: ""},
    event_id: this.editEventID,
    user: {id: -1, name: ""},
    amount: 0,
    quantity: 0,
    unit: {id: -1, name: ""},
  }

  selectedRevenue: RevenuesDetails = JSON.parse(JSON.stringify(this.defaultRevenue));

  ///revenue



  //schedule
  showSchedule = false;
  newSchedule = false;

  defaultSchedule: ScheduleDetails = {
    id: 0,
    event_id: this.editEventID,
    user: {id: -1, name: ""},
    start_time: {id: 6, name: "06:00"},
    end_time: {id: 7, name: "07:00"},
    description: "",
    date: '',
  }
  selectedSchedule: ScheduleDetails = JSON.parse(JSON.stringify(this.defaultSchedule));


  //schedule





// tasks0
  showTask = false;
  newTask = false;
  defaultTask = {
    id: 0,
    description: "",
    status: 0,
    priority: {id: -1, name: ""},
    user: {id: -1, name: ""},
    event_id: this.editEventID,
    created_date: new Date(),
    end_date: new Date(),
  }
  selectedTask: AssignmentsDetails = JSON.parse(JSON.stringify(this.defaultTask));


  totalExpense = 0;
  totalRevenue = 0;
// tasks

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private authServis: AuthService,
    public apiCalls: ApiCallsService,
    private activate_route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _adapter: DateAdapter<any>,
  ) {
  }

  appData = this.authServis.appData;

  // editEventID = 0

  editEventData: EventDetails = {} as EventDetails

  locationsList: Details[] = []
  statusList: Details[] = []
  typeList: Details[] = []
  clientList: Details[] = []
  assignmentList: AssignmentsDetails[] = [];
  scheduleList: ScheduleDetails[] = []
  revenueList: RevenuesDetails[] = []
  costList: EventCostsDetails[] = []

  eventDate: string = moment().format('DD.MM.YYYY')

  selectedPickerDate = ""
  defaultEvent: EventDetails = {
    id: 0,
    date: new Date(),
    time: {id: -1, name: ""},
    client: {id: -1, name: ""},
    type_of_event: {id: -1, name: ""},
    status_event: {id: -1, name: ""},
    location: {id: -1, name: ""},
    user: {id: -1, name: ""},
    description: "",
    event_rating: 0,
    number_of_participants: 0,
  }


  formEditEvent = this.fb.group({
    id: [0],
    date: [new Date(), Validators.required],
    time: [{id: -1, name: ""}, Validators.required],
    client: [{id: -1, name: ""}, Validators.required],
    type_of_event: [{id: -1, name: ""}, Validators.required],
    status_event: [{id: -1, name: ""}, Validators.required],
    location: [{id: -1, name: ""}, Validators.required],
    user: [{id: -1, name: ""}, Validators.required],
    description: [''],
    event_rating: [0],
    number_of_participants: [0],

  });


  async ngOnInit() {
    console.log("event input", typeof this.assignmentList)
    this._adapter.setLocale('sr-Latn');



    console.log(this.editEventID, "u onit");
    let eventData: EventDetails = {} as EventDetails;
    if (this.editEventID) {
      console.log(this.editEventID, "event id")
      void this.loadEvents((this.editEventID))
      this.editEventData = await this.loadEvents((this.editEventID));

      console.log(this.editEventData, "edit event data")
      this.formEditEvent.patchValue({
        id: this.editEventData.id,
        date: moment(this.editEventData.date, 'DD.MM.YYYY').toDate(),
        description: this.editEventData.description,
        time: this.editEventData.time,
        location: this.editEventData.location,
        status_event: this.editEventData.status_event,
        type_of_event: this.editEventData.type_of_event,
        client: this.editEventData.client,
        user: this.editEventData.user,
        number_of_participants: this.editEventData.number_of_participants,

      })
      this.dateChanged()

      this.assignmentList = await this.loadAssignment((this.editEventID)) ;
      this.scheduleList = await this.loadSchedule((this.editEventID));
      this.revenueList = await this.loadRevenue((this.editEventID));
      this.costList = await this.loadCost((this.editEventID));




    } else {
      this.editEventData = JSON.parse(JSON.stringify(this.defaultEvent))
      this.formEditEvent.patchValue({
        id: this.editEventData.id,
        description: this.editEventData.description,
        time: this.editEventData.time,
        location: this.editEventData.location,
        status_event: this.editEventData.status_event,
        type_of_event: this.editEventData.type_of_event,
        client: this.editEventData.client,
        user: this.editEventData.user,

      })
      this.dateChanged()
    }
    const [
      locations, statuses, types, clients] = await Promise.all([
      this.loadLocations(),
      this.loadStatus(),
      this.loadType(),
      this.loadClients(),

    ]);
    this.locationsList = locations;
    this.statusList = statuses;
    this.typeList = types;
    this.clientList = clients;


    this.calculateTotal()
    this.spinner.hide();


  }


  loadEvents(event_id: number): Promise<EventDetails> {
    void this.spinner.show()
    return firstValueFrom(this.apiCalls.getEventListById(event_id, 'x', 'y'));
  }


  loadLocations(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getSharedLocations());
  }

  loadStatus(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getSharedEventStatuses());
  }

  loadType(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getSharedEventTypes());
  }

  loadClients(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getSharedClients());
  }

  loadAssignment(event_id: number): Promise<AssignmentsDetails[]> {
    return firstValueFrom(this.apiCalls.getAssignments(event_id, 'x', 'y'));
  }

  loadSchedule(event_id: number): Promise<ScheduleDetails[]> {
    return firstValueFrom(this.apiCalls.getSchedules(event_id, 'x', 'y'));
  }
  loadRevenue(event_id: number): Promise<RevenuesDetails[]> {
    return firstValueFrom(this.apiCalls.getRevenues(event_id, 'x', 'y'));
  }
  loadCost(event_id: number): Promise<EventCostsDetails[]> {
    return firstValueFrom(this.apiCalls.getEventCosts(event_id, 'x', 'y'));
  }

  dateChanged(){
    const dateChange = this.formEditEvent.value.date ? this.formEditEvent.value.date : new Date();
    this.selectedPickerDate = dateChange.getDate().toString().padStart(2, '0') + '.' + (dateChange.getMonth()+1).toString().padStart(2, '0') +  '.' + dateChange.getFullYear();

  }



  saveEvent() {
    Swal.fire({
      title: this.translate.instant('save.event'),
      text: this.translate.instant('typein.event'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgba(35,101,150,0.86)',
      cancelButtonColor: '#',
      confirmButtonText: this.translate.instant('enter.event'),
      cancelButtonText: this.translate.instant('backto.event')
    }).then((result) => {
      if (result.isConfirmed) {
        const mjesec = this.formEditEvent.value.date?.getMonth()
        let tmp = this.formEditEvent.value.date?.getFullYear() + "-" +
          (mjesec! +1).toString().padStart(2, '0') + '-'
          + this.formEditEvent.value.date?.getDate().toString().padStart(2, '0');
        console.log(tmp, "tmp")
        let datum=  new Date(tmp)
        datum.setUTCHours(0);
        this.formEditEvent.patchValue({
          date: datum
        })
        console.log(this.formEditEvent.value)
        // }
        let forInsert = JSON.parse(JSON.stringify(this.formEditEvent.value))
        // zaSlanje.datum = datum
        this.apiCalls.addEvent(forInsert).subscribe(
          (data) => {
            console.log(data)
            if (data.error){
              Swal.fire({
                title: this.translate.instant('error.er.event'),
                text: this.translate.instant('error.event'),
                icon: 'error',
                confirmButtonColor: 'rgba(35,101,150,0.86)',
              })
            } else {
              Swal.fire({
                title: this.translate.instant('success.s.event'),
                text: this.translate.instant('success.event'),
                icon: 'success',
                confirmButtonColor: 'rgba(35,101,150,0.86)',
              })
            }

          }
        )

      }
    })
  }

   closeTasks(event : AssignmentsDetails){
     console.log(event, "event povratni")
     if (event.id < 0){
       this.showTask = false;
       return;
     }
    if (this.newTask){

      this.assignmentList.push(event)
    } else {
      console.log(event, "povracaj update event")
      this.assignmentList.findIndex((task, index) => {
        if (task.id === event.id){
          this.assignmentList[index] = event;
          console.log("izmjena", this.assignmentList[index])
        }
      })
    }
    this.showTask = false;
  }

 calculateTotal(){
    let total = 0;
    this.costList.forEach(cost => {
      total += parseFloat(cost.amount.toString())
    })
   this.totalExpense = total;
    total = 0;
    this.revenueList.forEach(revenue => {
      total += revenue.amount * revenue.quantity
    })
    this.totalRevenue = total;
    console.log(this.totalExpense, this.totalRevenue, "totali")
 }





  editTask(task: AssignmentsDetails){
    if(!this.appData.can_edit){
      Swal.fire({
        title: this.translate.instant('rights.error'),
        text: this.translate.instant('rights.er.error'),
        icon: 'error',
      });
      return;
    }
    if (task.status === 1) {
      Swal.fire({
        title: this.translate.instant('task.finished'),
        text:  this.translate.instant('no.change'),
        icon: 'error',
      });
      return;
    }

    this.newTask = false;
    this.selectedTask = task;
    this.showTask = true;
  }

  addTask(){
    if(!this.appData.can_edit){
      Swal.fire({
        title: this.translate.instant('rights.error'),
        text: this.translate.instant('nochange.task'),
        icon: 'error',
      });
      return;
    }
    this.newTask = true;
    this.selectedTask = JSON.parse(JSON.stringify(this.defaultTask));
    this.showTask = true;
  }


  editSchedule(schedule: ScheduleDetails){
    if(!this.appData.can_edit){
      Swal.fire({
        title: this.translate.instant('rights.error'),
        text: this.translate.instant('nochange.schedule'),
        icon: 'error',
      });
      return;
    }
    this.selectedSchedule = schedule;
    this.showSchedule = true;
  }

  addSchedule(){
    if(!this.appData.can_edit){
      Swal.fire({
        title: this.translate.instant('rights.error'),
        text: this.translate.instant('nochange.schedule'),
        icon: 'error',
      });
      return;
    }
   this.newSchedule = true;
    this.selectedSchedule = JSON.parse(JSON.stringify(this.defaultSchedule));
    console.log("add schedule", this.selectedSchedule)
    this.showSchedule = true;
  }
////////REVENUE////////
  addRevenue(){
    if(!this.appData.can_edit){
      Swal.fire({
        title: this.translate.instant('rights.error'),
        text: this.translate.instant('nochange.revenue'),
        icon: 'error',
      });
      return;
    }
    this.newRevenue = true;
    this.selectedRevenue = JSON.parse(JSON.stringify(this.defaultRevenue));
    this.showRevenue = true;
  }
closeExpenses(event : EventCostsDetails){
  console.log(event, "event povratni")
  if (event.id < 0){
    this.showExpense = false;
    return;
  }
  if (this.newExpense){
    this.costList.push(event)
  } else {
    console.log(event, "povracaj update event")
    this.costList.findIndex((cost, index) => {
      if (cost.id === event.id){
        this.costList[index] = event;
      }
    })
  }
  this.calculateTotal()
  this.showExpense = false;
}



  closeRevenue(event : RevenuesDetails){
    console.log(event, "event povratni")
    if (event.id < 0){
      this.showRevenue = false;
      return;
    }
    if (this.newRevenue){
      this.revenueList.push(event)
    } else {
      console.log(event, "povracaj update event")
      this.revenueList.findIndex((revenue, index) => {
        if (revenue.id === event.id){
          this.revenueList[index] = event;
          console.log("izmjena", this.revenueList[index])
        }
      })
    }
    this.calculateTotal()
    this.showRevenue = false;
  }
  ////////REVENUE////////

  closeSchedule(event : ScheduleDetails){
    console.log(event, "event povratni")
    if (event.id < 0){
      this.showSchedule = false;
      return;
    }
    if (this.newSchedule){
      this.scheduleList.push(event)
    } else {
      console.log(event, "povracaj update event")
      this.scheduleList.findIndex((schedule, index) => {
        if (schedule.id === event.id){
          this.scheduleList[index] = event;
          console.log("izmjena", this.scheduleList[index])
        }
      })
    }
    this.showSchedule = false;
  }

editRevenue(revenue: RevenuesDetails){
  if(!this.appData.can_edit){
    Swal.fire({
      title: this.translate.instant('rights.error'),
      text: this.translate.instant('nochange.revenue'),
      icon: 'error',
    });
    return;
  }
    this.newRevenue = false;
  this.selectedRevenue = revenue;
  console.log(revenue, "revenue za edit")
  this.showRevenue = true;
}

addNewExpense(){
  if(!this.appData.can_edit){
    Swal.fire({
      title: this.translate.instant('rights.error'),
      text: this.translate.instant('nochange.cost'),
      icon: 'error',
    });
    return;
  }
  this.newExpense = true;
  this.selectedExpense = JSON.parse(JSON.stringify(this.defaultExpense));
  console.log("add expense", this.selectedExpense)
  this.showExpense = true;
}

editExpense(expense : EventCostsDetails){
  if(!this.appData.can_edit){
    Swal.fire({
      title: this.translate.instant('rights.error'),
      text: this.translate.instant('nochange.cost'),
      icon: 'error',
    });
    return;
  }
  this.newExpense = false;
  this.selectedExpense = expense
  console.log("add expense", this.selectedExpense)
  this.showExpense = true;

}

}
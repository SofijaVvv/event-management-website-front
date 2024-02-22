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
import {CostsDetails} from "../../../interfaces/costs";
import Swal from "sweetalert2";

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

  defaultExpense: CostsDetails = {
    id: 0,
    type_of_cost: {id: -1, name: ""},
    event_id: this.editEventID,
    user: {id: -1, name: ""},
    amount: 0,
    description: "",
    client: {id: -1, name: ""},
  }

  selectedExpense: CostsDetails = JSON.parse(JSON.stringify(this.defaultExpense));

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
    public apiCalls: ApiCallsService,
    private activate_route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _adapter: DateAdapter<any>,
  ) {
  }

  // editEventID = 0

  editEventData: EventDetails = {} as EventDetails

  locationsList: Details[] = []
  statusList: Details[] = []
  typeList: Details[] = []
  clientList: Details[] = []
  assignmentList: AssignmentsDetails[] = [];
  scheduleList: ScheduleDetails[] = []
  revenueList: RevenuesDetails[] = []
  costList: CostsDetails[] = []

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
    return firstValueFrom(this.apiCalls.eventList(event_id));
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
    return firstValueFrom(this.apiCalls.getAssignments(event_id));
  }

  loadSchedule(event_id: number): Promise<ScheduleDetails[]> {
    return firstValueFrom(this.apiCalls.getSchedules(event_id));
  }
  loadRevenue(event_id: number): Promise<RevenuesDetails[]> {
    return firstValueFrom(this.apiCalls.getRevenues(event_id));
  }
  loadCost(event_id: number): Promise<CostsDetails[]> {
    return firstValueFrom(this.apiCalls.getCosts(event_id));
  }

  dateChanged(){
    const dateChange = this.formEditEvent.value.date ? this.formEditEvent.value.date : new Date();
    this.selectedPickerDate = dateChange.getDate().toString().padStart(2, '0') + '.' + (dateChange.getMonth()+1).toString().padStart(2, '0') +  '.' + dateChange.getFullYear();
    // const kojipiker = (event.targetElement.id);
    // console.log("kojipiker", kojipiker)
    // const datum = event.value
    // if (kojipiker === 'prvipiker'){
    //     this.oddatum = datum.getDate().toString().padStart(2, '0') + '.' + (datum.getMonth()+1).toString().padStart(2, '0') +  '.' + datum.getFullYear();
    // } else {
    //     this.dodatum =  datum.getDate().toString().padStart(2, '0') + '.' + (datum.getMonth()+1).toString().padStart(2, '0') +  '.' + datum.getFullYear();
    // }
    // this.uzmiDogadjaje(2)
  }



  saveEvent() {
    Swal.fire({
      title: 'Upis događaja',
      text: "Da upišem događaj?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: 'Da,upiši!',
      cancelButtonText: 'Nazad na program'
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
                title: 'Greška',
                text: "Greška prilikom upisa događaja",
                icon: 'error',
                confirmButtonColor: '#894CB2',
              })
            } else {
              Swal.fire({
                title: 'Uspeh',
                text: "Uspešno upisan događaj",
                icon: 'success',
                confirmButtonColor: '#894CB2',
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
    if (task.status === 1) {
      Swal.fire({
        title: 'Task je završen',
        text: "Ne mozete mijenjati zavrseni zadatak!",
        icon: 'error',
      });
      return;
    }

    this.newTask = false;
    console.log(task, "task za edit")
    this.selectedTask = task;
    this.showTask = true;
  }

  addTask(){
    this.newTask = true;
    this.selectedTask = JSON.parse(JSON.stringify(this.defaultTask));
    console.log("add task", this.selectedTask)
    this.showTask = true;
  }


  editSchedule(schedule: ScheduleDetails){
    this.selectedSchedule = schedule;
    this.showSchedule = true;
  }

  addSchedule(){
   this.newSchedule = true;
    this.selectedSchedule = JSON.parse(JSON.stringify(this.defaultSchedule));
    console.log("add schedule", this.selectedSchedule)
    this.showSchedule = true;
  }
////////REVENUE////////
  addRevenue(){
    this.newRevenue = true;
    this.selectedRevenue = JSON.parse(JSON.stringify(this.defaultRevenue));
    console.log("add revenue", this.selectedRevenue)
    this.showRevenue = true;
  }
closeExpenses(event : CostsDetails){
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
        console.log("izmjena", this.costList[index])
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
    this.newRevenue = false;
  this.selectedRevenue = revenue;
  console.log(revenue, "revenue za edit")
  this.showRevenue = true;
}

addNewExpense(){
  this.newExpense = true;
  this.selectedExpense = JSON.parse(JSON.stringify(this.defaultExpense));
  console.log("add expense", this.selectedExpense)
  this.showExpense = true;
}

editExpense(expense : CostsDetails){
  this.newExpense = false;
  this.selectedExpense = JSON.parse(JSON.stringify(expense));
  console.log("add expense", this.selectedExpense)
  this.showExpense = true;

}

}

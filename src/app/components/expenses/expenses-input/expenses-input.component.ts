import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { EventCostsDetails} from "../../../interfaces/costs";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import {Details} from "../../../interfaces/events";
import {firstValueFrom} from "rxjs";
import Swal from "sweetalert2";
import * as moment from "moment";
@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.component.html',
  styleUrls: ['./expenses-input.component.sass']
})
export class ExpensesInputComponent implements OnInit{
 @Input() expenseForInput: EventCostsDetails = {} as EventCostsDetails;
  @Output() closeExpense = new EventEmitter<EventCostsDetails>();
  @Input() costType: String = "event";
  formEditExpense = this.fb.group({
    id: [0],
    event_id: [0],
    user: {id: -1, name: ""},
    date: [new Date(), Validators.required],
    amount: [0, Validators.required],
    type_of_cost: [{id: -1, name: ""}, Validators.required],
    client: [{id: -1, name: ""}, Validators.required],
    description: [""],
  });

  selectedPickerDate = ""



  constructor(
    private fb: FormBuilder,
    public apiCalls: ApiCallsService,
  ) { }

clientList: Details[] = [];
costTypesList: Details[] = [];

  async ngOnInit(): Promise<void> {

    this.clientList = await this.loadClients();
    this.costTypesList = await this.loadCostTypes();

    if (this.expenseForInput.id === 0) {
      this.expenseForInput.type_of_cost = {id: -1, name: ""};
      this.expenseForInput.client = {id: -1, name: ""};
    }
    if (this.expenseForInput.id !== 0) {
      this.selectedPickerDate = moment(this.expenseForInput.date, 'DD.MM.YYYY').format('DD.MM.YYYY')
    } else {
      this.selectedPickerDate = moment(new Date()).format('DD.MM.YYYY')
    }
    console.log(this.expenseForInput, "za ispravku expenses")
    this.formEditExpense.patchValue({
      id: this.expenseForInput.id,
      user: this.expenseForInput.user,
      event_id: this.expenseForInput.event_id,
      date: moment(this.selectedPickerDate, 'DD.MM.YYYY').toDate(),
      amount: this.expenseForInput.amount,
      // date: this.expenseForInput.date,
      type_of_cost: this.expenseForInput.type_of_cost,
      client: this.expenseForInput.client,
      description: this.expenseForInput.description,
    });
  }


  loadClients(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getSharedClients());
  }

  loadCostTypes(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getCostTypes());
  }

  closeExpenseForm() {
    this.closeExpense.emit({id: -1} as  EventCostsDetails);
  }

  saveExpense() {
    const expense = this.formEditExpense.value;
    console.log(expense, "prije save");
    if (!this.apiCalls.isTextNumber(this.formEditExpense.value.amount?.toString()) || this.formEditExpense.value.amount === 0){
      Swal.fire({
        title: 'Greška',
        text: 'Unesite ispravnu vrednost troška',
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }

    Swal.fire({
      title: 'Upis expense',
      text: "Da upišem događaj?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: 'Da,upiši!',
      cancelButtonText: 'Nazad na program'
    }).then((result) => {
      if (result.isConfirmed) {
        if (expense.event_id === 0){
          expense.event_id = null;
        }
        const mjesec = this.formEditExpense.value.date?.getMonth()
        let tmp = this.formEditExpense.value.date?.getFullYear() + "-" +
          (mjesec! +1).toString().padStart(2, '0') + '-'
          + this.formEditExpense.value.date?.getDate().toString().padStart(2, '0');
        console.log(tmp, "tmp")
        let datum=  new Date(tmp)
        datum.setUTCHours(0);
        expense.date = datum;


        const dataForInput = JSON.stringify(expense);
        if (this.costType === "event") {
          this.apiCalls.addEventCosts(dataForInput).subscribe((response) => {
            console.log(response);
            if (response.error) {
              Swal.fire({
                title: 'Greška',
                text: 'Greška prilik upisa troška',
                icon: 'error',
                confirmButtonColor: '#894CB2',
              });
              return;
            } else {
              Swal.fire({
                title: 'Uspešno',
                text: 'Trošak je uspešno upisan',
                icon: 'success',
                confirmButtonColor: '#894CB2',
              });
              this.closeExpense.emit(expense as EventCostsDetails);
            }
          });
        } else {
          this.apiCalls.addOtherCosts(dataForInput).subscribe((response) => {
            console.log(response);
            if (response.error) {
              Swal.fire({
                title: 'Greška',
                text: 'Greška prilik upisa troška',
                icon: 'error',
                confirmButtonColor: '#894CB2',
              });
              return;
            } else {
              Swal.fire({
                title: 'Uspešno',
                text: 'Trošak je uspešno upisan',
                icon: 'success',
                confirmButtonColor: '#894CB2',
              });
              this.closeExpense.emit(expense as EventCostsDetails);
            }
          });
        }
      }}
    )
  }

  dateChanged() {
    const dateChange = this.formEditExpense.value.date ? this.formEditExpense.value.date : new Date();
    console.log(dateChange, "dateChange")
    this.selectedPickerDate = dateChange.getDate().toString().padStart(2, '0') + '.' + (dateChange.getMonth() + 1).toString().padStart(2, '0') + '.' + dateChange.getFullYear();
  }

  }

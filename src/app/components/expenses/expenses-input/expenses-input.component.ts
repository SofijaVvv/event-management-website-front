import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { EventCostsDetails} from "../../../interfaces/costs";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import {Details} from "../../../interfaces/events";
import {firstValueFrom} from "rxjs";
import Swal from "sweetalert2";
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.component.html',
  styleUrls: ['./expenses-input.component.sass']
})
export class ExpensesInputComponent implements OnInit{
  @Input() expenseForInput: EventCostsDetails = {} as EventCostsDetails;
  @Input() costType: String = "event";
  @Output() closeExpense = new EventEmitter<EventCostsDetails>();

  clientList: Details[] = [];
  costTypesList: Details[] = [];
  selectedPickerDate = ""

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


  constructor(
    private fb: FormBuilder,
    public apiCalls: ApiCallsService,
    private translate: TranslateService,
  ) { }


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

    this.formEditExpense.patchValue({
      id: this.expenseForInput.id,
      user: this.expenseForInput.user,
      event_id: this.expenseForInput.event_id,
      date: moment(this.selectedPickerDate, 'DD.MM.YYYY').toDate(),
      amount: this.expenseForInput.amount,
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
    if (!this.apiCalls.isTextNumber(this.formEditExpense.value.amount?.toString()) || this.formEditExpense.value.amount === 0){
      Swal.fire({
        title: this.translate.instant('error'),
        text:  this.translate.instant('entervalidcostvalue'),
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }


    Swal.fire({
      title: this.translate.instant('enterexpense'),
      text: this.translate.instant('shouldienterexpense'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: this.translate.instant('yesenterexpense'),
      cancelButtonText: this.translate.instant('cancel.button')
    }).then((result) => {
      if (result.isConfirmed) {
        if (expense.event_id === 0){
          expense.event_id = null;
        }
        const mjesec = this.formEditExpense.value.date?.getMonth()
        let tmp = this.formEditExpense.value.date?.getFullYear() + "-" +
          (mjesec! +1).toString().padStart(2, '0') + '-'
          + this.formEditExpense.value.date?.getDate().toString().padStart(2, '0');
        let datum=  new Date(tmp)
        datum.setUTCHours(0);
        expense.date = datum;


        const dataForInput = JSON.stringify(expense);
        if (this.costType === "event") {
          this.apiCalls.addEventCosts(dataForInput).subscribe((response) => {
            if (response.error) {
              Swal.fire({
                title: this.translate.instant('error'),
                text: this.translate.instant('errorwhileenteringexpense'),
                icon: 'error',
                confirmButtonColor: '#894CB2',
              });
              return;
            } else {
              Swal.fire({
                title: this.translate.instant('success'),
                text: this.translate.instant('expensesucessfullyentered'),
                icon: 'success',
                confirmButtonColor: '#894CB2',
              });
              this.closeExpense.emit(expense as EventCostsDetails);
            }
          });
        } else {
          this.apiCalls.addOtherCosts(dataForInput).subscribe((response) => {
            if (response.error) {
              Swal.fire({
                title: this.translate.instant('error'),
                text: this.translate.instant('errorwhileenteringexpense'),
                icon: 'error',
                confirmButtonColor: '#894CB2',
              });
              return;
            } else {
              Swal.fire({
                title: this.translate.instant('success'),
                text: this.translate.instant('expensesucessfullyentered'),
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
    this.selectedPickerDate = dateChange.getDate().toString().padStart(2, '0') + '.' + (dateChange.getMonth() + 1).toString().padStart(2, '0') + '.' + dateChange.getFullYear();
  }

  }

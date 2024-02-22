import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CostsDetails} from "../../../interfaces/costs";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import {Details} from "../../../interfaces/events";
import {firstValueFrom} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.component.html',
  styleUrls: ['./expenses-input.component.sass']
})
export class ExpensesInputComponent implements OnInit{
  @Input() expenseForInput: CostsDetails = {} as CostsDetails;
  @Output() closeExpense = new EventEmitter<CostsDetails>();

  formEditExpense = this.fb.group({
    id: [0],
    user: {id: -1, name: ""},
    event_id: [0],
    amount: [0, Validators.required],
    type_of_cost: [{id: -1, name: ""}, Validators.required],
    client: [{id: -1, name: ""}, Validators.required],
    description: [""],
  });



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
    console.log(this.expenseForInput, "za ispravku expenses")
    this.formEditExpense.patchValue({
      id: this.expenseForInput.id,
      user: this.expenseForInput.user,
      event_id: this.expenseForInput.event_id,
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
    this.closeExpense.emit({id: -1} as CostsDetails);
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
        const dataForInput = JSON.stringify(expense);
        this.apiCalls.addCosts(dataForInput).subscribe((response) => {
          console.log(response);
          if (response.error){
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
            this.closeExpense.emit(expense as CostsDetails);
          }
        });

      }}
    )
  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RevenuesDetails} from "../../../interfaces/revenues";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import {Details} from "../../../interfaces/events";
import {firstValueFrom} from "rxjs";
import * as moment from "moment";
import Swal from "sweetalert2";
@Component({
  selector: 'app-revenue-input',
  templateUrl: './revenue-input.component.html',
  styleUrls: ['./revenue-input.component.sass']
})
export class RevenueInputComponent implements OnInit{
  @Input() revenueForInput: RevenuesDetails = {} as RevenuesDetails;
  @Output() closeRevenue = new EventEmitter<RevenuesDetails>();


  formEditRevenue = this.fb.group({
    id: [0],
    user: {id: -1, name: ""},
    event_id: [0],
    amount: [0, Validators.required],
    type_of_revenue: [{id: -1, name: ""}, Validators.required],
    quantity: [0, Validators.required],
    unit: {id: -1, name: ""},
  });

  unitsList: Details[] = []
  revenueTypesList: Details[] = []


  constructor(
    private fb: FormBuilder,
    public apiCalls: ApiCallsService,
  ) {}

  async ngOnInit(): Promise<void> {

    this.unitsList = await this.loadUnits();
    this.revenueTypesList = await this.loadRevenueTypes();
    if (this.revenueForInput.id === 0) {
      this.revenueForInput.type_of_revenue = this.revenueTypesList[0];
      this.revenueForInput.unit = this.unitsList[0];
    }


    this.formEditRevenue.patchValue({
      id: this.revenueForInput.id,
      user: this.revenueForInput.user,
      event_id: this.revenueForInput.event_id,
      amount: this.revenueForInput.amount,
      type_of_revenue: this.revenueForInput.type_of_revenue,
      quantity: this.revenueForInput.quantity,
      unit: this.revenueForInput.unit,
    });

  }

  loadUnits(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getUnits());
  }

  loadRevenueTypes(): Promise<Details[]> {
    return firstValueFrom(this.apiCalls.getSharedRevenuesTypes());
  }

  colseRevenueForm() {
    this.closeRevenue.emit({id:-1} as RevenuesDetails);
  }

saveRevenue() {
    console.log(this.formEditRevenue.value);

    if (!this.apiCalls.isTextNumber(this.formEditRevenue.value.amount?.toString()) || this.formEditRevenue.value.amount === 0) {
      Swal.fire({
        title: 'Greška',
        text: 'Unesite ispravnu vrednost za iznos',
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }
    if (!this.apiCalls.isTextNumber(this.formEditRevenue.value.quantity?.toString()) || this.formEditRevenue.value.quantity === 0) {
      Swal.fire({
        title: 'Greška',
        text: 'Unesite ispravnu vrednost za količinu',
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }



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
     const dataForInput = JSON.stringify(this.formEditRevenue.value);
      this.apiCalls.addRevenue(dataForInput).subscribe((response) => {
        console.log(response);
        if (response.error) {
          Swal.fire({
            title: 'Greška',
            text: 'Greška prilik  upisa događaja',
            icon: 'error',
            confirmButtonColor: '#894CB2',
          });

        } else {
          Swal.fire({
            title: 'Uspeh',
            text: 'Uspešno upisan događaj',
            icon: 'success',
            confirmButtonColor: '#894CB2',
          });
          this.closeRevenue.emit(this.formEditRevenue.value as RevenuesDetails);
        }

      }
      );


  }}
  )}


  }

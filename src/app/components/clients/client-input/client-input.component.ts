import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IClient} from "../../../interfaces/client";
import {ApiCallsService} from "../../../service/api-calls.service";
import {FormBuilder, Validators} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {Details} from "../../../interfaces/events";
import Swal from "sweetalert2";

@Component({
  selector: 'app-client-input',
  templateUrl: './client-input.component.html',
  styleUrls: ['./client-input.component.sass']
})
export class ClientInputComponent implements OnInit {
  @Input() clientForInput: IClient = {} as IClient;
  @Output() closeClient = new EventEmitter<IClient>();

clientTypeList: Details[] = [];

  formEditClient = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    pdvnumber: [''],
    pib: [''],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    type_of_client: {id: 0, name: ""},
    bank_account: [''],
    note: ['']
  });


  constructor(
    private fb: FormBuilder,
    private apiCalls: ApiCallsService,
  ) { }


 async ngOnInit(): Promise<void> {
this.clientTypeList = await this.loadTypeOfClients();

   if (this.clientForInput.id  == 0) {
     this.clientForInput.type_of_client = this.clientTypeList[0];
   }

   this.formEditClient.patchValue({
     id: this.clientForInput.id,
     name: this.clientForInput.name,
     address: this.clientForInput.address,
     city: this.clientForInput.city,
     pdvnumber: this.clientForInput.pdvnumber,
     pib: this.clientForInput.pib,
     phone: this.clientForInput.phone,
     email: this.clientForInput.email,
     type_of_client: this.clientForInput.type_of_client,
     bank_account: this.clientForInput.bank_account,
     note: this.clientForInput.note
  });
  }


  closeCloseClient() {
    this.closeClient.emit({id:-1} as IClient);
  }


  loadTypeOfClients() {
    return firstValueFrom(this.apiCalls.getClientTypes())
}


saveClient() {
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
      this.apiCalls.addClient(JSON.stringify(this.formEditClient.value)).subscribe((res: any) => {
        if (res.error) {
          Swal.fire({
            title: 'Greška',
            text: res.message,
            icon: 'error',
            confirmButtonColor: '#894CB2'
          });
          return;
        } else {
          Swal.fire({
            title: 'Uspeh',
            text: 'Uspešno upisan događaj',
            icon: 'success',
            confirmButtonColor: '#894CB2'
          });
        }
        this.clientForInput = res.message;
        this.closeClient.emit(this.clientForInput);
      });
    }
  });
}



}

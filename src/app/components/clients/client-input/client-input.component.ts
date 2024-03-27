import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { IClient } from '../../../interfaces/client';
import { ApiCallsService } from '../../../service/api-calls.service';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Details } from '../../../interfaces/events';
import Swal from 'sweetalert2';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-client-input',
  templateUrl: './client-input.component.html',
  styleUrls: ['./client-input.component.sass'],
})
export class ClientInputComponent implements OnInit {
  @Input() clientForInput: IClient = {} as IClient;
  @Output() closeClient = new EventEmitter<IClient>();
  @ViewChild('name') name!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('phone') phone!: ElementRef;
  @ViewChild('address') address!: ElementRef;
  @ViewChild('bankaccount') bankaccount!: ElementRef;
  @ViewChild('city') city!: ElementRef;
  @ViewChild('note') note!: ElementRef;

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
    type_of_client: { id: 0, name: '' },
    bank_account: [''],
    note: [''],
  });

  constructor(
    private fb: FormBuilder,
    private apiCalls: ApiCallsService,
    public translate: TranslateService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.clientTypeList = await this.loadTypeOfClients();

    if (this.clientForInput.id == 0) {
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
      note: this.clientForInput.note,
    });
  }

  focusInput(input: string) {
    console.log(input, 'input');
    document.getElementById(input)?.focus();
  }


  closeCloseClient() {
    this.closeClient.emit({ id: -1 } as IClient);
  }

  loadTypeOfClients() {
    return firstValueFrom(this.apiCalls.getClientTypes());
  }

  saveClient() {


    if (this.formEditClient.get('name')?.value?.trim() == '' || this.formEditClient.get('name')?.value == null) {
      Swal.fire({
        title: this.translate.instant('error')  ,
        text:  this.translate.instant('clientname.input') ,
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }
    if (this.formEditClient.get('email')?.value?.trim() == '' || this.formEditClient.get('email')?.value == null) {
      Swal.fire({
        title: this.translate.instant('error'),
        text: this.translate.instant('clientemail.input'),
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }

    if (this.formEditClient.get('phone')?.value?.trim() == '' || this.formEditClient.get('phone')?.value == null) {
      Swal.fire({
        title: this.translate.instant('error'),
        text: this.translate.instant('clientphone.input'),
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }
    if (this.formEditClient.get('address')?.value?.trim() == '' || this.formEditClient.get('address')?.value == null) {
      Swal.fire({
        title:  this.translate.instant('error'),
        text: this.translate.instant('clientaddress.input'),
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }

    if (this.formEditClient.get('city')?.value?.trim() == '' || this.formEditClient.get('city')?.value == null) {
      Swal.fire({
        title:  this.translate.instant('error'),
        text: this.translate.instant('clientcity.input'),
        icon: 'error',
        confirmButtonColor: '#894CB2',
      });
      return;
    }


    Swal.fire({
      title: 'Upis događaja',
      text: 'Da upišem događaj?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: 'Da,upiši!',
      cancelButtonText: 'Nazad na program',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiCalls
          .addClient(JSON.stringify(this.formEditClient.value))
          .subscribe((res: any) => {
            if (res.error) {
              Swal.fire({
                title:  this.translate.instant('error'),
                text: res.message,
                icon: 'error',
                confirmButtonColor: '#894CB2',
              });
              return;
            } else {
              Swal.fire({
                title:  this.translate.instant('success'),
                text: this.translate.instant('clientsaved.input'),
                icon: 'success',
                confirmButtonColor: '#894CB2',
              });
            }
            this.clientForInput = res.message;
            this.closeClient.emit(this.clientForInput);
          });
      }
    });
  }
}

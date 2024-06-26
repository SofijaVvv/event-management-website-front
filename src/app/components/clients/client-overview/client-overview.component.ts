import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../../../service/api-calls.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../service/auth.service';
import { IClient } from '../../../interfaces/client';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-overview',
  templateUrl: './client-overview.component.html',
  styleUrls: ['./client-overview.component.sass'],
})
export class ClientOverviewComponent implements OnInit {
  filteredClientlist: IClient[] = [];
  clientList: IClient[] = [];
  selectedClient: IClient = {} as IClient;
  searchInput = new FormControl('');
  showInput = false;

  defaultClient: IClient = {
    id: 0,
    name: '',
    address: '',
    city: '',
    pdvnumber: '',
    pib: '',
    phone: '',
    email: '',
    type_of_client: { id: -1, name: '' },
    bank_account: '',
    note: '',
  };

  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  appData = this.authService.appData;

  loadClients() {
    this.spinner.show();
    this.apiCalls.getClients().subscribe((data: IClient[]) => {
      this.clientList = data;
      this.filteredClientlist = data;
      this.spinner.hide();
    });
  }

  filterClientsSearch() {
    this.filteredClientlist = this.clientList;
    const textForSearch = this.searchInput.value || '';
    if (textForSearch) {
      this.filteredClientlist = this.clientList.filter(
        (task) =>
          task.name.toLowerCase().includes(textForSearch.toLowerCase()) ||
          task.email.toLowerCase().includes(textForSearch.toLowerCase()) ||
          task.phone.toLowerCase().includes(textForSearch.toLowerCase()) ||
          task.address.toLowerCase().includes(textForSearch.toLowerCase()) ||
          task.city.toLowerCase().includes(textForSearch.toLowerCase()),
      );
    }
  }

  closeClientInput(client: IClient) {
    this.showInput = false;
    if (client.id) {
      this.loadClients();
    }
  }

  newClient() {
    this.selectedClient = JSON.parse(JSON.stringify(this.defaultClient));
    this.showInput = true;
  }

  downloadClientExcel() {
    Swal.fire({
      title: this.translate.instant('download.base'),
      text: this.translate.instant('create'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('accept.yes'),
      cancelButtonText: this.translate.instant('cancel.button'),
    }).then((result: any) => {
      
        this.apiCalls
          .downloadExcelFile(
            this.appData.application,
            0,
            'fromDate',
            'toDate',
            'eng',
          )
          .subscribe((data: any) => {
            console.log(data, 'data');
            const blob = new Blob([data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ClientsList.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
          });

    });
  }

  editClient(client: IClient) {
    if (!this.appData.can_edit) {
      void Swal.fire({
        icon: 'error',
        title: 'Access denied',
        text: 'You do not have access to edit clients!',
      });
      return;
    }
    this.selectedClient = JSON.parse(JSON.stringify(client));
    this.showInput = true;
  }
}

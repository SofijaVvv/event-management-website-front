import {Component, OnInit} from '@angular/core';
import {ApiCallsService} from "../../../service/api-calls.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";
import {IClient} from "../../../interfaces/client";
import {FormControl, isFormControl} from "@angular/forms";

@Component({
  selector: 'app-client-overview',
  templateUrl: './client-overview.component.html',
  styleUrls: ['./client-overview.component.sass']
})
export class ClientOverviewComponent implements OnInit {
  filteredClientlist: IClient[] = []
  clientList: IClient[] = []
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
    type_of_client: {id: -1, name: ''},
    bank_account: '',
    note: ''
  }

  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loadClients();

  }

  loadClients() {
    this.spinner.show()
    this.apiCalls.getClients().subscribe((data: IClient[]) => {
      this.clientList = data
      this.filteredClientlist = data
      this.spinner.hide()
    })

  }

  filterClientsSearch() {
    this.filteredClientlist = this.clientList;
    const textForSearch = this.searchInput.value || '';
    if (textForSearch){
      this.filteredClientlist = this.clientList.filter(task =>
        task.name.toLowerCase().includes(textForSearch.toLowerCase()) ||
        task.email.toLowerCase().includes(textForSearch.toLowerCase()) ||
        task.phone.toLowerCase().includes(textForSearch.toLowerCase()) ||
        task.address.toLowerCase().includes(textForSearch.toLowerCase()) ||
        task.city.toLowerCase().includes(textForSearch.toLowerCase())
      )
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
    console.log("hello", this.selectedClient)

  }

  editClient(client: IClient) {
    this.selectedClient = JSON.parse(JSON.stringify(client));
    this.showInput = true;
  }


}

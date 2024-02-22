import { Component } from '@angular/core';
import {CostsDetails} from "../../../interfaces/costs";
import {FormControl, isFormControl} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";
import {Details} from "../../../interfaces/events";

@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.component.html',
  styleUrls: ['./expenses-overview.component.sass']
})
export class ExpensesOverviewComponent {

  filteredCostList: CostsDetails[] = [];
  searchInput = new FormControl('');
  showInput = false;
  costList: CostsDetails[] = [];
  selectedExpenses: CostsDetails = {} as CostsDetails;
  newCost: boolean = false;


  filterOptions: Details[] = [
    {id: 0, name: 'All'},
    {id: 1, name: 'Event'},
    {id: 2, name: 'Supply'},
  ]

  selectedFilter = new FormControl(this.filterOptions[0]);



  defaultExpenses: CostsDetails = {
    id: 0,
    user: {id: -1, name: ""},
    event_id: 0,
    amount: 0,
    type_of_cost: {id: -1, name: ""},
    client: {id: -1, name: ""},
    description: "",
  }

  ngOnInit(): void {
    this.loadCosts();
  }


  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router
  ) { }

  filteredCostSearch() {
    this.filteredCostList = this.costList;
    const textForSearch = this.searchInput.value || '';
    if (textForSearch){
      this.filteredCostList = this.costList.filter(task =>
        task.description.toLowerCase().includes(textForSearch.toLowerCase())
      )
    }
  }

  loadCosts() {
    this.spinner.show()
    this.apiCalls.getCosts().subscribe((data: CostsDetails[]) => {
      this.costList = data
      this.filteredCostList = data
      this.spinner.hide()
    })

  }

  editCost(event: CostsDetails) {
    this.newCost = false;
    if (event.event_id){
      this.router.navigate(['/events/input', event.event_id]).then(r => console.log('ok - vracam se doma'));
    } else {
    this.selectedExpenses = event;
    this.showInput = true;
    }

  }

  closeExpenses(event : CostsDetails){
    console.log(event, "event povratni")
    if (event.id < 0){
      this.showInput = false;
      return;
    }
    if (this.newCost){
      this.costList.push(event)
      // sort costList by id
      this.costList.sort((a, b) => a.id - b.id);
    } else {
      console.log(event, "povracaj update event")
      this.costList.findIndex((cost, index) => {
        if (cost.id === event.id){
          this.costList[index] = event;
          console.log("izmjena", this.costList[index])
        }
      })
    }
    this.showInput = false;
  }

  addCost() {
    this.newCost = true;
    this.selectedExpenses = JSON.parse(JSON.stringify(this.defaultExpenses));
    this.showInput = true;
  }

  filterCosts() {
    this.filteredCostList = this.costList;
    const filter:Details = this.selectedFilter.value!;
    if (filter.id === 2){
      this.filteredCostList = this.costList.filter(cost => cost.event_id === null);
    } else {
      this.filteredCostList = this.costList.filter(cost => cost.event_id != null);
    }
  }

}

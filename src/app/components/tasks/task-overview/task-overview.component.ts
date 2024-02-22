import {Component, OnInit} from '@angular/core';
import {ApiCallsService} from "../../../service/api-calls.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";
import {EventDetails} from "../../../interfaces/events";
import {AssignmentsDetails} from "../../../interfaces/assignments";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.sass']
})
export class TaskOverviewComponent implements OnInit {

  filteredTaskList: AssignmentsDetails[] = []
  taskList: AssignmentsDetails[] = []
  filterOptions = [
    {id: 10, name: "All"},
    {id: 0, name: "Active"},
    {id: 1, name: "Inactive"},
  ]

  selectedFilter= new FormControl(this.filterOptions[0])


  searchInput = new FormControl('')

  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private router: Router
  ) {
  }


  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks() {
    void this.spinner.show()
    console.log("loadTasks")
    this.apiCalls.getAssignments().subscribe((data: AssignmentsDetails[]) => {
      this.taskList = data
      this.filteredTaskList = data
      void this.spinner.hide()
    })
  }

  filterEventsByStatus() {
      console.log(this.selectedFilter.value)
    this.filteredTaskList = this.taskList;
      if (this.selectedFilter.value?.id! < 10 ) {
        this.filteredTaskList = this.taskList.filter(task => task.status === this.selectedFilter.value?.id!)
      }

  }

  filterEventsByKeyword(){
    const textForSearch = this.searchInput.value
    this.filteredTaskList = this.taskList;
    if (textForSearch){
      this.filteredTaskList = this.taskList.filter(task => task.description.toLowerCase().includes(textForSearch.toLowerCase()))
    }
  }

  navigateToEvent(event: AssignmentsDetails){
    this.router.navigate(['/events/input', event.event_id]).then(r => console.log('ok - vracam se doma'));

  }

}

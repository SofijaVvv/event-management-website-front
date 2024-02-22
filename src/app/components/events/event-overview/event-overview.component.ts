import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiCallsService} from "../../../service/api-calls.service";
import {EventDetails} from "../../../interfaces/events";
import {animate, style, transition, trigger} from "@angular/animations";
import {AssignmentsDetails} from "../../../interfaces/assignments";
import {FormControl} from "@angular/forms";




@Component({
  selector: 'app-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.sass'],
  animations: [
    trigger('enter', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('300ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]

})
export class EventOverviewComponent implements OnInit{
eventList: EventDetails[] = []
filteredEventlist: EventDetails[] = []
  selectedEvent: EventDetails = {} as EventDetails;
searchInput = new FormControl('')





  showInput = true;

  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router
  ) { }

ngOnInit(): void {
void this.loadEvents()
}


  async loadEvents() {
    void this.spinner.show()
    console.log("loadUsers")
    this.apiCalls.eventList().subscribe((data: EventDetails[]) => {
      this.eventList = data
      this.filteredEventlist = data
      if (this.eventList.length > 0){
        this.selectedEvent = this.eventList[0]
        this.showInput = true;
      }
      this.spinner.hide()
      console.log(data)
    })
    this.filteredEventlist = this.eventList
  }

  onClickEvent(event: EventDetails){
    this.selectedEvent = event
    console.log(event)
    this.router.navigate(['/events/input', event.id]).then(r => console.log('ok - vracam se doma'));
  }

  addEvent(){
this.router.navigate(['/events/input', 0]).then(r => console.log('ok - vracam se doma'));

  }


  filterEventSearch() {
    this.filteredEventlist = this.eventList;
    const textForSearch = this.searchInput.value || '';
    if (textForSearch){
      this.filteredEventlist = this.eventList.filter(task =>
        task.client.name.toLowerCase().includes(textForSearch.toLowerCase())
      )
    }
  }


}

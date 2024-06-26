import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../../../service/api-calls.service';
import { Details } from '../../../interfaces/events';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shared-overview',
  templateUrl: './shared-overview.component.html',
  styleUrls: ['./shared-overview.component.sass'],
})
export class SharedOverviewComponent implements OnInit {
  locationList: Details[] = [];
  costTypesList: Details[] = [];
  unitsList: Details[] = [];
  revenueTypesList: Details[] = [];
  statusList: Details[] = [];
  eventTypesList: Details[] = [];
  typeOfClientsList: Details[] = [];

  defaultSharedItem: Details = { id: 0, name: '' };
  showInput = false;
  inputCaption = '';
  inputInput = new FormControl('', Validators.required);
  selectedItemType = '';
  selectedItem: Details = this.defaultSharedItem;

  constructor(
    private apiCalls: ApiCallsService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadListOfLocations();
    this.loadClients();
    this.loadCostTypes();
    this.loadUnits();
    this.loadRevenueTypes();
    this.loadStatus();
    this.loadEventType();
  }

  loadListOfLocations() {
    this.apiCalls.getSharedLocations().subscribe((data) => {
      this.locationList = data;
    });
  }

  loadClients() {
    this.apiCalls.getClientTypes().subscribe((data) => {
      this.typeOfClientsList = data;
    });
  }

  loadCostTypes() {
    this.apiCalls.getCostTypes().subscribe((data) => {
      this.costTypesList = data;
    });
  }

  loadUnits() {
    this.apiCalls.getUnits().subscribe((data) => {
      this.unitsList = data;
    });
  }

  loadRevenueTypes() {
    this.apiCalls.getSharedRevenuesTypes().subscribe((data) => {
      this.revenueTypesList = data;
    });
  }

  loadStatus() {
    this.apiCalls.getSharedEventStatuses().subscribe((data) => {
      this.statusList = data;
    });
  }

  loadEventType() {
    this.apiCalls.getSharedEventTypes().subscribe((data) => {
      this.eventTypesList = data;
    });
  }

  closeInput() {
    this.showInput = false;
  }

  updateShared(sharedType: string, item: Details) {
    this.selectedItem = JSON.parse(JSON.stringify(item));
    this.selectedItemType = sharedType;
    if (item.id == 0) {
      this.showInput = true;
      this.inputCaption = 'Add ' + sharedType;
      this.inputInput.setValue('');
    } else {
      this.showInput = true;
      this.inputCaption = 'Edit ' + sharedType;
      this.inputInput.setValue(item.name);
    }
  }

  saveShared() {
    const nameForUpdate = this.inputInput.value;
    if (nameForUpdate === '') {
      Swal.fire({
        title: this.translate.instant('Error'),
        text: this.translate.instant('nameisrequired'),
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.selectedItem.name = nameForUpdate || '';
    const sharedType = this.selectedItemType;
    const dataForUpdate = {
      sharedType: sharedType,
      data: this.selectedItem,
    };
    this.apiCalls
      .sharedUpdate(JSON.stringify(dataForUpdate))
      .subscribe((data) => {
        const returnedId = parseInt(data.message);

        if (this.selectedItem.id === 0) {
          this.selectedItem.id = returnedId;
        }
        Swal.fire({
          title: this.translate.instant('Success'),
          text: this.translate.instant('shareditemupdated'),
          icon: 'success',
          confirmButtonText: 'OK',
        });

        this.loadListOfLocations();
        this.loadClients();
        this.loadCostTypes();
        this.loadUnits();
        this.loadRevenueTypes();
        this.loadStatus();
        this.loadEventType();
        this.showInput = false;
      });
  }
}

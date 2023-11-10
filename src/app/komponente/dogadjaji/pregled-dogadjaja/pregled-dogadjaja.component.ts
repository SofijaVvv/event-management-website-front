import { Component } from '@angular/core';
import {ItemDogadjaj} from "../../../moduli/interfejsi";
import {ApiPoziviService} from "../../../servis/api-pozivi.service";

@Component({
  selector: 'app-pregled-dogadjaja',
  templateUrl: './pregled-dogadjaja.component.html',
  styleUrls: ['./pregled-dogadjaja.component.sass']
})
export class PregledDogadjajaComponent {
  constructor(
    private poziviServis: ApiPoziviService,
  ) {

  }
  listaDogadjaja: ItemDogadjaj[] = []

  ngOnInit(): void {
    this.uzmiListuDogadjaja('01.11.2023', '30.11.2023')
  }

  uzmiListuDogadjaja(oddatuma: string, dodatuma: string){
    this.poziviServis.listaDogadjaja(oddatuma, dodatuma).subscribe(
      (data: any) => {
        console.log(data)
        this.listaDogadjaja = data

      });
  }

}

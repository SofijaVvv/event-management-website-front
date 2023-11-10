import {Component, EventEmitter, Output} from '@angular/core';
import Swal from "sweetalert2";
import {AuthService} from "../../servis/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-glavni-meni',
  templateUrl: './glavni-meni.component.html',
  styleUrls: ['./glavni-meni.component.sass']
})
export class GlavniMeniComponent {
  @Output () zatvoriPregled = new EventEmitter<boolean>();
  constructor(
      private _authServis: AuthService,
      private router: Router,

  ) { }


  koji_meni = "doma"
  ngOnInit(): void {
    // @ts-ignore
    this.koji_meni = this._authServis.citajLokalniStoridz('koji_meni')
  }

  odjavaOperatera() {
    Swal.fire({
      title: 'Odjava',
      text: "Da se odjavim iz programa?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8E4585',
      cancelButtonColor: '#4B4B78',
      confirmButtonText: 'Da, odjavi me!',
      cancelButtonText: 'Nazad na program'
    }).then((result) => {
      if (result.isConfirmed) {
        this._authServis.ocistiLokalniStoridz()
        // this.poziviServis.jeliVidljivLijeviMeni = false
        this.router.navigate(['/login'])
        // this.stateService.go('login')
      }
    })

  }


  dodirnuo(kojimeni: string) {
    // event.target.parentElement.style.backgroundColor = 'red';
    console.log(kojimeni)
    this.koji_meni = kojimeni
    this._authServis.upisLokalniStoridz('koji_meni', kojimeni)
    this.router.navigate([kojimeni])
    this.zatvoriPregled.emit(true);

  }



}

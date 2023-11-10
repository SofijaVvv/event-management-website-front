import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  upisLokalniStoridz(nazivpromjenjive : string, podaci : string) {
    localStorage.setItem(nazivpromjenjive, podaci);
  }
  citajLokalniStoridz(nazivpromjenjive : string) {
    return localStorage.getItem(nazivpromjenjive);
  }
  izbrisiStavkuStoridza(nazivpromjenjive : string) {
    localStorage.removeItem(nazivpromjenjive);
  }
  uzmiToken() {
    return localStorage.getItem('token');
  }

  ocistiLokalniStoridz() {
    localStorage.clear();
  }

}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, finalize, Observable, of} from "rxjs";
import {
    ItemDogadjaj,
    ItemKomitent,
    ItemPrihodi,
    ItemRaspored,
    ItemSifrarnik,
    ItemTroskovi,
    ItemZadatak
} from "../moduli/interfejsi";

@Injectable({
  providedIn: 'root'
})
export class ApiPoziviService {

  constructor(
    private http: HttpClient
  ) { }
  API_SERVIS_LOGOVANJE = 'http://192.168.31.55:9000'
  API_SERVIS = 'http://192.168.31.55:9000/api/dogadjaji'
  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
  public mjeseci = [
    {id: 1, naziv: 'Januar'},
    {id: 2, naziv: 'Februar'},
    {id: 3, naziv: 'Mart'},
    {id: 4, naziv: 'April'},
    {id: 5, naziv: 'Maj'},
    {id: 6, naziv: 'Jun'},
    {id: 7, naziv: 'Jul'},
    {id: 8, naziv: 'Avgust'},
    {id: 9, naziv: 'Septembar'},
    {id: 10, naziv: 'Oktobar'},
    {id: 11, naziv: 'Novembar'},
    {id: 12, naziv: 'Decembar'}
  ]
  public godine = [
    {id: 2023, naziv: '2023'},
    {id: 2024, naziv: '2024'},

  ]
  logovanje2( payload : string) : Observable<any>{
    let podaciForme = JSON.parse(payload)
    const formData = new FormData();
    formData.append('username', podaciForme.email);
    formData.append('password', podaciForme.lozinka);
    formData.append('client_secret', podaciForme.otp);
    return this.http.post(this.API_SERVIS_LOGOVANJE + '/token', formData)
      .pipe(catchError((e: any): Observable<any> => {
        return of(e);
      }), finalize(() => {
      }));
  }

  listaStatusaDogadjaja() : Observable<any>{
    return this.http.get<ItemSifrarnik>(this.API_SERVIS + '/sifrarnik/statusdogadjaja/lista')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

  upisStatusaDogadjaja(podaci:string): Observable<any>{
    const url = this.API_SERVIS + '/sifrarnik/statusdogadjaja/uredi'
    return this.http.post<ItemSifrarnik>(url,podaci,{headers: this.headers})
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

  listaVrstaTroskova() : Observable<any>{
    return this.http.get<ItemSifrarnik>(this.API_SERVIS + '/sifrarnik/vrstetroskova/lista')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

    upisVrstaTroskova(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/sifrarnik/vrstetroskova/uredi'
        return this.http.post<ItemSifrarnik>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }

  listaVrstaDogadjaja() : Observable<any>{
    return this.http.get<ItemSifrarnik>(this.API_SERVIS + '/sifrarnik/vrstedogadjaja/lista')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

    upisVrstaDogadjaja(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/sifrarnik/vrstedogadjaja/uredi'
        return this.http.post<ItemSifrarnik>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }


  listaVrstakomitenata() : Observable<any>{
    return this.http.get<ItemSifrarnik[]>(this.API_SERVIS + '/sifrarnik/vrstakomitenata/lista')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

    upisVrstakomitenata(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/sifrarnik/vrstakomitenata/uredi'
        return this.http.post<ItemSifrarnik>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }

  listakomitenata(vrstakomitenta: number) : Observable<any>{
    return this.http.get<ItemKomitent[]>(this.API_SERVIS + '/komitent/lista/' + vrstakomitenta)
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

    upisKomitenta(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/komitent/uredi'
        return this.http.post<ItemKomitent>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }

    listaZadataka(dogadjaj_id: number) : Observable<any>{
        return this.http.get<ItemZadatak[]>(this.API_SERVIS + '/zadatak/lista/' + dogadjaj_id)
            .pipe(catchError((e: any): Observable<any> => {
                    return of(e);
                }),
                finalize(() => {
                }));
    }

    upisZadatka(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/zadatak/uredi'
        return this.http.post<ItemZadatak>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }

    listaDogadjaja(datumod: string, datumdo: string) : Observable<any>{
        const formData = new FormData();
        formData.append('datumod', datumod);
        formData.append('datumdo', datumdo);
        return this.http.post<ItemDogadjaj[]>(this.API_SERVIS + '/lista', formData)
            .pipe(catchError((e: any): Observable<any> => {
                    return of(e);
                }),
                finalize(() => {
                }));
    }

    upisDogadjaja(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/uredi'
        return this.http.post<ItemDogadjaj>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }
    listaPrihoda(dogadjaj_id: number) : Observable<any>{
        return this.http.get<ItemPrihodi[]>(this.API_SERVIS + '/prihodi/lista/' + dogadjaj_id)
            .pipe(catchError((e: any): Observable<any> => {
                    return of(e);
                }),
                finalize(() => {
                }));
    }

    upisPrihoda(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/prihodi/uredi'
        return this.http.post<ItemPrihodi>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }
    listaRasporeda(dogadjaj_id: number) : Observable<any>{
        return this.http.get<ItemRaspored[]>(this.API_SERVIS + '/raspored/lista/' + dogadjaj_id)
            .pipe(catchError((e: any): Observable<any> => {
                    return of(e);
                }),
                finalize(() => {
                }));
    }

    upisRasporeda(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/raspored/uredi'
        return this.http.post<ItemRaspored>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }
    listaTroskova(dogadjaj_id: number) : Observable<any>{
        return this.http.get<ItemTroskovi[]>(this.API_SERVIS + '/troskovi/lista/' + dogadjaj_id)
            .pipe(catchError((e: any): Observable<any> => {
                    return of(e);
                }),
                finalize(() => {
                }));
    }

    upisTroska(podaci:string): Observable<any>{
        const url = this.API_SERVIS + '/troskovi/uredi'
        return this.http.post<ItemTroskovi>(url,podaci,{headers: this.headers})
        .pipe(catchError((e: any): Observable<any> => {
            return of(e);
            }),
            finalize(() => {
            }));
    }

    kalendar(mjesec: number, godina: number) : Observable<any>{
        return this.http.get<any>(this.API_SERVIS + '/kalendar/' + mjesec + '/' + godina)
            .pipe(catchError((e: any): Observable<any> => {
                    return of(e);
                }),
                finalize(() => {
                }));
    }




}

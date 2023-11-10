import {Component, HostListener} from '@angular/core';
import {ApiPoziviService} from "./servis/api-pozivi.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {AuthService} from "./servis/auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
    animations: [
        trigger('uletiUnos', [
            transition(':enter', [
                style({transform: 'translateX(-100%)'}),
                animate('300ms ease-in', style({transform: 'translateX(0%)'}))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
            ])
        ])
    ]
})
export class AppComponent {
  title = 'gland';
  constructor(
    private poziviServis: ApiPoziviService,
    public _authServis: AuthService,
    private router: Router,
    public jwtHelper: JwtHelperService
  ){}

  ngOnInit(): void {
    console.log(this.jwtHelper.isTokenExpired());
    console.log(this.jwtHelper.getTokenExpirationDate());
    const token = localStorage.getItem('token') || '';
    console.log(this.jwtHelper.decodeToken(token));

  }
    defaultTouch = { x: 0, y: 0, time: 0 };

    @HostListener('touchstart', ['$event'])
    //@HostListener('touchmove', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    handleTouch(event: { touches: any[]; changedTouches: any[]; type: string; timeStamp: number; }) {
        let touch = event.touches[0] || event.changedTouches[0];

        // check the events
        if (event.type === 'touchstart') {
            this.defaultTouch.x = touch.pageX;
            this.defaultTouch.y = touch.pageY;
            this.defaultTouch.time = event.timeStamp;
        } else if (event.type === 'touchend') {
            let deltaX = touch.pageX - this.defaultTouch.x;
            let deltaY = touch.pageY - this.defaultTouch.y;
            let deltaTime = event.timeStamp - this.defaultTouch.time;

            // simulte a swipe -> less than 500 ms and more than 60 px
            if (deltaTime < 500) {
                // touch movement lasted less than 500 ms
                if (Math.abs(deltaX) > 60) {
                    // delta x is at least 60 pixels
                    if (deltaX > 0) {
                        this.doSwipeRight(event);
                    } else {
                        this.doSwipeLeft(event);
                    }
                }

                if (Math.abs(deltaY) > 60) {
                    // delta y is at least 60 pixels
                    if (deltaY > 0) {
                        this.doSwipeDown(event);
                    } else {
                        this.doSwipeUp(event);
                    }
                }
            }
        }
    }
  prikaziGlavniMeni = false

    doSwipeUp(event: any) {
        console.log('swipe up', event);
    }

    doSwipeDown(event: any) {

        console.log('swipe down', event);
    }

    doSwipeLeft(event: any) {
        this.prikaziGlavniMeni = false
        console.log('swipe left', event);
    }

    doSwipeRight(event: any) {
        this.prikaziGlavniMeni = true
        console.log('swipe right', event);
    }

    zatvoriGlavniMeni(event: any){
        this.prikaziGlavniMeni = false
    }

}

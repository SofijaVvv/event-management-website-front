import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appTouchEvents]'
})
export class TouchEventsDirective {

  @Output() touchStart = new EventEmitter();
  @Output() touchEnd = new EventEmitter();
  @Output() swipeLijevo = new EventEmitter();
  @Output() swipeDesno = new EventEmitter();
  @Output() swipeGore = new EventEmitter();
  @Output() swipeDolje = new EventEmitter();


  defaultTouch = { x: 0, y: 0, time: 0 };
  @HostListener('touchstart', ['$event'])
  //@HostListener('touchmove', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event: { touches: any[]; changedTouches: any[]; type: string; timeStamp: number; }) {
    let touch = event.touches[0] || event.changedTouches[0];
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
            this.swipeDesno.emit(event);
          } else {
            this.swipeLijevo.emit(event);
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            this.swipeDolje.emit(event);
          } else {
            this.swipeGore.emit(event);
          }
        }
      }
    }
  }

}

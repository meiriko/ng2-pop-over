import { Component } from '@angular/core';
import { PopOverComponent } from 'ng2-pop-over/pop-over.component';
import { Observable } from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    showOn = 'mouseenter';
    dynamicMessage: Observable<string> = Observable.timer(1000, 1000)
        .map(time => `tick ${time} ...`);
    constructor() {
    }
}

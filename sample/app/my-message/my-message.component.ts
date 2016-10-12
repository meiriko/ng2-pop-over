import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'my-message',
    templateUrl: './my-message.component.html',
    styleUrls: ['./my-message.component.css']
})
export class MyMessageComponent implements OnInit {
    @Input() title: string;
    @Input() content: string;
    constructor() {
    }

    ngOnInit() {
    }

}

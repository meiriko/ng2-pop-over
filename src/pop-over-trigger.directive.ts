import { Directive, Input, OnInit, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { PopOverComponent } from "./pop-over.component";
import { Observable } from "rxjs";

@Directive({
    selector: '[pop-over-trigger]'
})
export class PopOverTrigger implements OnInit, OnChanges {
    @Input('pop-over-trigger') popover: PopOverComponent;
    @Input('show-on') showOn: string;
    @Input('hide-on') hideOn: string;

    constructor(private elRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.hasOwnProperty('showOn')){
            this.setShowOn();
        };
        if(changes.hasOwnProperty('hideOn')){
            this.setHideOn();
        };
    }

    private setHideOn(): void {
        if(this.popover) {
            if(this.hideOn) {
                this.popover.hideOn = Observable.merge(
                        ...this.hideOn.split(',')
                            .map(eventType => eventType.trim())
                            .map((eventType: string): Observable<MouseEvent> => Observable.fromEvent<MouseEvent>(this.elRef.nativeElement, eventType)));
            } else {
                this.popover.hideOn = Observable.empty<MouseEvent>();
            }
        }
    }

    private setShowOn(): void {
        if(this.popover) {
            if(this.showOn) {
                this.popover.showOn = Observable.merge(
                    ...this.showOn.split(',')
                        .map(eventType => eventType.trim())
                        .map((eventType: string): Observable<MouseEvent> => Observable.fromEvent<MouseEvent>(this.elRef.nativeElement, eventType)));
            } else {
                this.popover.showOn = Observable.empty<MouseEvent>();
            }
        }
    }
}

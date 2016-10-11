import {
    Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer,
    OnChanges, SimpleChanges, AfterViewInit
} from '@angular/core';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs/Rx';
@Component({
    selector: 'pop-over',
    styles: [
        `.pop-over-content {
            position: absolute;
            -webkit-box-shadow: 0 0 5px black;
            -moz-box-shadow: 0 0 5px black;
            box-shadow: 0 0 5px black;
            transition: opacity 0.2s ease-in-out;
            background: #FFFFFF;
        }`
    ],
    template: `<div class="pop-over">
        <div #popOverContent class="pop-over-content"
             [class.shown]="visible$ | async">
            <ng-content *ngIf="visible$ | async"></ng-content>
        </div>
    </div>`
})
export class PopOverComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    showOnSubscription: Subscription;
    hideOnSubscription: Subscription;
    @Input('show-on')
    set showOn(value: Observable<MouseEvent>){
        this.showOnSubscription && this.showOnSubscription.unsubscribe();
        value && (this.showOnSubscription = value.subscribe(this.show.bind(this)));
    };
    @Input('hide-on')
    set hideOn(value: Observable<MouseEvent>){
        this.hideOnSubscription && this.hideOnSubscription.unsubscribe();
        value && (this.hideOnSubscription = value.subscribe(this.hide.bind(this)));
    };
    @Input() keepOnClickOutside: boolean;
    @Input('anchor-to') anchorTo: boolean|Node = false;
    @Input() my: string;
    @Input() at: string;
    @Input('x-offset') xOffset: number = 0;
    @Input('y-offset') yOffset: number = 0;
    @ViewChild('popOverContent') content: any;
    visible$: Subject<boolean> = new BehaviorSubject<boolean>(false);
    private originalParent: Node;
    private clickSubscription: Subscription;

    constructor(private elRef: ElementRef, private renderer: Renderer) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.hideOnSubscription && this.hideOnSubscription.unsubscribe();
        this.showOnSubscription && this.showOnSubscription.unsubscribe();
    }

    ngAfterViewInit(): any {
        this.renderer.setElementStyle(this.content.nativeElement, 'opacity', '0');
        return undefined;
    }

    ngOnChanges(changes: SimpleChanges): any {
        if(changes.hasOwnProperty('showOn')){
        } else if(changes.hasOwnProperty('hideOn')){
        }
    }

    private isPosition(parts: Array<string>, type: string): boolean {
        return parts.indexOf(type) >= 0;
    }

    private computeAtPosition(target: any, position: string, xOffset: number = 0, yOffset: number = 0): [number, number] {
        let x: number;
        let y: number;

        let positionParts = (position || '').split(/\s+/);
        if (positionParts.length > 2) {
            console.warn('bad position: ', position);
        }

        let targetPosition = target.getBoundingClientRect();
        if (this.isPosition(positionParts, 'left')) {
            x = targetPosition.left - xOffset;
        } else if (this.isPosition(positionParts, 'right')) {
            x = targetPosition.right + xOffset;
        } else {
            x = (targetPosition.left + targetPosition.right) / 2;
        }

        if (this.isPosition(positionParts, 'top')) {
            y = targetPosition.top - yOffset;
        } else if (this.isPosition(positionParts, 'bottom')) {
            y = targetPosition.bottom + yOffset;
        } else {
            y = (targetPosition.top + targetPosition.bottom) / 2;
        }

        return [x, y];
    }

    private computePosition(el: any, event: MouseEvent): Observable<Array<number>> {
        let baseX: number;
        let baseY: number;

        if (this.anchorTo) {
            let target: any = (this.anchorTo instanceof Node ? this.anchorTo: event.target);
            [baseX, baseY] = this.computeAtPosition(target, this.at);
        } else {
            [baseX, baseY] = [event.clientX, event.clientY];
        }

        return Observable.timer(0)
            .map(() => {
                let [offsetX, offsetY] = this.computeAtPosition(el,
                    (this.my) || '', this.xOffset, this.yOffset);
                let elPosition = el.getBoundingClientRect();
                offsetX = offsetX - elPosition.left;
                offsetY = offsetY - elPosition.top;
                return [baseX - offsetX, baseY - offsetY];
            });
    }

    hide() {
        let el = this.content.nativeElement;
        this.renderer.setElementStyle(el, 'opacity', '0');
        this.visible$.next(false);
        this.originalParent && this.originalParent.appendChild(el);
    }

    show(event: MouseEvent) {
        this.clickSubscription && this.clickSubscription.unsubscribe();
        this.visible$.next(true);
        let el = this.content.nativeElement;
        this.originalParent = el.parentNode;
        el.ownerDocument.body.appendChild(el);
        this.computePosition(el, event)
            .take(1)
            .subscribe(([x, y]) => {
                this.renderer.setElementStyle(el, 'top', y + 'px');
                this.renderer.setElementStyle(el, 'left', x + 'px');
                this.renderer.setElementStyle(el, 'opacity', '1');
                if (!this.keepOnClickOutside) {
                    this.clickSubscription = Observable.timer(0).first().subscribe(() =>
                        this.clickSubscription = Observable.fromEvent(el.ownerDocument, 'click')
                            .filter((md: MouseEvent) => !el.contains(md.target))
                            .first()
                            .subscribe((v) => (this.hide()))
                    );
                }
            });
    }

    toggle(event: MouseEvent) {
        this.visible$
            .first()
            .filter((visible: boolean): boolean => !visible)
            .subscribe(() => {
                this.show(event);
            });
    }
}

import {
    Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer, AfterViewInit
} from '@angular/core';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs/Rx';
@Component({
    selector: 'pop-over',
    styles: [
        `.pop-over-content {
            position: absolute;
            transition: opacity 0.2s ease-in-out;
            background: #FFFFFF;
            z-index: 1060;
        }`
    ],
    template: `<div class="pop-over">
        <div #popOverContent class="pop-over-content" [ngClass]="contentClass"
             [class.shown]="visible$ | async">
            <ng-content *ngIf="visible$ | async"></ng-content>
        </div>
    </div>`
})
export class PopOverComponent implements OnInit, OnDestroy, AfterViewInit {
    private showOnSubscription: Subscription;
    private hideOnSubscription: Subscription;
    private originalParent: Node;
    private clickSubscription: Subscription;
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
    @Input('keep-on-click-outside') keepOnClickOutside: boolean;
    @Input('anchor-to') anchorTo: boolean|Node = false;
    @Input() my: string;
    @Input() at: string;
    @Input('x-offset') xOffset: number = 0;
    @Input('y-offset') yOffset: number = 0;
    @Input('content-class') contentClass: string;
    @ViewChild('popOverContent') content: any;
    visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
        this.renderer.setElementStyle(this.content.nativeElement, 'visibility', 'hidden');
        return undefined;
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

    private computePosition(el: any, event: MouseEvent): [number, number] {
        let baseX: number;
        let baseY: number;
        let boundryMargin: number = 5;
        let bodyPosition = el.ownerDocument.body.getClientRects()[0];

        if (this.anchorTo) {
            let target: any = (this.anchorTo instanceof Node ? this.anchorTo: event.target);
            [baseX, baseY] = this.computeAtPosition(target, this.at);
        } else {
            [baseX, baseY] = [event.clientX, event.clientY];
        }

        let [offsetX, offsetY] = this.computeAtPosition(el,
            (this.my) || '', this.xOffset, this.yOffset);
        let elPosition = el.getBoundingClientRect();
        let pagePosition = el.ownerDocument.body.getBoundingClientRect();
        let documentElement = el.ownerDocument.documentElement;
        offsetX = offsetX - elPosition.left + pagePosition.left;
        offsetY = offsetY - elPosition.top + pagePosition.top;
        return [
            Math.max(boundryMargin - bodyPosition.left, Math.min(
                baseX - offsetX,
                documentElement.clientWidth - bodyPosition.left - elPosition.width - boundryMargin)),
            Math.max(boundryMargin - bodyPosition.top, Math.min(
                baseY - offsetY,
                documentElement.clientHeight - bodyPosition.top - elPosition.height - boundryMargin))
        ];
    }

    hide() {
        this.renderer.setElementStyle(this.content.nativeElement, 'opacity', '0');
        this.renderer.setElementStyle(this.content.nativeElement, 'visibility', 'hidden');
        this.visible$.next(false);
        this.originalParent && this.originalParent.appendChild(this.content.nativeElement);
    }

    show(event: MouseEvent) {
        this.clickSubscription && this.clickSubscription.unsubscribe();
        this.visible$.next(true);
        let el = this.content.nativeElement;
        this.originalParent = el.parentNode;
        el.ownerDocument.body.appendChild(el);
        this.renderer.setElementStyle(this.content.nativeElement, 'visibility', 'inherit');
        Observable.timer(0).take(1).subscribe(() => {
            var [x, y] = this.computePosition(el, event);
            this.renderer.setElementStyle(el, 'top', y + 'px');
            this.renderer.setElementStyle(el, 'left', x + 'px');
            this.renderer.setElementStyle(el, 'opacity', '1');
            if (!this.keepOnClickOutside) {
                this.clickSubscription = Observable.fromEvent(el.ownerDocument, 'click')
                    .skipUntil(Observable.timer(0))
                    .filter((md: MouseEvent) => !el.contains(md.target))
                    .take(1)
                    .subscribe((v) => (this.hide()))
            }
        })
    }

    toggle(event: MouseEvent) {
        this.visible$
            .take(1)
            .subscribe((visible: boolean) => (visible ? this.hide() : this.show(event)));
    }
}

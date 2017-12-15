import { OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
export declare class PopOverComponent implements OnDestroy, AfterViewInit {
    private renderer;
    private showOnSubscription;
    private hideOnSubscription;
    private originalParent;
    private clickSubscription;
    showOn: Observable<MouseEvent>;
    hideOn: Observable<MouseEvent>;
    keepOnClickOutside: boolean;
    anchorTo: boolean | Node;
    my: string;
    at: string;
    xOffset: number;
    yOffset: number;
    contentClass: string;
    content: any;
    visible$: BehaviorSubject<boolean>;
    constructor(renderer: Renderer2);
    ngOnDestroy(): void;
    ngAfterViewInit(): any;
    private isPosition(parts, type);
    private computeAtPosition(target, position, xOffset?, yOffset?);
    private computePosition(el, event);
    hide(): void;
    show(event: MouseEvent): void;
    toggle(event: MouseEvent): void;
}

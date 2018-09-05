import { OnInit, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { PopOverComponent } from "./pop-over.component";
export declare class PopOverTrigger implements OnInit, OnChanges {
    private elRef;
    popover: PopOverComponent;
    showOn: string;
    hideOn: string;
    constructor(elRef: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private setHideOn();
    private setShowOn();
}

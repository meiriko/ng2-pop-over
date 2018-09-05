import { Directive, Input, ElementRef } from '@angular/core';
import { PopOverComponent } from "./pop-over.component";
import { Observable } from "rxjs";
var PopOverTrigger = (function () {
    function PopOverTrigger(elRef) {
        this.elRef = elRef;
    }
    PopOverTrigger.prototype.ngOnInit = function () {
    };
    PopOverTrigger.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('showOn')) {
            this.setShowOn();
        }
        if (changes.hasOwnProperty('hideOn')) {
            this.setHideOn();
        }
    };
    PopOverTrigger.prototype.setHideOn = function () {
        var _this = this;
        if (this.popover) {
            if (this.hideOn) {
                this.popover.hideOn = Observable.merge.apply(Observable, this.hideOn.split(',')
                    .map(function (eventType) { return eventType.trim(); })
                    .map(function (eventType) { return Observable.fromEvent(_this.elRef.nativeElement, eventType); }));
            }
            else {
                this.popover.hideOn = Observable.empty();
            }
        }
    };
    PopOverTrigger.prototype.setShowOn = function () {
        var _this = this;
        if (this.popover) {
            if (this.showOn) {
                this.popover.showOn = Observable.merge.apply(Observable, this.showOn.split(',')
                    .map(function (eventType) { return eventType.trim(); })
                    .map(function (eventType) { return Observable.fromEvent(_this.elRef.nativeElement, eventType); }));
            }
            else {
                this.popover.showOn = Observable.empty();
            }
        }
    };
    PopOverTrigger.decorators = [
        { type: Directive, args: [{
                    selector: '[pop-over-trigger]'
                },] },
    ];
    /** @nocollapse */
    PopOverTrigger.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    PopOverTrigger.propDecorators = {
        "popover": [{ type: Input, args: ['pop-over-trigger',] },],
        "showOn": [{ type: Input, args: ['show-on',] },],
        "hideOn": [{ type: Input, args: ['hide-on',] },],
    };
    return PopOverTrigger;
}());
export { PopOverTrigger };
//# sourceMappingURL=pop-over-trigger.directive.js.map
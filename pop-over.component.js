import { Component, Input, ViewChild, Renderer2 } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
var PopOverComponent = (function () {
    function PopOverComponent(renderer) {
        this.renderer = renderer;
        this.anchorTo = false;
        this.xOffset = 0;
        this.yOffset = 0;
        this.visible$ = new BehaviorSubject(false);
    }
    Object.defineProperty(PopOverComponent.prototype, "showOn", {
        set: function (value) {
            this.showOnSubscription && this.showOnSubscription.unsubscribe();
            value && (this.showOnSubscription = value.subscribe(this.show.bind(this)));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PopOverComponent.prototype, "hideOn", {
        set: function (value) {
            this.hideOnSubscription && this.hideOnSubscription.unsubscribe();
            value && (this.hideOnSubscription = value.subscribe(this.hide.bind(this)));
        },
        enumerable: true,
        configurable: true
    });
    ;
    PopOverComponent.prototype.ngOnDestroy = function () {
        this.hideOnSubscription && this.hideOnSubscription.unsubscribe();
        this.showOnSubscription && this.showOnSubscription.unsubscribe();
    };
    PopOverComponent.prototype.ngAfterViewInit = function () {
        this.renderer.setStyle(this.content.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.content.nativeElement, 'visibility', 'hidden');
        return undefined;
    };
    PopOverComponent.prototype.isPosition = function (parts, type) {
        return parts.indexOf(type) >= 0;
    };
    PopOverComponent.prototype.computeAtPosition = function (target, position, xOffset, yOffset) {
        if (xOffset === void 0) { xOffset = 0; }
        if (yOffset === void 0) { yOffset = 0; }
        var x;
        var y;
        var positionParts = (position || '').split(/\s+/);
        if (positionParts.length > 2) {
            console.warn('bad position: ', position);
        }
        var targetPosition = target.getBoundingClientRect();
        if (this.isPosition(positionParts, 'left')) {
            x = targetPosition.left - xOffset;
        }
        else if (this.isPosition(positionParts, 'right')) {
            x = targetPosition.right + xOffset;
        }
        else {
            x = (targetPosition.left + targetPosition.right) / 2;
        }
        if (this.isPosition(positionParts, 'top')) {
            y = targetPosition.top - yOffset;
        }
        else if (this.isPosition(positionParts, 'bottom')) {
            y = targetPosition.bottom + yOffset;
        }
        else {
            y = (targetPosition.top + targetPosition.bottom) / 2;
        }
        return [x, y];
    };
    PopOverComponent.prototype.computePosition = function (el, event) {
        var baseX;
        var baseY;
        var boundryMargin = 5;
        var bodyPosition = el.ownerDocument.body.getClientRects()[0];
        if (this.anchorTo) {
            var target = (this.anchorTo instanceof Node ? this.anchorTo : event.target);
            _a = this.computeAtPosition(target, this.at), baseX = _a[0], baseY = _a[1];
        }
        else {
            _b = [event.clientX, event.clientY], baseX = _b[0], baseY = _b[1];
        }
        var _c = this.computeAtPosition(el, (this.my) || '', this.xOffset, this.yOffset), offsetX = _c[0], offsetY = _c[1];
        var elPosition = el.getBoundingClientRect();
        var pagePosition = el.ownerDocument.body.getBoundingClientRect();
        var documentElement = el.ownerDocument.documentElement;
        offsetX = offsetX - elPosition.left + pagePosition.left;
        offsetY = offsetY - elPosition.top + pagePosition.top;
        return [
            Math.max(boundryMargin - bodyPosition.left, Math.min(baseX - offsetX, documentElement.clientWidth - bodyPosition.left - elPosition.width - boundryMargin)),
            Math.max(boundryMargin - bodyPosition.top, Math.min(baseY - offsetY, documentElement.clientHeight - bodyPosition.top - elPosition.height - boundryMargin))
        ];
        var _a, _b;
    };
    PopOverComponent.prototype.hide = function () {
        this.renderer.setStyle(this.content.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.content.nativeElement, 'visibility', 'hidden');
        this.visible$.next(false);
        this.originalParent && this.originalParent.appendChild(this.content.nativeElement);
    };
    PopOverComponent.prototype.show = function (event) {
        var _this = this;
        this.clickSubscription && this.clickSubscription.unsubscribe();
        this.visible$.next(true);
        var el = this.content.nativeElement;
        this.originalParent = el.parentNode;
        el.ownerDocument.body.appendChild(el);
        this.renderer.setStyle(this.content.nativeElement, 'visibility', 'inherit');
        Observable.timer(0).take(1).subscribe(function () {
            var _a = _this.computePosition(el, event), x = _a[0], y = _a[1];
            _this.renderer.setStyle(el, 'top', y + 'px');
            _this.renderer.setStyle(el, 'left', x + 'px');
            _this.renderer.setStyle(el, 'opacity', '1');
            if (!_this.keepOnClickOutside) {
                _this.clickSubscription = Observable.fromEvent(el.ownerDocument, 'click')
                    .skipUntil(Observable.timer(0))
                    .filter(function (md) { return !el.contains(md.target); })
                    .take(1)
                    .subscribe(function (v) { return (_this.hide()); });
            }
        });
    };
    PopOverComponent.prototype.toggle = function (event) {
        var _this = this;
        this.visible$
            .take(1)
            .subscribe(function (visible) { return (visible ? _this.hide() : _this.show(event)); });
    };
    PopOverComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pop-over',
                    styles: [
                        ".pop-over-content {\n            position: absolute;\n            transition: opacity 0.2s ease-in-out;\n            background: #FFFFFF;\n            z-index: 1060;\n        }"
                    ],
                    template: "<div class=\"pop-over\">\n        <div #popOverContent class=\"pop-over-content\" [ngClass]=\"contentClass\"\n             [class.shown]=\"visible$ | async\">\n            <ng-content *ngIf=\"visible$ | async\"></ng-content>\n        </div>\n    </div>"
                },] },
    ];
    /** @nocollapse */
    PopOverComponent.ctorParameters = function () { return [
        { type: Renderer2, },
    ]; };
    PopOverComponent.propDecorators = {
        "showOn": [{ type: Input, args: ['show-on',] },],
        "hideOn": [{ type: Input, args: ['hide-on',] },],
        "keepOnClickOutside": [{ type: Input, args: ['keep-on-click-outside',] },],
        "anchorTo": [{ type: Input, args: ['anchor-to',] },],
        "my": [{ type: Input },],
        "at": [{ type: Input },],
        "xOffset": [{ type: Input, args: ['x-offset',] },],
        "yOffset": [{ type: Input, args: ['y-offset',] },],
        "contentClass": [{ type: Input, args: ['content-class',] },],
        "content": [{ type: ViewChild, args: ['popOverContent',] },],
    };
    return PopOverComponent;
}());
export { PopOverComponent };
//# sourceMappingURL=pop-over.component.js.map
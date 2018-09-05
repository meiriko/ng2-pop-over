import { CommonModule } from '@angular/common';
import { PopOverComponent } from './pop-over.component';
import { PopOverTrigger } from './pop-over-trigger.directive';
import { NgModule } from '@angular/core';
var PopoverModule = (function () {
    function PopoverModule() {
    }
    PopoverModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        PopOverComponent,
                        PopOverTrigger
                    ],
                    exports: [
                        PopOverComponent,
                        PopOverTrigger
                    ],
                    entryComponents: [
                        PopOverComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    PopoverModule.ctorParameters = function () { return []; };
    return PopoverModule;
}());
export { PopoverModule };
//# sourceMappingURL=index.js.map
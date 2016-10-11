import { CommonModule } from '@angular/common';
import { PopOverComponent } from './pop-over.component';
import { PopOverTrigger } from './pop-over-trigger.directive';
import { NgModule } from '@angular/core';

@NgModule({
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
})
export class PopoverModule {
}
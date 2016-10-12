import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { PopoverModule } from 'ng2-pop-over';
import { MyMessageComponent } from './my-message/my-message.component';
import { CodeSampleComponent } from './code-sample/code-sample.component';

@NgModule({
    declarations: [
        AppComponent,
        MyMessageComponent,
        CodeSampleComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        PopoverModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

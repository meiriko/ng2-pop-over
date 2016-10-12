# ng2-pop-over

Simple pop over component for angular2 final release.
 The component enables quick insertion of pop over elements.
 This library also contains a pop-over-trigger directive that turns a dom element into a trigger to show or hide a pop-over.

This component can be used as:
* A tooltip.
* A message box.
* To show more details on hover.
* As a lightbox.

See DEMO with code samples.
 
* The component contains minimal styling to reduce dependency on external code and allow maximal flexibility to the user.
* The pop over can be triggered programatically or by using a pop-over-trigger directive.
* The position can be set to be relative to the triggering mouse event, the triggering element or a dom element.

 ## Installation
 
 `npm install --save ng2-pop-over`
 
 Then in your app's module do:
 
 ```
 import { PopoverModule } from 'ng2-pop-over';
 
 @NgModule({
     declarations: [
         AppComponent
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
 ```

 ## Usage
 
 Put the pop over content content inside a `<pop-over>` tag:
 
 ```
 <pop-over>
    <div class="my-own-component">
        <div class="my-own-title">
            Title goes here
        </div>
        <div class="my-content">
            Content goes here
        </div>
    </div>
 </pop-over>
 ```
 
 Using your own components is straight forward, just embed them in a pop over tag:
 ```
 <pop-over>
     <my-message [title]="'Before you go'" [content]="'Did you lock all the doors?'"></my-message>
 </pop-over>
 ```
 
 ## Show or hide your pop over
 
 The pop over's visibility can be controlled in 3 ways:
  * Programatically, using the components `show/hide` functions.
  * By setting the components `show-on/hide-on` properties.
  * By using the auxiliary `pop-over-trigger` directive.

  By default the pop over is closed when the user clicks anywhere outside the pop over.
  To change this behavior, you can set `[keep-on-click-outside]="true"`.
  
  ### Programatically showing/hiding a pop over
  Create your pop over and assign it to a variable (using the `#varName` syntax):
   
  `<pop-over #helpPO>... content </pop-over>`
   
  Then create a trigger element:
   
  `<span (mouseenter)='helpPO.show($event)'>?</span>`
   
  ***IMPORTANT:*** you must pass in the mouse event `($event)`, it is crucial for the positioning (see below).
   
   If you want to hide pop over when leaving the element ,just add:
   
   `(mouseleave)='helpPO.hide()`
   
   You can also use it as a toggle:
   
   `<span (click)='helpPO.toggle($event)'>?</span>`
   
   ### The show-on/hide properties
   The pop over has two input properties `show-on/hide-on` which are `Observable<MouseEvent>`.
   If you set these properties you can show/hide to pop over when the sequence emits a new value.
   These properties are independent and you can use only one of them.
    
   An example for this will be a group of buttons in your app that work only for 'pro' users.
   You can combine the `mouseenter` events of all of them into a single sequence `mouseEnteredAProButton`
   and then show a pop over to the user when he hovers any of them:
   
   ```
   <pop-over [show-on]="mouseEnteredAProButton">
     This feature is for pro users only.
     <a href="/upgrade">Upgrade</a> to unlock the full power ...
   </pop-over>
   ```
   ### The auxiliary `pop-over-trigger` directive
   The library contains an auxiliary directive that can be used for an easy triggering of a pop over.
   The directive takes a variable that references the pop over and a `show-on/hide-on` inputs (both or just one)
   that indicate on which events to trigger the pop over. For example:
    
   ```
    <pop-over #myPopOver>...<pop-over>
    <span [pop-over-trigger]="myPopOver"
        [show-on]="'mouseenter'"
        [hide-on]="'mouseleave,click'">help</span>
   ```
   
   You can specify multiple event types separated by commas.
    
   ***Note:*** this directive actually sets the pop over's `show-on/hide-on` properties.
   This means that you can not attach multiple triggers to the same pop over since they
   will override each other's settings. Also, if you did attach a `show-on/hide-on` directly
   to the pop over, do not use a `pop-over-trigger` since it will override these values.
 
 ## Positioning
 
 The pop over's position is composed of:
 * An anchor - what the attach to (dom element or mouse event). Set by the `[anchor-to]` property.
 * Attachment type - how to attach (top, bottom, right, left etc.). Set by the `[at]` and `[my]` properties.
 * Offsets - x/y offsets applied to the final calculation. Set by the  `[x-offset]` and `[y-offset]` properties
 
 ###The anchor
 
 The anchor is determined using the `[anchor-to]` property
 
 * (Default) `[anchor-to]="false"` Use the mouse event's position as the anchor base.
 * `[anchor-to]="true"` Use the triggering element as the anchor base.
 * `[anchor-to]="someElement"` Use a previously defined #someElement as the anchor base.
 
 ###The attachment type
 The attachment type is inspired by the great [qtip2 library](http://qtip2.com/). It instructs the pop over
 how to position it self relative to the anchor base. It is composed of 2 parts:
 * `[my]` - relates to the pop over's dimension.
 * `[at]` - relates to the anchor (if it is an element and not a mouse event) dimensions.
  
 The values can be any of top/bottom/left/right/middle/center, where middle and center are the defaults.

 Some examples:
 * Position a pop over next to and below the mouse: `<pop-over [my]="top left" [at]="bottom right">...</pop-over>`
 * Position a pop over (center) below the mouse `<pop-over [my]="top">...</pop-over>`
 * Position a pop over next to (left) the triggering element, vertically aligned `<pop-over [anchor-to]="true" [my]="left" [at]="right">...</pop-over>`
 
 ###Offsets
 After finishing with the calculations, an offset can be added. So for example, if we'd like to show a pop over at the mouse
 but give it a little space so it does not appear to be over the cursor, we can add `x-offset/y-offset`:
 
 `<pop-over [my]="top left" [x-offset]="5" [y-offset]="5">...</pop-over>`
 
 ## Styling
 
 The PopOverComponent provides only 2 very basic styling:
 * Defines position to be absolute. Do not change this!
 * Defines the background to be #FFFFFF (white).
 * Defines a transition on the opacity for showing/hiding the pop over.

 These styles can be modified using the global css:
 ```
 .pop-over-content {
    background: none!important;
 }
 ```

 Most content will do just fine with the existing styling. The only case you might need to modify the background is if you'd like to give the border a radius.
 
 **Note:** to reduce complexity the component always moves the content to document when displayed and returns it to its original dom element when hidden. In the future the library might support leaving the displayed pop-over in its original dom parent.
  This is why styling of the `background` needs to be done in the global css.
  
  For example, to create a green-ish pop over with rounded corners and a shadow, use the following styling:
  
  In the application's global css file:
  ```
  .pop-over-content {
      background: none!important;
  }
  ```
  
  And then in your specific component css file:
  ```
  .my-pop-over {
      background: #AAFFAA;
      padding: 5px;
      width: 200px;
      height: 100px;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      -webkit-box-shadow: 0 0 5px black;
      -moz-box-shadow: 0 0 5px black;
      box-shadow: 0 0 5px black;
  }
  ```
  
  If you're happy with the default background and would like to remove it only for a specific pop over,
  you can use the `content-class` input property and decorate it with your own class:
  
  `<pop-over [content-class]="'my-pop-over-content'">`
  
  And then in your global css file:
  
  ```
  .my-pop-over-content {
    background: none!important;
  }
  ```
  (do not forget the !important)
  
##Full options documentation

###PopOverComponent
```
<pop-over
    [show-on]="observableOfMouseEvent"
    [hide-on]="observableOfMouseEvent"
    [anchor-to]="true|false|nodeReference"
    [my]="left|right|center top|middle|bottom"
    [at]="left|right|center top|middle|bottom"
    [x-offset]="number"
    [y-offset]="number"
    [content-class]="class-name-string"
    [keep-on-click-outside]="boolean">
    .... content goes here ....
</pop-over>
```
* `[show-on]` an observable of mouse events that triggers the appearance of the pop over. Default is *none*;
* `[hide-on]` an observable of mouse events that hides the pop over. Default is *none*;
* `[anchor-to]` a boolean(yes/no) or a node to anchor the pop over to. If set to false, attaches to the mouse event itself,
if set to true, attaches to the triggering element. If it is a dom element, attaches to the element. Default is *false*;
* `[my]` a string to describe the attachment point of the pop over, a combination of left|center|right and top|middle|bottom.
Defaults is *center middle*.
* `[at]` a string to describe the attachment point to the anchor (in case it is not the mouse event), a combination of left|center|right and top|middle|bottom.
Defaults is *center middle*.
* `[x-offset]` the number of pixels to horizontally offset the pop over after doing all layout calculations. Default is *0*
* `[y-offset]` the number of pixels to vertically offset the pop over after doing all layout calculations. Default is *0*
* `[content-class]` and extra class name to decorate the pop-over element to make it possible to modify it by a specific css rule. Default *''* (empty).
* `keep-on-click-outside` a boolean to specify if we want to keep the pop over open even if the user clicked outside.

###PopOverTrigger
```
<any [pop-over-trigger]="popOverRef"
    [show-on]="comma_separated_event_types"
    [hide-on]="comma_separated_event_types">
</any>
```
* `[pop-over-trigger]` a reference to a previously defined pop over. Default: *''* (empty);
* `[show-on]` a comma separated list of event types to show the target pop over on. Example: 'click,mouseenter'. Default: *''* (empty);
* `[hide-on]` a comma separated list of event types to hide the target pop over on. Example: 'click,mouseenter'. Default: *''* (empty);
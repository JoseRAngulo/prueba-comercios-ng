import { Component, ContentChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { EditModeDirective } from 'src/app/directives/edit-mode.directive';
import { ViewModeDirective } from 'src/app/directives/view-mode.directive';
import { filter, take, switchMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-editable',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.css']
})
export class EditableComponent implements OnInit {
  @Output() update = new EventEmitter();
  @ContentChild(ViewModeDirective, {static: true}) viewModeTpl: ViewModeDirective;
  @ContentChild(EditModeDirective, {static: true}) editModeTpl: EditModeDirective;

  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  mode: 'view' | 'edit' = 'view';
  constructor(
    private host: ElementRef
  ) { }

  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnInit() {
    this.viewModeHandler();
    this.editModeHandler();
  }

  private get element() {
    console.log(this.host.nativeElement);
    return this.host.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.element, 'dblclick').
      subscribe(() => {
        this.mode = 'edit';
        this.editMode.next(true);
      });
  }
  private editModeHandler() {
    const clickOutside$ = fromEvent(document, 'dblclick').pipe(
      filter((event) => {
        return this.element.contains(event.target) === false;
      }),
      take(1)
    );

    this.editMode$.pipe(
      switchMapTo(clickOutside$),
    ).subscribe(event => {
      this.update.next();
      this.mode = 'view';
    });
  }

  toViewMode() {
    this.update.next();
    this.mode = 'view';
  }
}

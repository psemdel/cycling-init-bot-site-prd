import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RoutingModule, routes } from '@app/routing.module';
import { DebugElement, Type } from '@angular/core';

import { By } from '@angular/platform-browser';
import { Router, RouterLinkWithHref } from '@angular/router';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

class Page {
  aboutLinkDe: DebugElement;
  dashboardLinkDe: DebugElement;
  heroesLinkDe: DebugElement;

  // for debugging
  comp: AppComponent;
  location: SpyLocation;
  router: Router;
  fixture: ComponentFixture<AppComponent>;

  constructor() {
    const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    this.aboutLinkDe     = links[2];
    this.dashboardLinkDe = links[0];
    this.heroesLinkDe    = links[1];

    // for debugging
    this.comp    = comp;
    this.fixture = fixture;
    this.router  = router;
  }
}

function createComponent() {
  fixture = TestBed.createComponent(AppComponent);
  comp = fixture.componentInstance;

  const injector = fixture.debugElement.injector;
  location = injector.get(Location) as SpyLocation;
  router = injector.get(Router);
  router.initialNavigation();
  advance();

  page = new Page();
}

function expectPathToBe(path: string, expectationFailOutput?: any) {
  expect(location.path()).toEqual(path, expectationFailOutput || 'location.path()');
}

function expectElementOf(type: Type<any>): any {
  const el = fixture.debugElement.query(By.directive(type));
  expect(el).toBeTruthy('expected an element for ' + type.name);
  return el;
}

function advance(): void {
  tick(); // wait while navigating
  fixture.detectChanges(); // update view
  tick(); // wait for async data to arrive
}

export const ButtonClickEvents = {
   left:  { button: 0 },
   right: { button: 2 }
};

function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let router: Router;
let page: Page;
let location: SpyLocation;

describe('RouterTestingModule', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
     declarations: [
        HomeComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
      ],
    })
    .compileComponents();
  }));
  
  it('should navigate to "home" immediately', fakeAsync(() => {
    createComponent();
    tick(); // wait for async data to arrive
    expectPathToBe('/home', 'after initialNavigation()');
    expectElementOf(HomeComponent);
  }));
  
   it('should navigate to create rider', fakeAsync(() => {
    createComponent();
    click(page.aboutLinkDe);

    advance();
    expectPathToBe('/home', 'after initialNavigation()');
    expectElementOf(HomeComponent);
  })); 
  
  
  });
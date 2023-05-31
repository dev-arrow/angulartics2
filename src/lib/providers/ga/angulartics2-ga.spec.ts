import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from './angulartics2-ga';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('Angulartics2GoogleAnalytics', () => {
  let ga: any;
  let _gaq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: Location, useClass: SpyLocation },
        Angulartics2GoogleAnalytics
      ]
    });
    window.ga = ga = jasmine.createSpy('ga');
    window._gaq = _gaq = [];
  });

  it('should track pages',
    fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
      (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        angulartics2.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'pageview', '/abc');
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
      (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        angulartics2.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'event', {
          eventCategory: 'cat',
          eventAction: 'do',
          eventLabel: undefined,
          eventValue: undefined,
          nonInteraction: undefined,
          page: '/',
          userId: null,
          hitCallback: undefined,
        });
      },
    )),
  );

  it('should track events with hitCallback',
    fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
        (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          fixture = createRoot(RootCmp);
          const callback = function() { };
          angulartics2.eventTrack.next({ action: 'do', properties: { category: 'cat', hitCallback: callback } });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('send', 'event', {
            eventCategory: 'cat',
            eventAction: 'do',
            eventLabel: undefined,
            eventValue: undefined,
            nonInteraction: undefined,
            page: '/',
            userId: null,
            hitCallback: callback,
          });
      })));

  it('should track exceptions',
    fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
      (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        angulartics2.exceptionTrack.next({ fatal: true, description: 'test' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'exception', { exFatal: true, exDescription: 'test' });
      }),
    ),
  );

  it('should set username',
    fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
        (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          fixture = createRoot(RootCmp);
          angulartics2.setUsername.next('testuser');
          advance(fixture);
          expect(angulartics2.settings.ga.userId).toBe('testuser');
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
      (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        angulartics2.setUserProperties.next({ dimension1: 'test' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('set', 'dimension1', 'test');
        angulartics2.setUserProperties.next({ metric1: 'test' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('set', 'metric1', 'test');
      }),
    ),
  );

    it('should set user properties on all account names',
      fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
        (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          fixture = createRoot(RootCmp);
          angulartics2.settings.ga.additionalAccountNames.push('additionalAccountName');
          angulartics2.settings.ga.additionalAccountNames.push('additionalAccountNameTwo');
          angulartics2.setUserProperties.next({ dimension1: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('set', 'dimension1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountName.set', 'dimension1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountNameTwo.set', 'dimension1', 'test');
          angulartics2.setUserProperties.next({ metric1: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('set', 'metric1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountName.set', 'metric1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountNameTwo.set', 'metric1', 'test');
        }),
      ),
    );

  it('should track user timings',
    fakeAsync(inject([Location, Angulartics2, Angulartics2GoogleAnalytics],
      (location: Location, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        angulartics2.userTimings.next({ timingCategory: 'cat', timingVar: 'var', timingValue: 100 });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'timing', { timingCategory: 'cat', timingVar: 'var', timingValue: 100 });
      }),
    ),
  );

});

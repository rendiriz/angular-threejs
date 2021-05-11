import { NgModule, Inject, LOCALE_ID, PLATFORM_ID, APP_ID } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

// LOCATION
import { Location, registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

// SERVICE
import { GlobalService } from '@services';

// MODULE
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '@core/shared.module';

// COMPONENT
import { AppComponent } from './app.component';

// COMPONENT (PUBLIC)
import { PageComponent as PublicPageComponent } from '@templates/public/container/page/page.component';

// LOCALIZE
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LocalizeRouterModule, LocalizeRouterSettings, LocalizeParser } from '@gilsdav/ngx-translate-router';
import { LocalizeRouterHttpLoader } from '@gilsdav/ngx-translate-router-http-loader';

registerLocaleData(localeId);

export function translateLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, `${environment.locales}assets/locales/`, '.json');
}

export function localizeLoaderFactory(
  translate: TranslateService,
  location: Location,
  settings: LocalizeRouterSettings,
  http: HttpClient
): any {
  return new LocalizeRouterHttpLoader(
    translate,
    location,
    settings,
    http,
    `${environment.locales}assets/locales.json`
  );
}

@NgModule({
  declarations: [AppComponent, PublicPageComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'angular-threejs' }),
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutingModule, {
      scrollPositionRestoration: 'top',
      initialNavigation: 'disabled',
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient],
      },
    }),
    LocalizeRouterModule.forRoot(AppRoutingModule, {
      parser: {
        provide: LocalizeParser,
        useFactory: localizeLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient],
      },
      initialNavigation: true,
    }),
    SharedModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'id',
    },
    Title,
    GlobalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: object, @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}

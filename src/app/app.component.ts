import { Component } from '@angular/core';

import { GlobalService } from '@services';

import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-root',
  template: `
    <ngx-loading-bar [includeSpinner]="false" color="#09B8F1"></ngx-loading-bar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'angular-threejs';
  lang!: string;

  constructor(
    private globalService: GlobalService,
    private translateService: TranslateService,
    private localizeService: LocalizeRouterService
  ) {
    this.translateService.setDefaultLang('id');
    this.translateService.use('id');
    this.localizeService.changeLanguage('id');

    const currentLang = this.translateService.currentLang;

    if (currentLang === undefined) {
      this.translateService.use('id');
      this.localizeService.changeLanguage('id');
    } else if (currentLang === 'id' || currentLang === 'en') {
      this.translateService.use(currentLang);
      this.localizeService.changeLanguage(currentLang);
    }

    this.globalService.changeCanonicalURL();
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PACKAGE
import { TranslateModule } from '@ngx-translate/core';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // PACKAGE
    TranslateModule,
    LocalizeRouterModule,
    LoadingBarRouterModule,
  ],
  declarations: [],
  exports: [
    RouterModule,
    // PACKAGE
    TranslateModule,
    LocalizeRouterModule,
    LoadingBarRouterModule,
  ],
  providers: [],
})
export class SharedModule {}

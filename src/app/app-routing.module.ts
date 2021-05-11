import { Routes } from '@angular/router';

// COMPONENT (PUBLIC)
import { PageComponent as PublicPageComponent } from '@templates/public/container/page/page.component';

export const AppRoutingModule: Routes = [
  {
    path: '',
    component: PublicPageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/example/example.module').then((m) => m.ExampleModule),
      },
      {
        path: 'home',
        loadChildren: () => import('./views/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'example',
        loadChildren: () => import('./views/example/example.module').then((m) => m.ExampleModule),
      },
    ],
  },
];

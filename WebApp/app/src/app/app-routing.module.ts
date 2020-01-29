import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component'


const routes: Routes = [
  {
    path: '', redirectTo: '/accueil', pathMatch: 'full'
  },
  {
    path: 'accueil', component: HomepageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

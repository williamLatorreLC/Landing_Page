import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListaCasosComponent } from './components/lista-casos/lista-casos.component';
import { RegistroFinalComponent } from './components/registro-final/registro-final.component';
import { RegistroResolutorComponent } from './components/registro-resolutor/registro-resolutor.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'listaCasos',
    component: ListaCasosComponent
  },
  {
    path: 'registroFinal',
    component: RegistroFinalComponent
  },
  {
    path: 'registroResolutor',
    component: RegistroResolutorComponent
  },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

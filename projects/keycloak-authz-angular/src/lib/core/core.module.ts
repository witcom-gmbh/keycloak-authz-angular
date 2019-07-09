import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakAuthorizationService } from './services/keycloak-authorization.service';
import { EnableForKeycloakAuthorizationDirective } from './directives/enable-for-keycloak-authorization.directive';

@NgModule({
  declarations: [EnableForKeycloakAuthorizationDirective],
  imports: [
    CommonModule
  ],
  exports: [
    EnableForKeycloakAuthorizationDirective
  ] 
})
export class CoreModule { }

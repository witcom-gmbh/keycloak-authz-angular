# Keycloak Authorization for Angular

[![npm version](https://badge.fury.io/js/keycloak-authz-angular.svg)](https://badge.fury.io/js/keycloak-authz-angular)
![npm](https://img.shields.io/npm/dm/keycloak-authz-angular.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/witcom-gmbh/keycloak-authz-angular/badge.svg)](https://snyk.io/test/github/witcom-gmbh/keycloak-authz-angular)

> Keycloak Authorization Addon for keycloak-angular

---

- [About](#about)
- [Install](#install)
- [Setup](#setup)
  - [Angular & Keycloak](#angular)
  - [Angular Authorization](#angular-authorization)
  - [Keycloak](#keycloak)
- [AuthGuard](#authguard)
- [License](#license)

---

## About

This library adds Keycloak fine-grained authorization policies (https://www.keycloak.org/docs/6.0/authorization_services/) to the great keycloak-angular library by Mauricio Vigolo (https://github.com/mauriciovigolo/keycloak-angular)
It provides the following features

- A **Keycloak Authorization Service** which uses the Keycloak API to get entitlements/permissions for the logged-in user
- Generic **AuthGuard implementation**, so you can customize your own AuthGuard logic inheriting the authentication logic and the permissions/authorizations load
- An **Angular directive** wheich enables/disables HTML-Elements bases on permission
- Documentation that helps to configure this library with your angular app

## Install

### Versions
This library depends on keycloak-angular, and therefore on angular and keycloak-js. Following combinations have been tested

| keycloak-angular-authz | keycloak-angular | Angular | Keycloak | SSO-RH |
| :--------------------: | :--------------: | :-----: | :------: | :----: |
|         1.x.x          |      6.x.x       |    7    |    4     |   -    |

### Steps to install using NPM or YARN

> Please, again, be aware to choose the correct version, as stated above. Installing this package without a version will make it compatible with the **latest** angular and keycloak versions.

In your angular application directory:

With npm:

```sh
npm install --save keycloak-angular@<choosen-version-from-table-above>
```

With yarn:

```sh
yarn add keycloak-angular@<choosen-version-from-table-above>
```

## Setup

### Angular
Please follow the documentation here https://github.com/mauriciovigolo/keycloak-angular

### Angular Authorization
It makes sense to initialize keycloak-authorization directly after having initialized keycloak-angular.
When initializing the authorization you can provide an default resource-server-id for which all entitlements are loaded.
So if you are using APP_INITIALIZER you could do it like this

```js
import { KeycloakService } from 'keycloak-angular';
import {KeycloakAuthorizationService} from 'keycloak-authz-angular';
import { environment } from '../../environments/environment';

export function kcInitializer(keycloak: KeycloakService,authService:KeycloakAuthorizationService): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: environment.keycloakConfig,
          initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false
          }, 
          bearerPrefix: 'Bearer',
          bearerExcludedUrls: []
        });
        await authService.init({
          config: environment.keycloakConfig,
          initOptions: {
            defaultResourceServerId: 'my-resource-id'
          }}); 
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}
```
Basically you wait for the initialization of both keycloak & keycloak authorization to finish before proceeding.In that case all permissions are available for further use immediately after initialization. It is possible to retrieve entitlements for multiple resource-servers - just call the getAuthorizations(NAME-OF-RESOURCE-SERVER) Method multiple times.
You can use the same keycloak-configuration object for keycloak-angular and keycloak-authz-angular.

## AuthGuard
The generic AuthGuard "KeycloakAuthzAuthGuard" that is provided by the library follows the sames principles as the AuthGuard which is included in the keycloak-angular library - except that it uses permissions instead of roles. In your implementation you just need to implement the desired security logic.

```js
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';
import {KeycloakAuthorizationService,KeycloakAuthzAuthGuard} from 'keycloak-authz-angular';

@Injectable()
export class AppAuthGuard extends KeycloakAuthzAuthGuard {
  constructor(protected router: Router, protected keycloakAngular: KeycloakService, protected keycloakAuth: KeycloakAuthorizationService) {
    super(router, keycloakAngular,keycloakAuth);
  }
  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login();
        return;
      }
      const requiredRoles = route.data.roles;
      const requiredPermissions = route.data.permissions;
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return resolve(true);
      } else {
        if (!this.permissions || this.permissions.length === 0) {
          resolve(false);
        }
        let granted: boolean = false;
        for (const requiredPermission of requiredPermissions) {
            if (this.keycloakAuth.checkAuthorization(requiredPermission)){
                granted = true;
                break;
            }
        }
        resolve(granted);
      }
    });
  }
}
```

The routing-module itself can be configured like this. In that case the link is available to users that either

- have read scope on resource resource1
or
- access to resource resource2 regardless of the scope

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import { AuthztestComponent } from './authztest/authztest.component';
import { AppAuthGuard } from './app-authguard';

const routes: Routes = [
    {
      path: 'home', component: HomeComponent      
    },
    {
      path: 'authztest', component: AuthztestComponent,canActivate: [AppAuthGuard] ,data:{permissions:[{
          rsname:"resource1",
          scope:"view" 
      },
      {
          rsname:"resource2"
      }
      ]}
    },
    {
        path: '', redirectTo: '/home', pathMatch: 'full' 
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
providers: [AppAuthGuard]
})
export class AppRoutingModule { }
```

## Directive for enabling HTML-Elements based on authorization
A very basic directive that enables HTML-Elements only if the user has the required entitlement for a resource/resource and scope. 
It is included in the library and has to imported as an Angular-Module, e.g. in app.module

```js
import { KeycloakAuthzAngularModule } from 'keycloak-authz-angular';
@NgModule({
  declarations: [
  ...
  ],
  imports: [
    ...
    KeycloakAuthzAngularModule,
    ...
  ],
  ...
})
```
The name of the directive is **enableForKeycloakAuthorization** and it takes a single required permission as a parameter. The permission can either be a resource, or a combination of resource and scope separated by a #
It should be easy to adopt it for your own directives

This example only enables the button if the user has an entitlement for reource **resource** and resource-scope **create**
```html
<button enableForKeycloakAuthorization="resource#create" type="button" class="ui-button-raised"></button>
```

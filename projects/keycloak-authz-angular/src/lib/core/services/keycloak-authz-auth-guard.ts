import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService} from 'keycloak-angular';
import { KeycloakAuthorizationService} from './keycloak-authorization.service';
import {KeycloakResourcePermission} from '../interfaces/keycloak-permissions';

/**
 * A simple guard implementation out of the box. This class should be inherited and
 * implemented by the application. The only method that should be implemented is #isAccessAllowed.
 * The reason for this is that the authorization flow is usually not unique, so in this way you will
 * have more freedom to customize your authorization flow.
 */
export abstract class KeycloakAuthzAuthGuard implements CanActivate {
  /**
   * Indicates if the user is authenticated or not.
   */
  protected authenticated: boolean;
  /**
   * Roles of the logged user. It contains the clientId and realm user roles.
   */
  protected permissions: KeycloakResourcePermission[];

  constructor(protected router: Router, protected keycloakAngular: KeycloakService, protected keycloakAuth: KeycloakAuthorizationService) {}

  /**
   * CanActivate checks if the user is logged in and get the full list of authorizations
   * that ave been retrieved so far of the logged user. This values are set to
   * authenticated and permissions properties.
   *
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        this.authenticated = await this.keycloakAngular.isLoggedIn();
        this.permissions = this.keycloakAuth.getPermissions();

        const result = await this.isAccessAllowed(route, state);
        resolve(result);
      } catch (error) {
        reject('An error happened during access validation. Details:' + error);
      }
    });
  }

  /**
   * Create your own customized authorization flow in this method. From here you already known
   * if the user is authenticated (this.authenticated) and the user permissions (this.permissions).
   *
   * @param route
   * @param state
   */
  abstract isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean>;
}
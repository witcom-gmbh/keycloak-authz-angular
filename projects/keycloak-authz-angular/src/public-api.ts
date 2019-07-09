/*
 * Public API Surface of keycloak-authz-angular
 */


export {KeycloakAuthzOptions} from './lib/core/interfaces/keycloak-authz-options';
export {KeycloakAuthzInitOptions} from './lib/core/interfaces/keycloak-authz-init-options';
export {KeycloakAuthorizationRequest,
ResourcePermission,
KeycloakAuthorizationRequestMetaData} from './lib/core/interfaces/keycloak-authorization-request';
export {KeycloakResourcePermissions,
KeycloakResourcePermissionsCheck} from './lib/core/interfaces/keycloak-permissions';

export { EnableForKeycloakAuthorizationDirective } from './lib/core/directives/enable-for-keycloak-authorization.directive';
export { KeycloakAuthorizationService } from './lib/core/services/keycloak-authorization.service';
export { CoreModule } from './lib/core/core.module';
export { KeycloakAuthzAngularModule } from './lib/keycloak-authz-angular.module';

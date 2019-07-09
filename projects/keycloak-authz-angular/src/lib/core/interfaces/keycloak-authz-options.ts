import { KeycloakAuthzInitOptions } from './keycloak-authz-init-options';
import { KeycloakConfig} from 'keycloak-angular';


export interface KeycloakAuthzOptions {
    
    config: KeycloakConfig;
    
    /**
     * Options to initialize the adapter. Used by keycloak-js.
     */
    initOptions?: KeycloakAuthzInitOptions;
    
}

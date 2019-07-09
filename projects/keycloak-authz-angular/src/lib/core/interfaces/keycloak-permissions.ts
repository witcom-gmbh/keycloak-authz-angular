export interface KeycloakResourcePermissions {
    
    /**
     * The id of a resource.
     */
    rsid:string;

    /**
     * The name of a resource.
     */    
    rsname?:string;

    /**
     * An array of strings where each value is the name of a scope associated with the resource.
     */
    scopes?:string[];    
    
}

export interface KeycloakResourcePermissionsCheck {
    
    /**
     * The name of a resource to check permissions against.
     */
    rsname:string;

    /**
     * Then name of a scope associated with the resource.
     */
    scope?:string;    
    
}
export interface KeycloakAuthorizationRequestMetaData {
    
    
    /**
     * A boolean value indicating to the server if resource names should be included in the RPT’s permissions.
     * If false, only the resource identifier is included.
     */
    responseIncludeResourceName?:any;

    /**
     * An integer N that defines a limit for the amount of permissions an RPT can have. When used together with
     * rpt parameter, only the last N requested permissions will be kept in the RPT.
     */
    responsePermissionsLimit?:number;

}

export interface ResourcePermission {
    /**
     * The id or name of a resource.
     */
    id:string;

    /**
     * An array of strings where each value is the name of a scope associated with the resource.
     */
    scopes?:string[];
}


export interface KeycloakAuthorizationRequest {
    
    /**
     * An array of objects representing the resource and scopes.
     */
    permissions?:ResourcePermission[];

    
    claimToken?:string;

    claimTokenFormat?:string;

    /**
     * Defines additional information about this authorization request in order to specify how it should be processed
     * by the server.
     */    
    metadata?:KeycloakAuthorizationRequestMetaData;
}

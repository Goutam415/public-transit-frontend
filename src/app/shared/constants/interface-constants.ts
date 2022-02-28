export interface ItemResponse {
    message: string;
    payload: RouteItem;
}

export interface RouteItem {
    _id?: string;
    direction?: string;
    name?: string;
    routeId?: string;
    status?: string;
    stops?: [RouteStop];
} 

export interface RouteStop {
    lat: number;
    lng: number;
    name?: string
    stopId?: string;
    _id?: string;
}

export interface ListResponse {
    message: string;
    payload: any[];
}
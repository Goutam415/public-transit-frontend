import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP_CONSTANT } from '../../constants/http-constant';
import { ItemListResponse, ItemResponse, RouteItem } from '../../constants/interface-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  readonly endpoint = 'user-routes'
  
  readonly httpConstant = HTTP_CONSTANT;

  constructor(private http: HttpClient) {}

  saveRoute(routeDetails: RouteItem) {
    return this.http.post<ItemResponse>(`${this.httpConstant}${this.endpoint}`, routeDetails);
  }

  getRouteById(routeId: string) {
    return this.http.get<ItemResponse>(`${this.httpConstant}${this.endpoint}/${routeId}`)
  }

  updateRoute(routeId: string, routeDetails: RouteItem) {
    return this.http.patch<ItemResponse>(`${this.httpConstant}${this.endpoint}/${routeId}`, routeDetails);
  }

  deleteRoute(routeId) {
    return this.http.delete<ItemResponse>(`${this.httpConstant}${this.endpoint}/${routeId}`);
  }

  getAllRoutes() {
    return this.http.get<ItemListResponse>(`${this.httpConstant}${this.endpoint}`);
  }

  deleteSelectedRoutes(routeIds: any[]) {
    return this.http.post<ItemResponse>(`${this.httpConstant}${this.endpoint}/delete`, routeIds);
  }
}

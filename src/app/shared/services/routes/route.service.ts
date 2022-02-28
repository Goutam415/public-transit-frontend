import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP_CONSTANT } from '../../constants/http-constant';
import { ItemResponse } from '../../constants/interface-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  readonly endpoint = 'user-routes'
  
  readonly httpConstant = HTTP_CONSTANT;

  constructor(private http: HttpClient) {}

  saveRoute(routeDetails) {
    return this.http.post<ItemResponse>(`${this.httpConstant}${this.endpoint}`, routeDetails);
  }

  getRouteById(routeId) {
    return this.http.get<ItemResponse>(`${this.httpConstant}${this.endpoint}/${routeId}`)
  }

  updateRoute(routeId, routeDetails) {
    return this.http.patch<ItemResponse>(`${this.httpConstant}${this.endpoint}/${routeId}`, routeDetails);
  }
}

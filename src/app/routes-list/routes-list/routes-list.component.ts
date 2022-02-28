import { Component, OnInit } from '@angular/core';
import { RouteItem, RouteStop } from 'src/app/shared/constants/interface-constants';
import { ToastNotificationService } from 'src/app/shared/notification/notification.service';
import { RouteService } from 'src/app/shared/services/routes/route.service';

declare var google: any;
@Component({
  selector: 'app-routes-list',
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.scss']
})
export class RoutesListComponent implements OnInit {

  constructor(private routeService: RouteService, private toast: ToastNotificationService) { }

  routesList: RouteItem[];

  map: any;

  markers = [];

  readonly bounds = new google.maps.LatLngBounds();

  readonly polylinePath = new google.maps.Polyline({
    path: [],
    geodesic: false,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });
  ngOnInit(): void {
    this.getRoutesList();
  }

  deactivateRoute(routeId) {
    console.log('clicked deactive ');
  }

  private getRoutesList() {
    this.routeService.getAllRoutes()
    .subscribe(response => {
      this.routesList = response.payload;
      if (this.routesList.length) {
        this.loadMap();
        setTimeout(() => {
          this.addMarker(this.routesList[0].stops, this.routesList[0].direction);
        }, 2000);
      }
    }, err => {
      this.toast.showError('Error fetching data. Please Later.', 'Error');
    })
  }

  private loadMap() {
    navigator.geolocation.getCurrentPosition(currentPosition => {
      const currentLocation = { 
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude
      };
      const mapElement = document.getElementById('map');
      this.map = new google.maps.Map(mapElement as HTMLElement, {
        zoom: 15,
        center: currentLocation,
      });

      // The marker, positioned at current user location
      new google.maps.Marker({
        position: currentLocation,
        map: this.map,
      });
    });
  }

  private drawPolyline(locations: [RouteStop], direction) {
    this.polylinePath.setMap(null);
    this.polylinePath.setPath(locations);
    this.setPolylineColor(direction);
    this.polylinePath.setMap(this.map);
  }

  // Adds a marker to the map.
  addMarker(locations: [RouteStop], direction: string) {
    if (this.markers.length){
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
  
      this.markers = [];
    }
    locations.forEach(location => {
      // Add the marker at the clicked location, and add the next-available label
      // from the array of alphabetical characters.
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        label: location.name,
        draggable: true,
        animation: google.maps.Animation.DROP,
        map: this.map,
      });

      
      // Store the marker so that, it is helpful to remove later.
      this.markers.push(marker);
      this.setMarkerInfoWindow(marker, location);
      // Fit the marker into the map view.
      this.bounds.extend(marker.getPosition());
      this.map.fitBounds(this.bounds);
    });
    
    this.drawPolyline(locations, direction);
  }

  private setMarkerInfoWindow(marker, location) {
    marker.addListener('click', (event) => {
      const stopForm = location;
      var content = 'Stop Name: ' + location.name + '<br />Stop Id: ' + location.stopId + '<br />Latitude: ' + location.lat + '<br />Longitude: ' + location.lng;
      var infoWindow = new google.maps.InfoWindow({
          content: content
      });
      infoWindow.open(this.map, marker);
    });
  }

  setPolylineColor(direction) {
    this.polylinePath.setOptions({
      strokeColor: direction === 'UP' ? 'blue' : 'red'
    });
  }
}

import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

declare var google: any;
@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {

  routesForm: FormGroup;

  labelIndex = 0;

  stops: { lat: number, lng: number }[];

  polylinePath = new google.maps.Polyline({
    path: [],
    geodesic: false,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  markers = [];

  map: any;

  constructor() { }

  ngOnInit(): void {
    this.createForm();
    this.loadMap();
  }

  private createForm() {
    this.routesForm = new FormGroup({
      _id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      direction: new FormControl('UP', [Validators.required]),
      routeId: new FormControl({ value: '', disabled: true },),
      status: new FormControl('Active', [Validators.required]),
      stops: new FormArray([], [Validators.required, Validators.minLength(1)])
    });
  }

  private createStop(stopDetails: { lat?: number, lng?: number }): FormGroup {
    return new FormGroup({
      _id: new FormControl(null),
      stopId: new FormControl(''),
      name: new FormControl(
        this.routesForm.get('stops').value.length,
        [Validators.required]
      ),
      lat: new FormControl(stopDetails.lat || null, [Validators.required]),
      lng: new FormControl(stopDetails.lng || null, [Validators.required])
    });
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
  
      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(this.map, "click", (event: any) => {
        this.addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

    });
  }

  // Adds a marker to the map.
  private addMarker(location: { lat: number, lng: number }) {
    (this.routesForm.get('stops') as FormArray)
    .push(this.createStop(location));

    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    const marker = new google.maps.Marker({
      position: location,
      label: String(this.labelIndex++),
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: this.map,
    });

    // Store the marker so that, it is helpful to remove later.
    this.markers.push(marker);
    const newStopAddedAt = this.routesForm.get('stops').value.length - 1;

    this.setMarkerInfoWindow(marker, location, newStopAddedAt);
    marker.addListener('dragend', (event) => {
      const stopFormGroup = (this.routesForm.get('stops') as FormArray).at(newStopAddedAt)
      stopFormGroup.patchValue({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      this.drawPolyline();
    });

    this.drawPolyline();
  }

  private setMarkerInfoWindow(marker, location, newStopAddedAt) {
    marker.addListener('click', (event) => {
      var content = 'Stop Name: ' + (this.routesForm.get('stops') as FormArray).at(newStopAddedAt).value.name + '<br />Latitude: ' + location.lat + '<br />Longitude: ' + location.lng;
      content += "<br /><input type = 'button' value = 'Delete' onclick = 'removeStop(" + newStopAddedAt + ");' value = 'Delete' />";
      var infoWindow = new google.maps.InfoWindow({
          content: content
      });
      infoWindow.open(this.map, marker);
    });
  }

  private drawPolyline() {
    let locations = (this.routesForm.get('stops') as FormArray).value;
    locations = locations.map(location => {
      return { lat: location.lat, lng: location.lng };
    });

    this.polylinePath.setMap(null);
    this.polylinePath.setPath(locations);
    this.polylinePath.setMap(this.map);
  }

  removeStop(stopIndex: number) {
    this.markers[stopIndex].setMap(null);
    this.markers.splice(stopIndex, 1);
    (this.routesForm.get('stops') as FormArray).removeAt(stopIndex);
    this.drawPolyline();

    const allLocations = this.routesForm.get('stops').value;
    while(this.routesForm.get('stops').value.length !== 0) {
      (this.routesForm.get('stops') as FormArray).removeAt(0);
    }

    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.labelIndex = 0;

    allLocations.forEach(stop => {
      this.addMarker(stop);
    });
  }

  saveRoute() {
    
  }
}

import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteItem, RouteStop } from 'src/app/shared/constants/interface-constants';
import { ToastNotificationService } from 'src/app/shared/notification/notification.service';
import { RouteService } from 'src/app/shared/services/routes/route.service';
import { RouterHelper } from 'src/app/shared/utils/helpers/router-helper';

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

  id: string;

  routeItem: RouteItem;

  constructor(
    private routeService: RouteService,
    private route: ActivatedRoute, 
    private router: Router,
    private toast: ToastNotificationService,
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.id = params.id || null;
      this.createForm();
      this.loadMap();
      this.getDetails();
    });
  }

  private createForm() {
    this.routesForm = new FormGroup({
      _id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      direction: new FormControl('UP', [Validators.required]),
      routeId: new FormControl({ value: null, disabled: true }),
      status: new FormControl('Active', [Validators.required]),
      stops: new FormArray([], [Validators.required, Validators.minLength(1)])
    });
  }

  private createStop(stopDetails: RouteStop): FormGroup {
    return new FormGroup({
      _id: new FormControl(stopDetails._id || null),
      stopId: new FormControl(stopDetails.stopId || null),
      name: new FormControl(
        stopDetails.name ||
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

  getDetails() {
    if (this.id) {
      this.routeService.getRouteById(this.id)
      .subscribe(response => {
        this.routeItem = response.payload;
        this.routesForm.patchValue(this.routeItem);
        // Using this hack as to avoid the maps loading delay
        // Which causes this function to run before the map loads
        // And hence showing marker on map fails.
        setTimeout(() => {
          this.routeItem.stops.forEach(stop => {
            this.addMarker(stop);
          });
        }, 3000);
      }, err => {
        this.toast.showError(err.error.message, 'Error');
        this.navigateToRouteList()
      });
    }
  }

  // Adds a marker to the map.
  private addMarker(location: RouteStop) {
    (this.routesForm.get('stops') as FormArray)
    .push(this.createStop(location));

    const position = { lat: location.lat, lng: location.lng }
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    const marker = new google.maps.Marker({
      position,
      label: String(this.labelIndex++),
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: this.map,
    });

    // Store the marker so that, it is helpful to remove later.
    this.markers.push(marker);
    const newStopAddedAt = this.routesForm.get('stops').value.length - 1;

    this.setMarkerInfoWindow(marker, position, newStopAddedAt);
    marker.addListener('dragend', (event) => {
      const stopFormGroup = (this.routesForm.get('stops') as FormArray).at(newStopAddedAt)
      stopFormGroup.patchValue({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      this.drawPolyline();
    });

    this.drawPolyline();
  }

  private setMarkerInfoWindow(marker, location, newStopAddedAt) {
    marker.addListener('click', (event) => {
      const stopForm = (this.routesForm.get('stops') as FormArray).at(newStopAddedAt).value;
      var content = 'Stop Name: ' + stopForm.name + '<br />Stop Id: ' + stopForm.stopId + '<br />Latitude: ' + location.lat + '<br />Longitude: ' + location.lng;
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

    let isSavedStopExist = false;
    allLocations.forEach(stop => {
      isSavedStopExist = stop._id !== null;
      this.addMarker(stop);
    });

    if (isSavedStopExist) {
      this.toast.showInfo('Changes will be saved only after clicking on save', 'Info');
    }
  }

  saveRoute() {
    if (!this.id) {
      this.routeService.saveRoute(this.routesForm.value)
      .subscribe(response => {
        this.toast.showSuccess(response.message, 'Success');
        this.router.navigateByUrl(`/routes/${response.payload._id}`)
      }, err => {
        this.toast.showError(err.message, 'Error');
      });
    } else {
      this.routeService.updateRoute(this.id, this.routesForm.value)
      .subscribe(response => {
        this.toast.showSuccess(response.message, 'Success');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, err => {
        this.toast.showError(err.message, 'Error');
      });
    }
  }

  deleteRoute() {
    this.routeService.deleteRoute(this.id)
      .subscribe(response => {
        this.toast.showSuccess(response.message, 'Success');
        this.navigateToRouteList()
      }, err => {
        this.toast.showError(err.message, 'Error');
      });
  }

  private navigateToRouteList() {
    this.router.navigate(['../../routes-list'], { relativeTo: this.route });
  }
}

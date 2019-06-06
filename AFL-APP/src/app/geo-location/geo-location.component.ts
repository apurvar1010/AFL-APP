import { Component, OnInit } from '@angular/core';
import { GetLocationService } from '../get-location.service';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import { } from '@google/maps';

@Component({
  selector: 'app-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.css']
})
export class GeoLocationComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public map;
  public res;
  public lat;
  public long;
  geoarr :any = [];

  constructor(private getlocationService : GetLocationService) { }

  ngOnInit() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }

  changeHome()
  {
    this.home=this.home;
  }

  findClosest(pt, results) {
    var closest = [];
    for (var i = 0; i < results.length; i++) {
      var myLocation = new google.maps.LatLng(pt.Lat, pt.Lng);
      var currentRecordLocation = new google.maps.LatLng(results[i].geometry.location.lat(), results[i].geometry.location.lng())
      results[i].distance = google.maps.geometry.spherical.computeDistanceBetween(myLocation, currentRecordLocation);
      closest.push(results[i]);
    }
    closest.sort(this.sortByDist);
    console.log('hello');
    for(var i =0;i<closest.length;i++)
    {

      this.geoarr[i] = closest[i]['name'];
      //console.log(closest[i]['name']);
    }
    this.home = closest[0]['name'];
    this.lat = closest[0]['geometry']['location'].lat();
    this.long = closest[0]['geometry']['location'].lng();
    //this.changeHome();
    //console.log(this.geoarr[1]['name']);
  }

  sortByDist(a,b) {
    return (a.distance - b.distance)
  }

  mapReady($event: any) {
    this.map = $event;
  }

  findStadium() {
  this.findNearbyStadiums(this.map);
  }

  findNearbyStadiums(map: any) {
    let placeService = new google.maps.places.PlacesService(map);
    var myLocation = {
      lat: this.latitude,
      lng: this.longitude
    }
    console.log(myLocation);
    //Perform a nearby search
    placeService.nearbySearch({
      location: myLocation,
      radius: 20000,
      type: 'stadium'
    },
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) return;
        this.findClosest(myLocation, results);
      });
  }

}

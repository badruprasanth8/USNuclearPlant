import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
//import { Search } from 'leaflet-Search';
import Search from "leaflet-search/dist/leaflet-search.src.js";
import { MarkerService } from '../marker.service';
import { LayerService } from '../layer.service';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private states: any;
  private highlightFeature(e: { target: any; }) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042'
    });
  }
  
  private resetFeature(e: { target: any; }) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }
  
  private initStatesLayer() {
    let searchLayer = L.layerGroup().addTo(this.map);

    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
        })
      )
    });

    this.map.addLayer(stateLayer);

    const controlSearch = new Search({
      url: "https://nominatim.openstreetmap.org/search?format=json&q={s}",
      jsonpParam: "json_callback",
      propertyName: "display_name",
      propertyLoc: ["lat", "lon"],
      marker: false, //L.circleMarker([0, 0], { radius: 30 }),
      autoCollapse: true,
      zoom: 7,
      //autoType: false,
      minLength: 2
    });


     this.map.addControl(controlSearch);
    
    stateLayer.bringToBack();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });
  

  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 3,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  tiles.addTo(this.map);

}
constructor(private markerService: MarkerService, private layerService: LayerService) { }

  ngAfterViewInit(): void {
    this.initMap();
   // this.markerService.makeCapitalMarkers(this.map);
   
   this.layerService.getStateShapes().subscribe(states=>{
     this.states = states;
     this.initStatesLayer();
   });
   this.markerService.makeCapitalCircleMarkers(this.map);
   }
}
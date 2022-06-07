import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';





@Injectable({
  providedIn: 'root'
})
export class LayerService {
  states: string ='/assests/data/gz_2010_us_040_00_5m.json';

  constructor(private http: HttpClient
    ) { }

    
   UpdateState(map: L.Map): void { 
    L.geoJSON(JSON.parse(this.states)).addTo(map);
  }


  getStateShapes() {
    return this.http.get('/assets/data/gz_2010_us_040_00_5m.json');
  }

 
}

import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import * as L from 'leaflet';
import { PopupService } from './popup.service';
import {AppSettings} from './api.settings';





@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = AppSettings.API_ENDPOINT;
 //capitals: string = '/assets/data/usa-capitals.geojson';

  constructor(private http: HttpClient,
              private popupService: PopupService
    ) { }

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }
  

  makeCapitalMarkers(map: L.Map): void { 



    

    this.http.get<any>(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = L.marker([lat, lon]);
        
        marker.addTo(map);
      }
    });
  }
  
  makeCapitalCircleMarkers(map: L.Map): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      const maxPop = Math.max(...res.features.map((x: { properties: { PercentForState: any; }; }) => x.properties.PercentForState), 0);

      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const circle = L.circleMarker([lat, lon],{ 
          radius: MarkerService.scaledRadius(c.properties.PercentForState, maxPop)
        });
        circle.setStyle({color: 'red'});
        circle.bindPopup(this.popupService.makeCapitalPopup(c.properties));
        
        circle.addTo(map);
      }
    });
  }

}

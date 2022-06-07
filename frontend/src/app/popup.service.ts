import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }
  makeCapitalPopup(data: any): string {
    return `` +
      `<div>Plant Name: ${ data.PlantName }</div>` +
      `<div>State: ${ data.State }</div>` +
      `<div>Total N-plants: ${ data.TotalPlantsinState }</div>` +
      `<div>Nuclear Power Contribution to State: ${ data.PercentForState } %</div>`+
      `<div>Absolute Nuclear Power capacity: ${ data.AbsoulutePower } (MWh) </div>`
  }

}

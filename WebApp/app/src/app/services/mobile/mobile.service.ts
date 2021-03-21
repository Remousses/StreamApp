import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  private mobile: boolean;

  constructor(public bpObs: BreakpointObserver) {
    this.bpObs.observe(['(max-width: 840px)']).subscribe((state: BreakpointState) => {
      this.mobile = state.matches;
    });
  }


  public isMobile() {
    return this.mobile;
  }
}
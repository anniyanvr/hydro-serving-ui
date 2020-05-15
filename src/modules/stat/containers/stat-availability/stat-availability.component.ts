import { Component, OnInit } from '@angular/core';
import { BuildInformationService } from '@core/services/build-information.service';
import { Observable } from '@node_modules/rxjs';
import { ServiceStatus } from '@shared/models/service-status.model';

@Component({
  selector: 'hs-stat-availability',
  template: `<hs-service-availability
    *ngIf="status$ | async as status"
    [error]="status.message"
    [name]="'Stat'"
    [status]="status.status"
  >
    <ng-content></ng-content>
  </hs-service-availability>`,
})
export class StatAvailabilityComponent implements OnInit {
  status$: Observable<{ status: ServiceStatus; message: string }>;

  constructor(private buildInfo: BuildInformationService) {}

  ngOnInit() {
    this.status$ = this.buildInfo.getStatus('stat');
  }
}

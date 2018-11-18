
import { Injectable } from '@angular/core';
import { HttpService } from '@core/services';
import { environment } from '@environments/environment';
import { MetricSettings } from '@shared/models/metric-settings.model';
import { Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class MetricSettingsService {
  private baseMonitoringSettingsUrl: string;

  constructor(private http: HttpService) {
    this.baseMonitoringSettingsUrl = `${environment.monitoringUrl}/aggregations`;
  }

  public getMetricSettings(stageId: string): Observable<object[]> {
    console.log(stageId);
    return this.http.get(this.baseMonitoringSettingsUrl, {params: {stageId}}).pipe(
      map((res: Response): any => {
        return res.json();
      }),
      catchError(_ => {throw new Error('Can\'t fetch data from monitoring service'); }), );
  }

  public addMetricSettings(metricSettings: MetricSettings): Observable<object> {
    console.log(metricSettings);
    return this.http.post(this.baseMonitoringSettingsUrl, metricSettings).pipe(
      map((res: Response): any => {
        return res.json();
      }));
  }

  public deleteMetricSettings(id: string): Observable<object> {
    console.log(`calling DELETE method for ${id}`);
    return this.http.delete(`${this.baseMonitoringSettingsUrl}/${id}`).pipe(
      map((res: Response): any => {
        return res.json();
      }));
  }
}

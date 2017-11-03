import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { environment } from '@environments/environment';
import { Response, RequestOptionsArgs } from '@angular/http';
import { Model } from '@shared/models/_index';
import { ModelBuilder } from '@shared/builders/_index';
import { HttpService } from './http.service';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpModelRuntimeService {
  private baseAPIUrl: string;
  private models: Model[];

  constructor(
    private http: HttpService,
    private modelBuilder: ModelBuilder
  ) {
    this.baseAPIUrl = `${environment.apiUrl}/modelRuntime`;
  }

  public getAll(): Observable<any> {
    const url = `${this.baseAPIUrl}`;
    return this.http.get(url)
      .map((res: Response) => {
        return res.json();
      });
  }

  public getRuntimeByModel(modelId: number, maximum: number): Observable<any> {
    const url = `${this.baseAPIUrl}/${modelId}/last`;
    const requestOptions: RequestOptionsArgs = {
      params: {maximum}
    };
    return this.http.get(url, requestOptions)
      .map((res: Response) => {
        return res.json();
      });
  }

  public extractModels(data) {
    const models: Model[] = [];
    for (const index in data) {
      if (data[index].serviceId < 1) {
        continue;
      }
      const model = this.modelBuilder.build({model: data[index].modelRuntime});
      models.push(model);
    }
    return models;
  }

}

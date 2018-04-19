import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ModelsService } from '@models/services/_index';
import { ModelBuilder, ModelVersionBuilder, ModelBuildBuilder } from '@shared/builders/_index';
import {
    ModelActionTypes,
    GetModelsSuccessAction,
    GetModelsFailAction,
    ModelVersionActionTypes,
    GetModelVersionsSuccessAction,
    GetModelVersionsFailAction,
    GET_MODEL_BUILDS,
    GetModelBuildsAction,
    GET_MODEL_BUILDS_SUCCESS
} from '@models/actions/_index';
import { flatMap, map, catchError } from 'rxjs/operators';



@Injectable()
export class ModelEffects {

    constructor(
        private modelBuilder: ModelBuilder,
        private modelVersionBuilder: ModelVersionBuilder,
        private modelBuildBuilder: ModelBuildBuilder,
        private modelsService: ModelsService,
        private actions$: Actions,
    ) { }

    @Effect() loadModels$: Observable<Action> = this.actions$
        .ofType(ModelActionTypes.Get)
        .pipe(
            flatMap(() => this.modelsService
                .getModels()
                .pipe(
                    map(data => {
                        return (new GetModelsSuccessAction(data.map(this.modelBuilder.build, this.modelBuilder)));
                    }),
                    catchError(error => {
                        return Observable.of(new GetModelsFailAction(error));
                    })
                )
            )
        );

    @Effect() getAllVersions$: Observable<Action> = this.actions$
        .ofType(ModelVersionActionTypes.GetModelVersions)
        .pipe(
            flatMap(() => this.modelsService
                .getAllVersions()
                .pipe(
                    map(data => {
                        const preparedData = data.map(this.modelVersionBuilder.build, this.modelVersionBuilder);
                        return (new GetModelVersionsSuccessAction(preparedData));
                    }),
                    catchError(error => Observable.of(new GetModelVersionsFailAction(error)))
                )
            )
        );

    @Effect() getModelBuilds$: Observable<Action> = this.actions$.ofType(GET_MODEL_BUILDS)
        .map((action: GetModelBuildsAction) => action.payload)
        .switchMap(payload => {
            return this.modelsService.getModelBuilds(payload)
                .take(1)
                .map(data => {
                    const preparedData = data.map(this.modelBuildBuilder.build, this.modelBuildBuilder);
                    return ({ type: GET_MODEL_BUILDS_SUCCESS, payload: preparedData });
                });
        });

}

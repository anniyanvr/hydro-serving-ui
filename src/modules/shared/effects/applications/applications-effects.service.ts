// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Actions, Effect } from '@ngrx/effects';
// import { Action } from '@ngrx/store';
// import { Observable } from 'rxjs/Observable';
// import { switchMap, catchError, map } from 'rxjs/operators';

// import { ApplicationBuilder } from '@shared/builders/_index';
// import { ApplicationsService } from '@shared/services/_index';
// import { Application } from '@shared/models/_index';
// import {
//     ApplicationActionTypes,
//     GetApplicationsSuccessAction,
//     GetApplicationsFailAction,
//     AddApplicationAction,
//     AddApplicationSuccessAction,
//     AddApplicationFailAction,
//     DeleteApplicationAction,
//     DeleteApplicationSuccessAction,
//     DeleteApplicationFailAction
// } from '@shared/actions/_index';
// import { MdlSnackbarService } from '@angular-mdl/core';



// @Injectable()
// export class ApplicationsEffects {

//     constructor(
//         private actions$: Actions,
//         private router: Router,
//         private applicationsService: ApplicationsService,
//         private applicationBuilder: ApplicationBuilder,
//         private mdlSnackbarService: MdlSnackbarService
//     ) { }

//     @Effect() getApplications$: Observable<Action> = this.actions$
//         .ofType(ApplicationActionTypes.Get)
//         .pipe(
//             switchMap(() => {
//                 return this.applicationsService
//                     .getApplications()
//                     .pipe(
//                         map((apps: Application[]) => {
//                             const data = apps.map(app => this.applicationBuilder.build(app));
//                             return (new GetApplicationsSuccessAction(data));
//                         }),
//                         catchError(error => Observable.of(new GetApplicationsFailAction(error)))
//                     );
//             })
//         );

//     @Effect() addApplication$: Observable<Action> = this.actions$
//         .ofType(ApplicationActionTypes.Add)
//         .pipe(
//             map((action: AddApplicationAction) => action.payload),
//             switchMap((payload) => {
//                 return this.applicationsService
//                     .addApplication(payload)
//                     .pipe(
//                         map((application) => {
//                             this.mdlSnackbarService.showSnackbar({
//                                 message: 'Application was successfully added',
//                                 timeout: 5000
//                             });
//                             return (new AddApplicationSuccessAction(new Application(application)));
//                         }),
//                         catchError((error) => {
//                             this.mdlSnackbarService.showSnackbar({
//                                 message: `Error: ${error}`,
//                                 timeout: 5000
//                             });
//                             return Observable.of(new AddApplicationFailAction(error));
//                         })
//                     );
//             })
//         );

//     @Effect() deleteApplication$: Observable<Action> = this.actions$
//         .ofType(ApplicationActionTypes.Delete)
//         .pipe(
//             map((action: DeleteApplicationAction) => action.applicationId),
//             switchMap(applicationId => {
//                 return this.applicationsService
//                     .deleteApplication(applicationId)
//                     .pipe(
//                         map(() => {
//                             this.router.navigate(['applications']);
//                             this.mdlSnackbarService.showSnackbar({
//                                 message: 'Application has been deleted',
//                                 timeout: 5000
//                             });
//                             return (new DeleteApplicationSuccessAction(applicationId));
//                         }),
//                         catchError(error => {
//                             this.mdlSnackbarService.showSnackbar({
//                                 message: `Error: ${error}`,
//                                 timeout: 5000
//                             });
//                             return Observable.of(new DeleteApplicationFailAction(error));
//                         })
//                     );
//             })
//         );
// }

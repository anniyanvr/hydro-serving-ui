import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdlDialogReference, MdlSnackbarService } from '@angular-mdl/core';

import { Store } from '@ngrx/store';
import { ApplicationsDialogBase } from '@shared/base/_index';
import * as Actions from '@shared/actions/_index';
import { AppState, Service } from '@shared/models/_index';
import { FormsService, ServicesService } from '@shared/services/_index';



@Component({
  selector: 'hydro-dialog-add-service',
  templateUrl: './dialog-add-service.component.html',
  styleUrls: ['./dialog-add-service.component.scss'],
  providers: [FormsService]
})
export class DialogAddServiceComponent extends ApplicationsDialogBase implements OnInit {

    public dialogType: string = 'Add';

    constructor(
        public fb: FormBuilder,
        public dialogRef: MdlDialogReference,
        public formsService: FormsService,
        public mdlSnackbarService: MdlSnackbarService,
        public store: Store<AppState>,
        public servicesService: ServicesService,
        private router: Router
    ) {
        super(
            fb,
            dialogRef,
            formsService,
            mdlSnackbarService,
            store,
            servicesService
        );
    }

    ngOnInit() {
        this.createServiceForm();
        this.initFormChangesListener();
    }

    onSubmit() {
        if (this.serviceForm.invalid) {
            return;
        }

        const data = this.getFormData(this.serviceForm);

        const serviceInfo = {
            id: this.services.length ? this.services[this.services.length - 1].id + 1 : 1,
            serviceName: this.serviceForm.value.serviceName,
            kafkaStreamingSources: this.isKafkaEnabled ? data.kafkaStreamingSources : [],
        };

        serviceInfo.kafkaStreamingSources.forEach(kafka => {
            kafka.serviceId = 0;
        });

        const service = new Service(Object.assign( serviceInfo, { stages: data.stages } ));

        this.servicesService.addService(service)
            .subscribe(res => {
                console.log(res);
                // TODO: navigate to created app
                // this.router.navigate(['./services', serviceInfo.id]);
                this.store.dispatch({ type: Actions.ADD_SERVICE, payload: new Service(res) });
                this.dialogRef.hide();
                this.mdlSnackbarService.showSnackbar({
                    message: 'Service was successfully added',
                    timeout: 5000
                });
            });
    }

}

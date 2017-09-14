import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdlDialogReference } from '@angular-mdl/core';
import { WeightedServiceStore } from '@stores/weighted-service.store';
import { WeightedService } from '@models/weighted-service';
import { ModelStore } from '@stores/model.store';
import { ModelServiceStore } from '@stores/model-service.store';
import { FormsService } from '@services/form-service.service';
import { MdlSnackbarService } from '@angular-mdl/core';

import { Store } from '@ngrx/store';
import { ServicesService, Service, ADD_SERVICE } from '@shared/_index';

import { AppState, ModelService } from '@shared/models/_index';

import { ModelServicesService } from '@shared/services/_index';

export let injectableWeightedService = new InjectionToken<WeightedService>('selectedWeightedService');

@Component({
  selector: 'hydro-dialog-weighted-service',
  templateUrl: './dialog-weighted-service.component.html',
  styleUrls: ['./dialog-weighted-service.component.scss'],
  providers: [FormsService]
})
export class DialogWeightedServiceComponent implements OnInit {
  private modelServicesServiceSubscription: Subscription;
  public models;
  public weightedServiceForm: FormGroup;
  public selectedWeightedService: WeightedService;
  public formTitle: string;
  public formErrors = {
    serviceName: '',
    weights: '',
    serviceId: '',
    weight: '',
  };

  public modelServices: ModelService[];

  constructor(
    @Inject(injectableWeightedService) data: WeightedService,
    private fb: FormBuilder,
    public dialogRef: MdlDialogReference,
    private weightedServiceStore: WeightedServiceStore,
    private modelStore: ModelStore,
    private formsService: FormsService,
    private modelServiceStore: ModelServiceStore,
    private mdlSnackbarService: MdlSnackbarService,
    private store: Store<AppState>,
    private servicesService: ServicesService,
    private modelServicesService: ModelServicesService
  ) {
    this.models = [];
    this.selectedWeightedService = data;
  }

  ngOnInit() {
    this.createWeightedServiceForm();

    this.store.select('modelService')
        .subscribe(modelService => {
            this.modelServices = modelService;
        });
    
    // this.modelServiceStore.getAll();
    // this.modelServiceStore.items
    //   .map((models) => {
    //     console.log(models)
    //     return models.filter((model) => model.serviceId > 0);
    //   })
    //   .subscribe((models) => {
    //   this.models = models;
    // });
    this.initFormChangesListener();

    if (this.selectedWeightedService) {
      this.updateWeightedServiceFormValues(this.selectedWeightedService);
      this.formTitle = `Update Service #${this.selectedWeightedService.id}`;
    } else {
      this.formTitle = 'Add Service';
    }
  }

  private initFormChangesListener() {
    this.weightedServiceForm.valueChanges.subscribe((form) => {
      let result = 0;
      // todo fix errors reset
      this.formErrors.weights = '';
      this.formErrors.serviceId = '';
      form.weights.forEach((service) => {
        result += +service.weight;
      });

      if (result > 100) {
        this.weightedServiceForm.controls.weights.setErrors({ overflow: true });
      }

      if (this.weightedServiceForm.invalid) {
        this.formsService.setErrors(this.weightedServiceForm, this.formErrors, this.formsService.MESSAGES.ERRORS.forms.weightedService);
      }

    });
  }

  private updateWeightedServiceFormValues(weightedService: WeightedService) {
    for (let i = 0; i < weightedService.weights.length - 1; i++) {
      this.addWeightsForm();
    }
    this.weightedServiceForm.patchValue({id: weightedService.id});
    this.weightedServiceForm.patchValue({serviceName: weightedService.serviceName});
    this.weightedServiceForm.patchValue({weights: weightedService.weights});
  }

  private createWeightedServiceForm() {
    this.weightedServiceForm = this.fb.group({
      id: [''],
      serviceName: ['', [Validators.required]],
      weights: this.fb.array([this.createWeightsForm()])
    });
  }

  private createWeightsForm() {
    return this.fb.group({
      serviceId: ['', [Validators.required, Validators.pattern(this.formsService.VALIDATION_PATTERNS.number)]],
      weight: ['', [Validators.required, Validators.pattern(this.formsService.VALIDATION_PATTERNS.number)]]
    });
  }

  addWeightsForm() {
    const control = <FormArray>this.weightedServiceForm.controls['weights'];
    control.push(this.createWeightsForm());
  }

  removeWeightsForm(i: number) {
    const control = <FormArray>this.weightedServiceForm.controls['weights'];
    control.removeAt(i);
  }

  submitWeightedServiceForm(form) {
    if (this.weightedServiceForm.invalid) {
      return;
    }

    const formWeights = form.controls.weights;
    const weights: object[] = [];
    let service: Service;

    for ( let i = 0; i < formWeights.length; i++ ) {
      weights.push({
        serviceId: Number(formWeights.controls[i].controls.serviceId.value),
        weight: Number(formWeights.controls[i].controls.weight.value)
      });
    }

    service = new Service({
        id: Number(form.controls.id.value),
        serviceName: form.controls.serviceName.value,
        weights: weights
    });

    if (this.selectedWeightedService) {
        this.weightedServiceStore.update(service)
            .subscribe((res) => {
                this.dialogRef.hide();
            });
    } else {
        this.servicesService.addService(service)
            .subscribe(services => {
                this.store.dispatch({ type: ADD_SERVICE, payload: service });
                this.dialogRef.hide();
                this.mdlSnackbarService.showSnackbar({
                    message: 'Service was successfully added',
                    timeout: 5000
                });
            });
      
      // this.weightedServiceStore.add(weightedService)
      //   .subscribe((res) => {
      //     this.mdlSnackbarService.showSnackbar({
      //       message: `Service was successfully added`,
      //       timeout: 5000
      //     });
      //     this.dialogRef.hide();
      //   }, (error) => {
      //     this.mdlSnackbarService.showSnackbar({
      //       message: `Error: ${error}`,
      //       timeout: 5000
      //     });
      //   });
    }

  }

}

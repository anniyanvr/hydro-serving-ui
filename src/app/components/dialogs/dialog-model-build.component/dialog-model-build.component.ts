import { Component, OnInit, InjectionToken, Inject, OnDestroy } from '@angular/core';
import { MdlDialogReference, MdlSnackbarService } from '@angular-mdl/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ModelsService } from '@models/services/_index';
import { DialogBase } from '@shared/base/_index';

import { Store } from '@ngrx/store';
import { ApplicationState } from '@shared/models/_index';
import * as Actions from '@models/actions/_index';
import 'rxjs/add/operator/mergeMap';

import { Subscription } from 'rxjs/Subscription';

import { Signature } from '@shared/models/_index';
import { ContractsService } from '@shared/services/_index';

export let injectableModelOptions = new InjectionToken<object>('injectableModelOptions');



@Component({
    selector: 'hydro-dialog-model-build',
    templateUrl: './dialog-model-build.component.html',
    styleUrls: ['./dialog-model-build.component.scss']
})
export class DialogModelBuildComponent extends DialogBase implements OnInit, OnDestroy {
    public buildModelForm: FormGroup;
    public currentModelRuntimeType;
    public runtimeTypes;
    public data;
    public model;
    public modelType: string;

    public signatures: Signature[];
    public contractsForm: FormGroup;
    public isContractViewEnabled = false;

    private runtimeTypesSub: Subscription;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MdlDialogReference,
        private mdlSnackbarService: MdlSnackbarService,
        @Inject(injectableModelOptions) data,
        private store: Store<ApplicationState>,
        private modelsService: ModelsService,
        private contractsService: ContractsService,
    ) {
        super(
            dialogRef
        );
        this.model = data;
    }

    ngOnInit() {
        // this.showContract();
    }

    ngOnDestroy() {
        if (this.runtimeTypesSub) {
            this.runtimeTypesSub.unsubscribe();
        }
    }

    public showContract(event) {
        this.createContractForm();
        if (!this.signatures) {
            this.contractsService.getModelContracts(this.model.id)
                .subscribe(data => {
                    this.signatures = data.signatures;
                    this.updateContractsFormValues(this.signatures ? this.signatures : null);
                });
        }
        this.isContractViewEnabled = event.target.checked;
    }

    public addSignatureToContract() {
        const control = <FormArray>this.contractsForm.controls['signatures'];
        control.push(this.addSignature());
    }

    public removeSignatureFromContract(index: number) {
        const control = <FormArray>this.contractsForm.controls['signatures'];
        control.removeAt(index);
    }

    public onSubmit() {
        const modelOptions = {
            modelId: this.model.id
        };

        if (this.isContractViewEnabled) {
            this.contractsService.updateModelContract(this.model.id, { signatures: this.contractsForm.value.signatures })
                .subscribe(() => {
                    this.mdlSnackbarService.showSnackbar({
                        message: 'Contracts was successfully updated',
                        timeout: 5000
                    });
                    this.buildModel(modelOptions);
                }, (error) => {
                    this.mdlSnackbarService.showSnackbar({
                        message: `Contracts update was failed with error ${error}`,
                        timeout: 5000
                    });
                });
        } else {
            this.buildModel(modelOptions);
        }
    }

    private buildModel(modelOptions) {
        this.modelsService.buildModel(modelOptions)
            .subscribe(response => {
                this.store.dispatch(new Actions.UpdateModelAction(response));
                this.store.dispatch(new Actions.AddModelVersionSuccessAction(response));
                this.store.dispatch({ type: Actions.GET_MODEL_BUILDS, payload: response.model.id });

                this.dialogRef.hide();
                this.mdlSnackbarService.showSnackbar({
                    message: 'Model was successfully released',
                    timeout: 5000
                });
            }, (error) => {
                this.mdlSnackbarService.showSnackbar({
                    message: `Error: ${error}`,
                    timeout: 5000
                });
            });
    }

    private updateContractsFormValues(signatures: Signature[]) {
        for (let i = 0; i < signatures.length - 1; i++) {
            this.addSignatureToContract();
            for (let j = 0; j < signatures[i].inputs.length - 1; j++) {
                this.addSignatureField();
            }
            for (let j = 0; j < signatures[i].outputs.length - 1; j++) {
                this.addSignatureField();
            }
        }

        this.contractsForm.patchValue({
            signatures: signatures
        });
    }

    private createContractForm() {
        this.contractsForm = this.fb.group({
            signatures: this.fb.array([this.addSignature()])
        });
    }

    private addSignature() {
        return this.fb.group({
            signatureName: ['', Validators.required],
            inputs: this.fb.array([this.addSignatureField()]),
            outputs: this.fb.array([this.addSignatureField()]),
        });
    }

    private addSignatureField() {
        return this.fb.group({
            fieldName: ['/', Validators.required],
            dataType: ['', Validators.required],
            shape: [[], Validators.required]
        });
    }
}

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Self,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Model, ModelVersion, DeploymentConfig } from '@app/core/data/types';
import { ModelsFacade } from '@app/core/facades/models.facade';
import { DeploymentConfigsFacade } from '@app/core/facades/deployment-configs.facade';

import { ModelVariantFormService } from './model-variant-form.service';

@Component({
  selector: 'hs-model-variant-form',
  templateUrl: './model-variant-form.component.html',
  styleUrls: ['./model-variant-form.component.scss'],
  providers: [ModelVariantFormService],
})
export class ModelVariantFormComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() index: number;
  @Input() showRemoveIcon: boolean = false;

  @Output() delete = new EventEmitter();

  data;
  models$: Observable<Model[]> = this.modelsFacade.allModels();
  modelVersions$: Observable<ModelVersion[]>;
  deploymentConfigs$: Observable<DeploymentConfig[]>;
  selectedModelVersion$: Observable<ModelVersion>;

  get modelControl(): FormControl {
    return this.group.get('modelId') as FormControl;
  }

  get modelVersionControl(): FormControl {
    return this.group.get('modelVersionId') as FormControl;
  }

  get weightControl(): FormControl {
    return this.group.get('weight') as FormControl;
  }

  get deploymentConfigNameControl(): FormControl {
    return this.group.get('deploymentConfigName') as FormControl;
  }

  constructor(
    private modelsFacade: ModelsFacade,
    private deploymentConfFacade: DeploymentConfigsFacade,
    @Self() private modelVariantFormService: ModelVariantFormService
  ) {
    this.modelVersions$ = this.modelVariantFormService
      .getModelVersions()
      .pipe(map(mvs => mvs.filter(mv => !mv.isExternal)));

    this.selectedModelVersion$ = this.modelVariantFormService.getCurrentModelVersion();

    this.deploymentConfigs$ = this.deploymentConfFacade.getAll();
  }

  ngOnInit() {
    this.modelVariantFormService.updateModelVersionList(
      this.modelControl.value
    );

    this.modelVariantFormService.setCurrentModelVersion(
      this.modelVersionControl.value
    );

    this.subscribeToModelIdChange();
    this.subscribeToModelVersionIdChange();
  }

  public onModelIdChange(modelId): void {
    this.modelVariantFormService.updateModelVersionList(modelId);

    const modelVersion = this.modelVariantFormService.getDefaultModelVersion();

    this.modelVersionControl.setValue(modelVersion ? modelVersion.id : null);
  }

  public onModelVersionChange(modelVersionId: number): void {
    this.modelVariantFormService.setCurrentModelVersion(modelVersionId);
  }

  public onDelete(): void {
    this.delete.emit(this.index);
  }

  private subscribeToModelIdChange(): void {
    this.modelControl.valueChanges.subscribe(modelId => {
      this.onModelIdChange(modelId);
    });
  }

  private subscribeToModelVersionIdChange(): void {
    this.modelVersionControl.valueChanges.subscribe(modelVersionId => {
      this.onModelVersionChange(modelVersionId);
    });
  }
}

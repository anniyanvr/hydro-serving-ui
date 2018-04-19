import { NgModule } from '@angular/core';
import { ModelsRoutingModule } from './models.router';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { FormsModule } from '@angular/forms';

import {
    ModelsWrapperComponent,
    ModelDetailsComponent,
    ModelVersionDetailsComponent
} from '@models/components/_index';
import { EffectsModule } from '@ngrx/effects';
import { ModelEffects } from '@models/effects/_index';
import { ModelsService } from '@models/services/_index';
import { StoreModule } from '@ngrx/store';
import * as Reducers from '@models/reducers/_index';



@NgModule({
    imports: [
        ModelsRoutingModule,
        CommonModule,
        SharedModule,
        MomentModule,
        MdlModule,
        MdlSelectModule,
        FormsModule,
        StoreModule.forFeature('models', Reducers),
        EffectsModule.forFeature([ModelEffects])
    ],
    declarations: [
        ModelsWrapperComponent,
        ModelDetailsComponent,
        ModelVersionDetailsComponent
    ],
    providers: [
        ModelsService
    ]
})
export class ModelsModule { }

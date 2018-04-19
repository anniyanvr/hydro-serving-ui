import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';
import { SharedModule } from '@shared/shared.module';
import { ApplicationsRoutingModule } from './applications.router';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import {
    ApplicationsWrapperComponent,
    ApplicationsItemDetailComponent
} from '@applications/components/_index';
import { EffectsModule } from '@ngrx/effects';
import { ApplicationsService } from '@applications/services/_index';
import { ApplicationsEffects } from '@applications/effects/_index';
import { StoreModule } from '@ngrx/store';
import { ApplicationsReducer } from '@applications/reducers/_index';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        MdlModule,
        ApplicationsRoutingModule,
        FormsModule,
        ChartsModule,
        StoreModule.forFeature('applications', ApplicationsReducer),
        EffectsModule.forFeature([ApplicationsEffects])
    ],
    declarations: [
        ApplicationsWrapperComponent,
        ApplicationsItemDetailComponent
    ],
    providers: [
        ApplicationsService
    ]
})
export class ApplicationsModule { }

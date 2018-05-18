import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Model } from '@shared/models/_index';
import { HydroServingState } from '@core/reducers';



@Component({
    selector: 'hydro-models-wrapper',
    templateUrl: './models-wrapper.component.html',
    styleUrls: ['./models-wrapper.component.scss']
})
export class ModelsWrapperComponent implements OnInit {

    public sidebarTitle = 'Models';
    public models: Store<Model[]>;


    constructor(
        private store: Store<HydroServingState>,
    ) { }

    ngOnInit() {
        this.models = this.store.select('models');
    }

}
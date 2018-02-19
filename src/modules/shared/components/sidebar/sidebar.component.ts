import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MdlDialogService } from '@angular-mdl/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Application, Model, Source } from '@shared/models/_index';
import { DialogAddServiceComponent } from '@components/dialogs/_index';
// import * as moment from 'moment';




@Component({
    selector: 'hydro-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

    public sidebarList: Application[] | Model[] | Source[] = [];
    public searchQ: string;
    // private needsToGo = false;
    public sidebarFilter = {'deployed': true, 'undeployed': true, 'apps': true, 'pipelines': true};
    @Input() isActionBtnEnabled: boolean = false;
    @Input() isFilterEnabled: boolean = false;
    @Input() isModels: boolean;
    @Input() sidebarTitle: string;

    @Input() sidebarData: Observable<any>; // ToDo: Fix any type
    // private routeSubscription: Subscription;
    private sidebarDataSub: Subscription;

    constructor(
        // private sortByPipe: SortByPipe,
        // private activatedRoute: ActivatedRoute,
        // private router: Router,
        private dialog: MdlDialogService,
    ) {
        // this.routeSubscription = this.router.events
        //     .subscribe(event => {
        //         if (event instanceof NavigationEnd && event.url.split('/').length <= 2) {
        //             this.needsToGo = true;
        //             this.transitToFirstItem();
        //         }
        //     });
    }

    ngOnInit() {
        this.sidebarDataSub = this.sidebarData
            .subscribe(items => {
                console.log(items);
                this.sidebarList = items;
                // this.transitToFirstItem();
            });
    }

    // private transitToFirstItem() {
    //     if (this.needsToGo && this.sidebarList.length > 0) {
    //         this.needsToGo = false;
    //         const sorted = this.sortByPipe.transform(this.sidebarList, 'id');
    //         this.router.navigate([sorted[0].id], { relativeTo: this.activatedRoute });
    //     }
    // }

    ngOnDestroy() {
        if (this.sidebarDataSub) {
            this.sidebarDataSub.unsubscribe();
        }
        // this.routeSubscription.unsubscribe();
    }

    public addModelSource(event) {
        console.log(event);
    }


    public addApplication() {
        this.dialog.showCustomDialog({
            component: DialogAddServiceComponent,
            styles: { 'width': '850px', 'min-height': '250px', 'max-height': '90vh', 'overflow': 'auto' },
            classes: '',
            isModal: true,
            clickOutsideToClose: true,
            enterTransitionDuration: 400,
            leaveTransitionDuration: 400
        });
    }

    public toggleSidebarFilter(option) {
        this.sidebarFilter[option] = !this.sidebarFilter[option];
    }

}

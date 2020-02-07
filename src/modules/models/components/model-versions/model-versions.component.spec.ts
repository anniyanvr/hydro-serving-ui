import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelVersionsRowComponent } from '@testing/components';
import { ModelVersionsComponent } from './model-versions.component';

describe('ModelVersionsComponent', () => {
  let component: ModelVersionsComponent;
  let fixture: ComponentFixture<ModelVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModelVersionsComponent, ModelVersionsRowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

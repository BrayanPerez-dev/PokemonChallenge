import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSetupHeaderComponent } from './profile-setup-header.component';

describe('ProfileSetupHeaderComponent', () => {
  let component: ProfileSetupHeaderComponent;
  let fixture: ComponentFixture<ProfileSetupHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSetupHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSetupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

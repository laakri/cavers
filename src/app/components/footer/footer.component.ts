import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import { TermsConditionComponent } from '../terms-condition/terms-condition.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DialogService],
})
export class FooterComponent {
  constructor(private dialogService: DialogService) {}

  openPrivacyPolicyDialog() {
    const ref = this.dialogService.open(PrivacyPolicyComponent, {
      header: 'Privacy Policy',
      width: '90vw',
      draggable: false,
      modal: true,
      resizable: false,
      dismissableMask: true,
    });
  }

  openDisclaimerDialog() {
    const ref = this.dialogService.open(DisclaimerComponent, {
      header: 'Disclaimer',
      width: '90vw',
      draggable: false,
      modal: true,
      resizable: false,
      dismissableMask: true,
    });
  }

  openTermsConditionsDialog() {
    const ref = this.dialogService.open(TermsConditionComponent, {
      header: 'Terms & Conditions',
      width: '90vw',
      draggable: false,
      modal: true,
      resizable: false,
      dismissableMask: true,
    });
  }
}

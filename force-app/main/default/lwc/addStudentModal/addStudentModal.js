import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import addStudent from "@salesforce/apex/StudentController.addStudent";

export default class AddStudentModal extends LightningElement {
  @api isModalOpen;

  handleSuccess() {
    const selectedEvent = new ShowToastEvent({
      title: "Success",
      message: "Contact created successfully!",
      variant: "success"
    });
    this.dispatchEvent(selectedEvent);
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent("closemodal"));
  }

  handleSubmit(event) {
    event.preventDefault(); // stop the form from submitting
    const fields = event.detail.fields;

    addStudent({
      firstName: fields.firstName__c,
      lastName: fields.lastName__c,
      birthday: fields.birthday__c,
      gender: fields.gender__c,
      diem1: fields.diem1__c,
      diem2: fields.diem2__c,
      diem3: fields.diem3__c,
      grade: fields.grade__C
    })
      .then(() => {
        this.handleSuccess();
        this.closeModal();
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
}

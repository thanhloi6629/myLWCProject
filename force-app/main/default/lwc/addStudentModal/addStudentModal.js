import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import addStudent from "@salesforce/apex/StudentController.addStudent";
// import FirstName from "@salesforce/schema/Contact.FirstName";

export default class AddStudentModal extends LightningElement {
  // @track isModalOpen = false;
  @api ismodalopen;

  connectedCallback() {
    console.log("isModalOpen-addd", this.ismodalopen);
  }

  renderedCallback() {
    console.log("isModalOpen-addd-123", this.ismodalopen);
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent("closemodal"));
  }

  handleSuccess() {
    const selectedEvent = new ShowToastEvent({
      title: "Success",
      message: "Contact created successfully!",
      variant: "success"
    });
    this.dispatchEvent(selectedEvent);
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
      .then((result) => {
        console.log("result", result);
        this.handleSuccess();
        this.closeModal();
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
}

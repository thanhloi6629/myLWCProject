/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getGrades from "@salesforce/apex/StudentController.getGrades";
import addStudent from "@salesforce/apex/StudentController.addStudent";
import editStudent from "@salesforce/apex/StudentController.editStudent";
// import { handleEditSuccess } from "c/utils/commonUtils";
// import addStudentV2 from "@salesforce/apex/StudentController.addStudentV2";

export default class AddStudent extends LightningElement {
  @api ismodalopen;
  @api objsubmit = {};
  gradeOptions = [];
  objAdd = {};

  closeModal() {
    this.dispatchEvent(new CustomEvent("closemodal"));
  }

  async connectedCallback() {
    await getGrades()
      .then((result) => {
        this.gradeOptions = result.map((grade) => {
          return {
            label: grade.Name,
            value: grade.Id
          };
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }


  get genderOptions() {
    return [
      { label: "Nam", value: "Nam" },
      { label: "Nữ", value: "Nữ" },
      { label: "Khác", value: "Khác" }
    ];
  }

  handleSubmit() {
   
    console.log("'L---objsubmit", JSON.stringify(this.objsubmit));
    console.log("'L---objAdd", JSON.stringify(this.objAdd));

    if (!this.objsubmit.Id) {
      addStudent({
        name: this.objAdd.Name,
        firstName: this.objAdd.firstName__c,
        lastName: this.objAdd.lastName__c,
        birthday: this.objAdd.birthday__c,
        gender: this.objAdd.gender__c,
        diem1: this.objAdd?.diem1__c,
        diem2: this.objAdd.diem2__c,
        diem3: this.objAdd.diem3__c,
        grade: this.objAdd.grade__c
      })
        .then((result) => {
          this.handleAddSuccess();
          this.closeModal();
          // this.objsubmit = {};
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    else {
      editStudent({
        id: this.objsubmit.Id,
        name: this.objsubmit.Name,
        firstName: this.objsubmit.firstName__c,
        lastName: this.objsubmit.lastName__c,
        birthday: this.objsubmit.birthday__c,
        gender: this.objsubmit.gender__c,
        diem1: this.objsubmit?.diem1__c,
        diem2: this.objsubmit.diem2__c,
        diem3: this.objsubmit.diem3__c,
        grade: this.objsubmit.grade__c
      })
        .then((result) => {
          console.log("result", result);
            // handleEditSuccess(this, "Student Edit successfully!");
          this.handleEditSuccess();
          this.closeModal();
          // this.objsubmit = {};
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    // addStudentV2({ studentData: this.objsubmit})
    //   .then((result) => {
    //     console.log("result", result);
    //     this.handleSuccess();
    //     this.closeModal();
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  }

  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
  }

  handleAddSuccess() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Student created successfully!",
        variant: "success"
      })
    );
  }

  handleEditSuccess() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Student edited successfully!",
        variant: "success"
      })
    );
  }

  handleChange(event) {
    try {
      const name = event.target.name;
      const value = event.target.value;
      console.log("L-Change-n-objsubmit:", this.objsubmit);
      console.log("L-Change-n-objsubmit -stringyfy:", JSON.stringify(this.objsubmit));

      console.log("L-Change-n-objAdd:", JSON.stringify(this.objAdd));

      if (this.objsubmit.Id) {
        // this.objsubmit = { ...this.objsubmit};
        const obj = { ...this.objsubmit, [name]: value };
        this.objsubmit = obj
        console.log("L-objsubmit update:", JSON.stringify(this.objsubmit));
      }
      else {
        console.log("L-Change-objAdd:", JSON.stringify(this.objAdd));
        this.objAdd[name] = value;
      }
    
      // this.objsubmit[name] = event.target.value;


    } catch (error) {
      console.log(error);
    }
  }

  handleClick() {
    let valid = true; //
    const inputs = this.template.querySelectorAll("lightning-input");
    inputs.forEach((input) => {
      // Hiển thị thông báo lỗi nếu không hợp lệ
      if (!input.checkValidity()) {
        input.reportValidity(); // Kích hoạt hiển thị thông báo lỗi
        valid = false;
      }
    });
    if (valid) {
      console.log("theem moiws");
    }
  }
}

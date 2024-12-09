/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getGrades from "@salesforce/apex/StudentController.getGrades";
import addStudent from "@salesforce/apex/StudentController.addStudent";
import editStudent from "@salesforce/apex/StudentController.editStudent";
// import { handleEditSuccess } from "c/utils/commonUtils";
// import addStudentV2 from "@salesforce/apex/StudentController.addStudentV2";

export default class AddStudent extends LightningElement {
  @api isModalOpen;
  @api objEdit = {};
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
  async renderedCallback() {
    console.log("L-objEdit", JSON.stringify(this.objEdit));
  }

  get genderOptions() {
    return [
      { label: "Nam", value: "Nam" },
      { label: "Nữ", value: "Nữ" },
      { label: "Khác", value: "Khác" }
    ];
  }

  handleSubmit() {
    if(this.handleEnableValidate()) return;
    console.log("'L---objEdit", JSON.stringify(this.objEdit));
    console.log("'L---objAdd", JSON.stringify(this.objAdd));

    if (!this.objEdit.Id) {
      console.log('chay vao insert ròi')
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
          console.log('result',result)
          this.handleAddSuccess();
          this.closeModal();
          // Gọi callback từ cha để refresh dữ liệu
          this.dispatchEvent(new CustomEvent("refreshdata"));
        })
        .catch((error) => {
          this.handleError(error);
        });
    } else {
      editStudent({
        id: this.objEdit.Id,
        name: this.objEdit.Name,
        firstName: this.objEdit.firstName__c,
        lastName: this.objEdit.lastName__c,
        birthday: this.objEdit.birthday__c,
        gender: this.objEdit.gender__c,
        diem1: this.objEdit?.diem1__c,
        diem2: this.objEdit.diem2__c,
        diem3: this.objEdit.diem3__c,
        grade: this.objEdit.grade__c
      })
        .then((result) => {
          console.log("result", result);
          this.handleEditSuccess();
          this.closeModal();
          this.dispatchEvent(new CustomEvent("refreshdata"));
        })
        .catch((error) => {
          this.handleError(error);
        });
    }

    // addStudentV2({ studentData: this.objEdit})
    //   .then((result) => {
    //     console.log("result", result);
    //     this.handleSuccess();
    //     this.closeModal();
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  }

  handleError(error) { 
    const errException = error.body.pageErrors[0].message; 
    if(error.body.pageErrors) {
      this.showToast("Error", errException, "error");
      return;
    }
    this.showToast("Error", error.body.message, "error");
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
      console.log("L-Change-n-objEdit:", this.objEdit);
      console.log(
        "L-Change-n-objEdit -stringyfy:",
        JSON.stringify(this.objEdit)
      );

      console.log("L-Change-n-objAdd:", JSON.stringify(this.objAdd));

      if (this.objEdit.Id) {
        // this.objEdit = { ...this.objEdit};
        const obj = { ...this.objEdit, [name]: value };
        this.objEdit = obj;
        console.log("L-objEdit update:", JSON.stringify(this.objEdit));
      } else {
        console.log("L-Change-objAdd:", JSON.stringify(this.objAdd));
        this.objAdd[name] = value;
      }

      // this.objEdit[name] = event.target.value;
    } catch (error) {
      console.log(error);
    }
  }

  handleEnableValidate() {
    let valid = true; //
    const inputs = this.template.querySelectorAll(
      "lightning-input, lightning-combobox"
    );
    // const inputField = this.template.querySelector('[data-id="studentName"]'); sử dụng data-id="studentName" 
    inputs.forEach((input) => {
      // Hiển thị thông báo lỗi nếu không hợp lệ
      console.log("input-validate", input);

      if (input.dataset.id === "diem1__c" || input.dataset.id === "diem2__c" || input.dataset.id === "diem3__c") { 
        const diem = parseInt(input.value, 10);

        if (isNaN(diem) || diem > 10 ) {
            input.setCustomValidity('DIEM PHAI NHO HON 10'); //hiển thị được trực tiếp dười input
        } else {
            input.setCustomValidity(''); // Không có lỗi
        }
    }

      if (!input.checkValidity()) {
        // Hiển thị lỗi tùy chỉnh bằng setCustomValidity.
        input.reportValidity(); // Kích hoạt hiển thị thông báo lỗi
        // ageField.setCustomValidity('Tuổi phải nằm trong khoảng từ 18 đến 60');
        valid = false;
      }
    });
    if (!valid) {
      console.log("Form không hợp lệ");
      return true;
    } 
    console.log("Form hợp lệ");
    return false;
  }
}

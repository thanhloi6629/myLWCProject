import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getGrades from "@salesforce/apex/StudentController.getGrades";
import addStudent from "@salesforce/apex/StudentController.addStudent";
import editStudent from "@salesforce/apex/StudentController.editStudent";

// import addStudentV2 from "@salesforce/apex/StudentController.addStudentV2";

export default class AddStudent extends LightningElement {
  @api ismodalopen;
  // @api selecteddata;
  gradeOptions = [];
  @api objsubmit = {};

  closeModal() {
    this.dispatchEvent(new CustomEvent("closemodal"));
  }

  async connectedCallback() {
    console.log("objsubmit:", JSON.stringify(this.objsubmit));
    await getGrades()
      .then((result) => {
        console.log("A-result", result);
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
  renderedCallback() {
    console.log("C-vaoday-objsubmit", this.objsubmit);

    // if(this.selecteddata){
    //   this.objsubmit = this.selecteddata;
    // }
  }

  get genderOptions() {
    return [
      { label: "Nam", value: "Nam" },
      { label: "Nữ", value: "Nữ" },
      { label: "Khác", value: "Khác" }
    ];
  }

  handleSubmit() {
    console.log("C-vaoday-Submit-result", JSON.stringify(this.objsubmit));
    addStudent({
      name: this.objsubmit.name,
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
        this.handleSuccess();
        this.closeModal();
        // this.objsubmit = {};
      })
      .catch((error) => {
        console.log("error", error);
      });

    // else {
    //   editStudent({
    //     id: this.objsubmit.Id,
    //     name: this.objsubmit.name,
    //     firstName: this.objsubmit.firstName__c,
    //     lastName: this.objsubmit.lastName__c,
    //     birthday: this.objsubmit.birthday__c,
    //     gender: this.objsubmit.gender__c,
    //     diem1: this.objsubmit?.diem1__c,
    //     diem2: this.objsubmit.diem2__c,
    //     diem3: this.objsubmit.diem3__c,
    //     grade: this.objsubmit.grade__c
    //   })
    //     .then((result) => {
    //       console.log("result", result);
    //       this.handleSuccess();
    //       this.closeModal();
    //       // this.objsubmit = {};
    //     })
    //     .catch((error) => {
    //       console.log("error", error);
    //     });
    // }

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

  handleSuccess() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Student created successfully!",
        variant: "success"
      })
    );
  }

  handleChange(event) {
    try {
      const name = event.target.name;
      console.log("name", name);
      console.log("name-value", event.target.value);
      console.log('objsubmit',  this.objsubmit);

      if (!this.objsubmit.id) {
        console.log("chay");
        // this.objsubmit = { ...this.objsubmit};
      }
      this.objsubmit[name] = event.target.value;


      console.log("object-2", JSON.stringify(this.objsubmit));
    } catch (error) {
      console.log(error);
    }
  }

  handleClick(evt) {
    console.log("Current value of the input: " + evt.target.value);
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

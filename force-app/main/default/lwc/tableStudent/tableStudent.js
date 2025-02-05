import { LightningElement, api, track } from "lwc";
import sendMailStudentFall from "@salesforce/apex/StudentController.sendMailStudentFall";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class TableStudent extends LightningElement {
  @api student;
  @api column;
  @api totalRecords;
  @track sortedBy; // Cột được sort
  @track sortedDirection = 'asc'; // Chiều sort ban đầu (asc hoặc desc)
  @track selectedRecords = [];
  @api resetSelectedRecords(){
    this.selectedRecords = [];
    // reset trạng thái checkbox "Select All"
    const selectAllCheckbox = this.template.querySelector('input[name="selectAll"]');
    if(selectAllCheckbox) {
      selectAllCheckbox.checked = false;
    }
  }

  get getStudent() {
    return this.student.map((st) => ({
      ...st,
      color: st.status__c === "Rớt" ? "student-row fail-row" : "student-row pass-row"
    }));
  }

  get columnsWithSortIcon() {
    return this.column.map(column => {
      let sortIcon = "utility:sort";
      if(this.sortedBy === column.fieldName){
        sortIcon =
        this.sortedDirection === "asc"
          ? "utility:arrowup"
          : "utility:arrowdown";
      }
      return {
        ...column,
        sortIcon: sortIcon,
      };
    } );
  }

  sendMailStudentFall(){
    try {
      sendMailStudentFall();
      this.handleSendMailSuccess();
    } catch (error) {
      console.log(error);
    }
  }


  handleSort(event) {
    const fieldName = event.target.dataset.field;
    const sort = this.sortedBy === fieldName && this.sortedDirection === 'asc' ? 'desc' : 'asc';
    this.sortedDirection = sort;
    this.sortedBy = fieldName;
    console.log('S-fieldName:', fieldName);
    console.log('S-sortDirection:', sort);

    const sortEvent = new CustomEvent("sort", {
      detail: { fieldName: fieldName, sortDirection: sort }
    });
    this.dispatchEvent(sortEvent);
    // Gửi yêu cầu sort và phân trang đến backend
    // this.fetchData();
  }

  

  handleEdit(event) {
    const Id = event.currentTarget.dataset.id;
    const studentData = this.student.find((student) => student.Id === Id);
    const editEvent = new CustomEvent("editstudent", { detail: studentData });
    this.dispatchEvent(editEvent);
  }

  handleDelete(event) {
    const Id = event.currentTarget.dataset.id;
    const deleteEvent = new CustomEvent("deletestudent", { detail: Id });
    this.dispatchEvent(deleteEvent);
  }
  // Handle "Select All" checkbox
  handleSelectAll(event) {
    const isChecked = event.target.checked;
    const checkboxes = this.template.querySelectorAll('input[name="selectRow"]');

    this.selectedRecords = [];
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
      if (isChecked) {
        this.selectedRecords.push(checkbox.dataset.id);
      }
    });
    const editEvent = new CustomEvent("ids", { detail: this.selectedRecords });
    this.dispatchEvent(editEvent);
  }



  // Handle individual row selection
  handleRowSelection(event) {
    const isChecked = event.target.checked;
    const recordId = event.target.dataset.id;
    if (isChecked) {
      if (!this.selectedRecords.includes(recordId)) {
        this.selectedRecords.push(recordId);
      }
    } else {
      this.selectedRecords = this.selectedRecords.filter(
        (selectedId) => selectedId !== recordId
      );
    }
    // Update "Select All" checkbox status
    const allChecked = this.selectedRecords.length === this.student.length;
    this.template.querySelector('input[name="selectAll"]').checked = allChecked;

    // transfer selected records to parent component
    const editEvent = new CustomEvent("ids", { detail: this.selectedRecords });
    this.dispatchEvent(editEvent);
  }

   handleSendMailSuccess() {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Success",
          message: "Send mail success!",
          variant: "success"
        })
      );
    }

  // getContactField(contact, fieldName) {
  //     return contact[fieldName];
  //   }
}

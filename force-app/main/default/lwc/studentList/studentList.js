import { LightningElement, track } from "lwc";
// import getAccounts from'@salesforce/apex/AccountController.getAccounts';
import getStudents from "@salesforce/apex/StudentController.getStudents";
import deleteStudent from "@salesforce/apex/StudentController.deleteStudent";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getGrades from "@salesforce/apex/StudentController.getGrades";
import getSearchedData from "@salesforce/apex/StudentController.getSearchedData";

const students = [
  {
    id: "003171931112854375",
    firstName__c: "Amy",
    lastName__c: "Taylor",
    date: "2021-05-04",
    gender: "Nam",
    diem1: 1,
    diem2: 2,
    diem3: 4,
    diemTB: 4,
    status: "Đậu"
  },
  {
    id: "003171931112854372",
    firstName__c: "Amy2",
    lastName__c: "FHai",
    date: "2021-05-02",
    gender: "Nam",
    diem1: 1,
    diem2: 2,
    diem3: 4,
    diemTB: 4,
    status: "Rớt"
  },
  {
    id: "003171931112854373",
    firstName__c: "Hai",
    lastName__c: "hac",
    date: "2021-05-04",
    gender: "Nam",
    diem1: 1,
    diem2: 2,
    diem3: 2,
    diemTB: 4,
    status: "Rớt"
  }
];
const columns = [
  { label: "Code", fieldName: "code__c" },
  { label: "Name", fieldName: "Name" },
  { label: "First Name", fieldName: "firstName__c" },
  { label: "Last Name", fieldName: "lastName__c" },
  { label: "Date", fieldName: "date__c" },
  { label: "Gender", fieldName: "gender__C" },
  { label: "Diem1", fieldName: "diem1__c" },
  { label: "Diem2", fieldName: "diem2__c" },
  { label: "Diem3", fieldName: "diem3__c" },
  { label: "DiemTB", fieldName: "diemTB__c" },
  { label: "Status", fieldName: "status__c" }
];
export default class StudentList extends LightningElement {
  columns = columns;
  @track students = students;
  lstStudent = [];
  @track isModalOpen = false;
  @track isModalOpenCustom = false;
  objEdit = {};
  gradeOptions =[]

  connectedCallback() {
    this.getStudentsList();
    this.getGradesList();
  }

  handleSearch(event) {
     getSearchedData({ name: event.detail.name, grade: event.detail.grade, fromDate: event.detail.fromDate, toDate: event.detail.toDate}).then((result) => {
      if(result.length === 0) { 
        this.lstStudent = [];
        return;
      }
      this.lstStudent = result;
    }).catch((err) => {
      console.log('err', err);
    });
  //  this.lstStudent = 
  }
    


  async getGradesList() {
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

   async getStudentsList() {
    await getStudents()
      .then((result) => {
        this.lstStudent = result;
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleOpenModal(event) {
    this.isModalOpen = event.detail.isOpenModal;
  }
  
  handleCloseModal() {
    this.isModalOpen = false;
  }

  handleOpenModalCustom(event) {
    this.isModalOpenCustom = event.detail.isOpenModalCustom;
  }

  handleCloseModalCustom() {
    this.isModalOpenCustom = false;
    this.objEdit = {};
    console.log("L-closeModalCustom", this.objEdit);
  }

  handleEditStudent(event) {
    this.isModalOpenCustom = true;
    console.log('L-handleEditStudent', {... event.detail});
    this.objEdit = {... event.detail} ;
  } 

  handleDeleteStudent(event) {
    const Id = event.detail.Id;
      deleteStudent({Id: Id}).then(() => {
      this.handleDeleteSuccess();
      }).catch((err) => {
      console.log(err)
    })
  }

  handleDeleteSuccess() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Student Delete successfully!",
        variant: "success"
      })
    );
  }
}

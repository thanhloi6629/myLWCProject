import { LightningElement, track } from "lwc";
// import getAccounts from'@salesforce/apex/AccountController.getAccounts';
import getStudents from "@salesforce/apex/StudentController.getStudents";

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
  objSubmit = {};

  connectedCallback() {
    this.getStudentsList();
    // console.log('data std: ' +  JSON.stringify(this.payLoadData));
    console.log("không in được giá trị lstAccount trong hàm connectedCallback");
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
  receivedMessage = {};
  handleMessage(event) {
    this.receivedMessage = event.detail;
  }

  handleOpenModal(event) {
    this.isModalOpen = event.detail.isOpenModal;
  }
  
  handleCloseModal() {
    this.isModalOpen = false;
  }

  handleOpenModalCustom(event) {
    console.log('event.detail.isOpenModalCustom' + JSON.stringify(  event.detail.isOpenModalCustom));
    this.isModalOpenCustom = event.detail.isOpenModalCustom;
    if(!this.objSubmit.id){
      this.objSubmit = {};
    }
  }

  handleCloseModalCustom() {
    this.isModalOpenCustom = false;
  }

  handleEditStudent(event) {
    console.log('C-vaoday-handleEditStudent', event.detail);
    console.log('event.detail' + JSON.stringify(event.detail));
    // this.isModalOpen = true;
    this.isModalOpenCustom = true;
    // const a = {...event.detail};
    // console.log('object a: ' + JSON.stringify(a));
    this.objSubmit = event.detail;
  } 
}

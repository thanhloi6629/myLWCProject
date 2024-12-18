import { LightningElement, track } from "lwc";
import deleteStudent from "@salesforce/apex/StudentController.deleteStudent";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getGrades from "@salesforce/apex/StudentController.getGrades";
import getStudentsPagination from "@salesforce/apex/StudentController.getStudentsPagination";
import deleteStudentByIds from "@salesforce/apex/StudentController.deleteStudentByIds";

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
  { label: "Mã", fieldName: "code__c" },
  { label: "Họ và Tên", fieldName: "Name" },
  { label: "Họ", fieldName: "firstName__c" },
  { label: "Tên", fieldName: "lastName__c" },
  { label: "Ngày Sinh", fieldName: "date__c" },
  { label: "Giới Tính", fieldName: "gender__C" },
  { label: "Diểm Toán", fieldName: "diem1__c" },
  { label: "Điểm Lý", fieldName: "diem2__c" },
  { label: "Điểm Hóa", fieldName: "diem3__c" },
  { label: "Điểm TB", fieldName: "diemTB__c" },
  { label: "Trạng Thái", fieldName: "status__c" }
];
export default class StudentList extends LightningElement {
  columns = columns;
  lstStudent = [];
  @track students = students;
  @track isModalOpen = false;
  @track isModalOpenCustom = false;
  @track totalPage = 0;
  @track ids = [];
  objEdit = {};
  isConfirmModalOpen = false;
  idDelete;
  isConfirmModalOpenDeleteMany = false;
  pageNumber = 1;
  pageSize = 10;
  objSearch = {};
  isLoaded = false;
  sortOrder = "ASC";

  connectedCallback() {
    this.getGradesList();
    this.getStudentsListPagination({
      pageSize: this.pageSize,
      pageNumber: (this.pageNumber - 1) * this.pageSize
    });
  }

  toggle() {
    this.isLoaded = !this.isLoaded;
  }

  handleSearch(event) {
    this.objSearch = { ...event.detail };
    console.log("L-objsearch", this.objSearch);
    this.getStudentsListPagination({
      pageSize: this.pageSize,
      pageNumber: (this.pageNumber - 1) * this.pageSize
    });
  }

  handleSortName(event) {
    console.log("L-handleSortName", event.detail);
    if (event.detail.checked) {
      this.sortOrder = "ASC";
    } else {
      this.sortOrder = "DESC";
    }
    this.getStudentsList();
  }

  changePageNumber(event) {
    this.pageNumber = event.detail;
    this.getStudentsListPagination({
      pageSize: this.pageSize,
      pageNumber: (this.pageNumber - 1) * this.pageSize
    });
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
    this.getStudentsListPagination({
      pageSize: this.pageSize,
      pageNumber: (this.pageNumber - 1) * this.pageSize
    });
  }

  async getStudentsListPagination({ pageSize, pageNumber }) {
    this.isLoaded = true;
    console.log("S-this.sortOrder", this.sortOrder);
    console.log("S-this.objSearch", this.objSearch);

    await getStudentsPagination({
      pageSize: pageSize,
      pageNumber: pageNumber,
      name: this.objSearch.lastName__c,
      grade: this.objSearch.grade,
      fromDate: this.objSearch.fromDate,
      toDate: this.objSearch.toDate,
      sortField: "lastName__c",
      sortOrder: this.sortOrder
    })
      .then((result) => {
        console.log("L-listPagination", result);
        this.lstStudent = result.students;
        this.totalPage = result.totalPage;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.isLoaded = false;
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
  }

  handleEditStudent(event) {
    this.isModalOpenCustom = true;
    this.objEdit = { ...event.detail };
  }

  handleCancel() {
    this.isConfirmModalOpen = false; // Đóng modal khi nhấn Hủy
  }
  handleCancelDeleteMany() {
    this.isConfirmModalOpenDeleteMany = false; // Đóng modal khi nhấn Hủy
  }

  handleConfirm() {
    this.isConfirmModalOpen = false; // Đóng modal
    // Thực hiện logic xóa
    deleteStudent({ Id: this.idDelete })
      .then((result) => {
        console.log("L-delete", result);
        this.handleDeleteSuccess();
        // this.getStudentsList();
        this.getStudentsListPagination({
          pageSize: this.pageSize,
          pageNumber: (this.pageNumber - 1) * this.pageSize
        });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Record has been deleted!");
  }

  handleDeleteStudent(event) {
    this.isConfirmModalOpen = true; //Mở modal khi bấm delete
    this.idDelete = event.detail;
  }

  changeIds(event) {
    this.ids = [...event.detail]; //["A", "B"] => ['A', 'B']
  }

  //confirm xác nhân xóa nhiều record
  handleConfirmDeleteMany() {
    deleteStudentByIds({ ids: this.ids })
      .then((result) => {
        console.log("L-deletemay", result);
        this.handleDeleteSuccess();
        this.getStudentsListPagination({
          pageSize: this.pageSize,
          pageNumber: (this.pageNumber - 1) * this.pageSize
        });
        this.isConfirmModalOpenDeleteMany = false; // Đóng modal
      })
      .catch((err) => {
        console.log("errr", err);
      });
  }

  handleDeleteManyRecord() {
    this.isConfirmModalOpenDeleteMany = true;
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

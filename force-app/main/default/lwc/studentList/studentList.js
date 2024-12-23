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
  { label: "Ngày Sinh", fieldName: "birthday__c" },
  { label: "Giới Tính", fieldName: "gender__C" },
  { label: "Diểm Toán", fieldName: "diem1__c" },
  { label: "Điểm Lý", fieldName: "diem2__c" },
  { label: "Điểm Hóa", fieldName: "diem3__c" },
  { label: "Điểm TB", fieldName: "diemTB__c" },
  { label: "Trạng Thái", fieldName: "status__c" }
];
export default class StudentList extends LightningElement {
  totalRecords;
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
  isDisableDelete = true;
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
      pageNumber: this.pageNumber
    });
  }

  toggle() {
    this.isLoaded = !this.isLoaded;
  }

  handleSearch(event) {
    this.objSearch = { ...event.detail };
    console.log("L-objsearch", this.objSearch);
    this.pageNumber = 1;
    this.getStudentsListPagination({
      pageSize: this.pageSize,
      pageNumber: this.pageNumber
    });
  }

  handleSort(event) {
    console.log("L-handleSort", event.detail.fieldName);
    console.log("L-handleSort", event.detail.sortDirection);

    this.getStudentsListPagination({
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      fieldName: event.detail.fieldName,
      sortDirection: event.detail.sortDirection
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
      pageNumber: this.pageNumber
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
      pageNumber: this.pageNumber
    });
  }

  async getStudentsListPagination({ pageSize, pageNumber, fieldName, sortDirection }) {
    this.isLoaded = true;
    console.log("S-this.sortOrder", this.sortOrder);
    console.log("S-this.pageSize", pageSize);
    console.log("S-this.pageNumber", pageNumber);


    await getStudentsPagination({
      pageSize: pageSize,
      pageNumber: pageNumber,
      name: this.objSearch.lastName__c,
      grade: this.objSearch.grade,
      fromDate: this.objSearch.fromDate,
      toDate: this.objSearch.toDate,
      sortField: fieldName ? fieldName : "lastName__c",
      sortOrder: sortDirection ? sortDirection : this.sortOrder
    })
      .then((result) => {
        console.log("L-listPagination", result);
        this.lstStudent = result.students;
        this.totalPage = result.totalPage;
        this.totalRecords = result.totalRecords;
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
        this.getStudentsListPagination({
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
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
    console.log("L-ids", this.ids);
    console.log("L-ids-event",[...event.detail])
    if(event.detail.length > 0) {
      this.isDisableDelete = false;
    } else {
      this.isDisableDelete = true;
    }
  }

  //confirm xác nhân xóa nhiều record
  handleConfirmDeleteMany() {
    deleteStudentByIds({ ids: this.ids })
      .then((result) => {
        console.log("L-deletemay", result);
        this.handleDeleteSuccess();
        // Đứng ở page cuối cùng, chọn toàn bộ record và xóa hết
        if(this.pageNumber === this.totalPage ) {
          const totalRecordsAfterDelete = this.totalRecords - this.ids.length;
          if(totalRecordsAfterDelete % this.pageSize === 0 && totalRecordsAfterDelete !== 0) {
            this.pageNumber = this.pageNumber - 1;
          }
        }
        this.getStudentsListPagination({
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        });
        this.isConfirmModalOpenDeleteMany = false; // Đóng modal
        this.isDisableDelete = true;
        this.ids = [];
       
        // gửi sự kiển để reset selectedRecords trong Table Student
        
        this.template.querySelector("c-table-student").resetSelectedRecords();

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

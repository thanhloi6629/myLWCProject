import { LightningElement } from 'lwc';

export default class StudentList extends LightningElement {
  data = [];
  contacts = [
    {
        Id: '003171931112854375',
        FirstName: 'Amy',
        LastName: 'Taylor',
        Date: '2021-05-04',
        Gender: 'Nam',
        DTB: 7,
        Status: 'Đậu',
        Diem1: 1,
        Diem2: 2,
        Diem3: 4,
        DiemTB: 4,
        TinhTrang: 'Đậu'
    },
    {
        Id: '003171931112854372',
        FirstName: 'Amy2',
        LastName: 'FHai',
        Date: '2021-05-02',
        Gender: 'Nam',
        DTB: 10,
        Status: 'Rớt',
        Diem1: 1,
        Diem2: 2,
        Diem3: 4,
        DiemTB: 4,
        TinhTrang: 'Đậu'
    
    },
    {
        Id: '003171931112854373',
        FirstName: 'Hai',
        LastName: 'hac',
        Date: '2021-05-04',
        Gender: 'Nam',
        DTB: 8,
        Status: 'Rớt',
        Diem1: 1,
        Diem2: 2,
        Diem3: 2,
        DiemTB: 4,
        TinhTrang: 'Đậu'
    },
    
  ];
  columns = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Gender', fieldName: 'Gender'},
    { label: 'DTB', fieldName: 'DTB' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Diem1', fieldName: 'Diem1'},
    { label: 'Diem2', fieldName: 'Diem2'},
    { label: 'Diem3', fieldName: 'Diem3'},
    { label: 'DiemTB', fieldName: 'DiemTB'},
    { label: 'TinhTrang', fieldName: 'TinhTrang'},
    { label: 'Action', name: 'Action', 
      type: 'action'}


  ];
  connectedCallback ()  {
    this.data = this.contacts;
  }
}



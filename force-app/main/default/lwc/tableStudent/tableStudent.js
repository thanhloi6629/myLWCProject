import { LightningElement, api } from 'lwc';

export default class TableStudent extends LightningElement {
    @api student;
    @api column;

    connectedCallback ()  {
        console.log('student234', JSON.stringify(this.student));
        console.log('students2', this.student);
        console.log('students4556', this.column);
    }
    handleEdit (event){
        const code = event.currentTarget.dataset.id;
        const studentData = this.student.find(student => student.code__c === code);
        console.log('studentData-convert', JSON.stringify(studentData));
        console.log('studentData', JSON.stringify(studentData));

        const editEvent = new CustomEvent('editstudent', {detail: studentData});
        this.dispatchEvent(editEvent);
    }

    getContactField(contact, fieldName) {
        return contact[fieldName];
      }
}
import { LightningElement, api } from 'lwc';

export default class TableStudent extends LightningElement {
    @api student;
    @api column;

    handleEdit (event){
        const Id = event.currentTarget.dataset.id;
        const studentData = this.student.find(student => student.Id === Id);
        const editEvent = new CustomEvent('editstudent', {detail: studentData});
        this.dispatchEvent(editEvent);
    }
    
    handleDelete (event){
        const Id = event.currentTarget.dataset.id;
        console.log('Id-table', Id);
        const deleteEvent = new CustomEvent('deletestudent', {detail: Id});
        this.dispatchEvent(deleteEvent);
    }

    getContactField(contact, fieldName) {
        return contact[fieldName];
      }

    
   
}
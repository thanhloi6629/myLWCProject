import { LightningElement, api } from 'lwc';

export default class TableStudent extends LightningElement {
    @api student;
    @api column;

    connectedCallback ()  {
        console.log('student234', JSON.stringify(this.student));
        console.log('students2', this.student);
        console.log('students4556', this.column);
    }
    handleEdit (){
        console.log('Edit');
    }

    getContactField(contact, fieldName) {
        return contact[fieldName];
      }
}
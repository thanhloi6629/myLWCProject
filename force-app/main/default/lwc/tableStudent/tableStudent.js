import { LightningElement, api, track } from 'lwc';

export default class TableStudent extends LightningElement {
    @api student;
    @api column;
    @track selectedRecords = [];
    handleEdit (event){
        const Id = event.currentTarget.dataset.id;
        const studentData = this.student.find(student => student.Id === Id);
        const editEvent = new CustomEvent('editstudent', {detail: studentData});
        this.dispatchEvent(editEvent);
    }
    
    handleDelete (event){
        const Id = event.currentTarget.dataset.id;
        const deleteEvent = new CustomEvent('deletestudent', {detail: Id});
        this.dispatchEvent(deleteEvent);
    }

   // Handle "Select All" checkbox
    handleSelectAll(event) {
        console.log(event.target.checked);
        const isChecked = event.target.checked;
        const checkboxes = this.template.querySelectorAll('input[name="selectRow"]');
        this.selectedRecords = [];
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            if(isChecked) {
                this.selectedRecords.push(checkbox.value);
            }
        })
         // transfer selected records to parent component
         const editEvent = new CustomEvent('ids', {detail: this.selectedRecords});
         this.dispatchEvent(editEvent);
    }

    // Handle individual row selection
    handleRowSelection(event) {
        console.log(event.target.checked);
        const isChecked = event.target.checked;
        const recordId = event.target.dataset.id;
        if(isChecked) {
           if(!this.selectedRecords.includes(recordId)) {
               this.selectedRecords.push(recordId);
           }
        } else {
            this.selectedRecords = this.selectedRecords.filter(selectedId => selectedId !== recordId);
        }
         // Update "Select All" checkbox status
        const allChecked = this.selectedRecords.length === this.student.length;
        this.template.querySelector('input[name="selectAll"]').checked = allChecked;

        console.log('selectedRecords123', JSON.stringify(this.selectedRecords));

        // transfer selected records to parent component
        const editEvent = new CustomEvent('ids', {detail: this.selectedRecords})
        this.dispatchEvent(editEvent);
    }



    

    getContactField(contact, fieldName) {
        return contact[fieldName];
      }

    
   
}
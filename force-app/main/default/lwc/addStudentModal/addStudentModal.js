import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddStudentModal extends LightningElement {
    @track isModalOpen = false;
    @api objectApiName;
    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleSuccess() {
        this.isModalOpen = false;
        const selectedEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Contact created successfully!',
            variant: 'success',
        });
        this.dispatchEvent(selectedEvent);
    }


}
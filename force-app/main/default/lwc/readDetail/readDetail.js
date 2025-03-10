import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import getReadList from '@salesforce/apex/ReadListController.getReadList';
import getUsers from '@salesforce/apex/ReadListController.getUsers';
import getContacts from '@salesforce/apex/ReadListController.getContacts';


export default class ReadListForm extends LightningElement {
    @api recordId;
    @track readList = {};
    @track isEditMode = false;
    @track originalData = {};
    @track userOptions = [];
    
    
    wiredReadListResult;
    activeSections = ['section1', 'section2'];

    get urlEmail () { 
        return `mailto:${this.readList.Email__c}`;
    }

    get urlContact () { 
        return `/lightning/r/Contact/${this.readList.Contact__c}/view`;
    }
   
    get classBoxShadow() {
        return this.isEditMode 
        ? 'slds-p-around_medium slds-box edit-mode-shadow' 
        : '';
    }
    get classSecondBorder () {
        const baseClassColum2 = 'slds-form-element slds-p-horizontal_xx-small ';
        return `${baseClassColum2} ${this.isEditMode ? '' : 'slds-border_bottom'}`.trim();
    }
    
    // Define picklist options
    get statusOptions() {
        return [
            { label: 'InProgress', value: 'InProgress' },
            { label: 'Completed', value: 'Completed' },
        ];
    }
    
    get priorityOptions() {
        return [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ];
    }
    
    // Fetch data from Apex
    @wire(getReadList, { recordId: '$recordId' })
    wiredReadList(result) {
        this.wiredReadListResult = result;
        if (result.data) {
            this.readList = {...result.data};
            this.originalData = {...result.data};
        } else if (result.error) {
            this.handleError(result.error);
        }
    }

    @wire(getUsers)
    wiredUsers({ error, data }) {
        if (data) {
            console.log('data', data);
            console.log('readList', this.readList)
            this.userOptions = data;
        } else if (error) {
            console.error('Error loading users', error);
        }
    }
    

    @wire(getContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.contactOptions = data;
        } else if (error) {
            console.error('Error loading users', error);
        }
    }
    
    // Handle Edit button click
    handleEditClick() {
        this.isEditMode = true;
    }
    
    // Handle Cancel button click
    handleCancelClick() {
        this.readList = {...this.originalData};
        this.isEditMode = false;
    }
    
    // Handle Save button click
    handleSaveClick() {
       this.updateReadList();
    }
    
    // Handle changes to input fields
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.readList = {...this.readList, [field]: value};
    }
    
    // Handle slider change for Progress
    handleSliderChange(event) {
        this.readList.Progress = event.target.value;
    }
    
    // Handle lookup field changes
    handleLookupChange(event) {
        const field = event.target.fieldName;
        const value = event.target.value;
        
        this.readList = {...this.readList, [field]: value};
    }
    
    // Show toast notification
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

    refreshData() {
        // Refresh the data using refreshApex
        if (this.wiredReadListResult) {
            refreshApex(this.wiredReadListResult);
        }
    }
    
    // Handle error
    handleError(error) {
        let message = 'Unknown error';
        if (Array.isArray(error.body)) {
            message = error.body.map(e => e.message).join(', ');
        } else if (typeof error.body.message === 'string') {
            message = error.body.message;
        }
        
        this.showToast('Error', message, 'error');
    }

    updateReadList() {
        // Show loading spinner
        this.isLoading = true;
        // Create a record to update with the current values
        const fields = {};
        // Add all tracked fields to the update record
        fields.Id = this.readList.Id;
        // Basic info fields
        if (this.readList.Name) fields.Name = this.readList.Name;
        if (this.readList.Description !== undefined) fields.Description__c = this.readList.Description;
        if (this.readList.Status) fields.Status__c = this.readList.Status;
        if (this.readList.IsActive !== undefined) fields.IsActive__c = this.readList.IsActive;
        if (this.readList.LastUpdated) fields.LastUpdated__c = this.readList.LastUpdated;
        if (this.readList.CreatedDate) fields.CreatedDate__c = this.readList.CreatedDate;

        if (this.readList.DueDate) fields.DueDate__c = this.readList.DueDate;
        if (this.readList.Owner__c) fields.Owner__c = this.readList.Owner__c;
        if (this.readList.Amount !== undefined) fields.Amount__c = this.readList.Amount;
        if (this.readList.Progress !== undefined) fields.Progress__c = this.readList.Progress;
        
        // Contact related fields
        if (this.readList.Contact__c) fields.Contact__c = this.readList.Contact__c;
        // if (this.readList.ContactEmail__c) fields.ContactEmail__c = this.readList.ContactEmail__c;
        
        // Additional fields
        if (this.readList.CustomNumber__c !== undefined) fields.CustomNumber__c = this.readList.CustomNumber__c;
        if (this.readList.Priority) fields.Priority__c = this.readList.Priority;
        if (this.readList.IsCompleted !== undefined) fields.IsCompleted__c = this.readList.IsCompleted;
        if (this.readList.CustomText__c) fields.CustomText__c = this.readList.CustomText__c;
        if (this.readList.Notes !== undefined) fields.Notes__c = this.readList.Notes;
        if (this.readList.Email__c !== undefined) fields.Email__c = this.readList.Email__c;

        // Create the record input for update
        const recordInput = { fields };
        console.log('fields submit', recordInput);
        console.log('fields fields', fields);

        
        // Call the updateRecord method 
        updateRecord(recordInput)
            .then(() => {
                // Show success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Read List updated successfully',
                        variant: 'success'
                    })
                );
                // Exit edit mode
                this.isEditMode = false;
                // Refresh the data to show the latest version
                this.refreshData();
            })
            .catch(error => {
                console.log('error', error);
                // Show error message
                this.handleError(error);
            })
            .finally(() => {
                // Hide loading spinner
                this.isLoading = false;
            });
    }
}
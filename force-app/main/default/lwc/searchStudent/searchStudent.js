import { LightningElement } from 'lwc';

export default class SearchStudent extends LightningElement {
    value = 'inProgress';
    selectedDateFrom;
    selectedDateTo;
    disabledDates = false;
    handleClick() {
        this.disabledDates = !this.disabledDates;
    }
    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}
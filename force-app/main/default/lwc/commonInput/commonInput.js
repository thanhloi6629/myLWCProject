import { LightningElement} from 'lwc';

export default class CommonInput extends LightningElement {
    textValue = '';
    handleInputChange(event) {
        this.textValue = event.target.value;
    }
}
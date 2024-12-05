import { LightningElement , api} from 'lwc';

export default class ReUsableModal extends LightningElement {
    @api isOpen = false;

    closeModal() {
      this.dispatchEvent(new CustomEvent("closemodal"));
    }
}
import { LightningElement, api } from "lwc";

export default class CommonInput extends LightningElement {
  @api label;
  @api name;
  @api min = 0;
  @api max;
  @api step = 1;
  value = 0;
  handleIncrease() {
    if (this.value < this.max) {
      this.value = parseFloat(this.value) + parseFloat(this.step);
      this.dispatchChangeEvent();
    }
  }

  handleDecrease() {
    if (this.value > this.min) {
      this.value = parseFloat(this.value) - parseFloat(this.step);
      this.dispatchChangeEvent();
    }
  }

  // Xử lý thay đổi input trực tiếp
  handleChange(event) {
    this.value = event.target.value;
    this.dispatchChangeEvent();
  }
 
  dispatchChangeEvent() {
    const event = new CustomEvent("change", {
      detail: {
        value: this.value,
      }
    }); 
    this.dispatchEvent(event);
  }
}

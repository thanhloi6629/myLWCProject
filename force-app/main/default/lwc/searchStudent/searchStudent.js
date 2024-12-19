import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class SearchStudent extends LightningElement {
  @api gradeOptions;
  disabledDates = false;
  objSearch = {};
  @api isDisableDelete

  handleClick() {
    console.log('handleClick', this.handleClick);
    if(this.objSearch.fromDate > this.objSearch.toDate){
      this.dispatchEvent(
        new ShowToastEvent({
          title: " Error",
          message: "Từ ngày phải nhỏ hơn hoặc bằng đến ngày",
          variant: "error"
        })
      );
      return;
    }
    const customEvent = new CustomEvent("eventsearch", {
      detail: this.objSearch
    });
    this.dispatchEvent(customEvent);
  }


  handleSortByName(event) {
    this.dispatchEvent(
      new CustomEvent("eventsort", {
        detail: { checked: event.target.checked }
      })
    );
  }

  handleChange(event) {
    const value = event.detail.value
    const name = event.target.name;
    this.objSearch[name] = value;
  }

  openModal() {
    this.dispatchEvent(
      new CustomEvent("openmodal", {
        detail: { isOpenModal: true }
      })
    );
  }
  openModalCustom() {
    this.dispatchEvent(
      new CustomEvent("openmodalcustom", {
        detail: { isOpenModalCustom: true }
      })
    );
  }
  openModalDeleteManyRecord() {
    this.dispatchEvent(
      new CustomEvent("openmodaldeletemanyrecord", {
        detail: { isOpenModalDeleteManyRecord: true }
      })
    );
  }
}

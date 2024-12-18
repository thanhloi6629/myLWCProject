import { LightningElement, api } from "lwc";

export default class SearchStudent extends LightningElement {
  @api gradeOptions;
  disabledDates = false;
  objSearch = {};
  @api isDisableDelete

  handleClick() {
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

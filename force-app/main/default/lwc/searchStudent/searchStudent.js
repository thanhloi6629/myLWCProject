import { LightningElement } from "lwc";

export default class SearchStudent extends LightningElement {
  value = "inProgress";
  selectedDateFrom;
  selectedDateTo;
  disabledDates = false;
  handleClick() {
    this.disabledDates = !this.disabledDates;

    const data = {
      name: "John Doe",
      age: 25
    };

    const customEvent = new CustomEvent("messageevent", {
      detail: data
    });

    this.dispatchEvent(customEvent);
  }
  get options() {
    return [
      { label: "New", value: "new" },
      { label: "In Progress", value: "inProgress" },
      { label: "Finished", value: "finished" }
    ];
  }

  handleChange(event) {
    this.value = event.detail.value;
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
}

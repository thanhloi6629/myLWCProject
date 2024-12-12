import { LightningElement, api} from "lwc";

export default class SearchStudent extends LightningElement {
  @api gradeOptions;
  value = "inProgress";
  selectedDateFrom;
  selectedDateTo;
  disabledDates = false;
  objSearch = {};
  handleClick() {
    // this.disabledDates = !this.disabledDates;
    console.log("S-objsearch", this.objSearch);  
    const customEvent = new CustomEvent("eventsearch", {
      detail: this.objSearch,
    });

    this.dispatchEvent(customEvent);
  }
  // get options() {
  //   return [
  //     { label: "New", value: "new" },
  //     { label: "In Progress", value: "inProgress" },
  //     { label: "Finished", value: "finished" }
  //   ];
  // }
  handleSortByName(event) {  
    this.dispatchEvent(
      new CustomEvent("eventsort", {
        detail: { checked: event.target.checked }
      })
    );
  }

  handleChange(event) {
    console.log("S-event", event.target.name);
    console.log("S-event", event.target.value);
    this.value = event.detail.value;
    const name = event.target.name;
    this.objSearch[name]=event.detail.value;
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

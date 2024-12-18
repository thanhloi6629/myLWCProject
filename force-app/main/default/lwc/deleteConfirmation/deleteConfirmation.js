import { LightningElement, api } from "lwc";

export default class DeleteConfirmation extends LightningElement {
  @api isModalOpen = false; // Kiểm soát hiển thị modal

  handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel")); // Phát sự kiện khi nhấn Hủy
  }

  handleConfirm() {
    this.dispatchEvent(new CustomEvent("confirm")); // Phát sự kiện khi nhấn Xóa
  }
}

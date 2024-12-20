import { LightningElement, api, track } from "lwc";

export default class PaginationComponent extends LightningElement {
  _totalPage;
  _pageNumber;
  @api pageSize;
  @track pages = []; /// danh sách số trang
  @api
  get pageNumber() {
    return this._pageNumber;
  }
  set pageNumber(pageNumber) {
    this._pageNumber = pageNumber;
    this.calculatePages();
  }

  @api
  get totalPage() {
    return this._totalPage;
  }
  set totalPage(totalPage) {
    this._totalPage = totalPage;
    this.calculatePages();
  }

  dispatchPageChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("changepagenumber", { detail: this._pageNumber })
    );
  }

  connectedCallback() {
    this.calculatePages(); // Tính toán danh sách các số trang khi component được khởi tạo
  }

  calculatePages() {
    this.pages = [];
    // Luôn thêm trang đầu tiên
    this.pages.push({
      key: "page-1",
      number: 1,
      isEllipsis: false,
      class: `slds-button page-number ${this.pageNumber === 1 ? "active" : ""}`
    });

    // Tính khoảng hiển thị xung quanh `pageNumber`
    const startPage = Math.max(2, this.pageNumber - 2); // Bắt đầu từ trang hiện tại - 2 (tối thiểu là 2)
    const endPage = Math.min(this.totalPage - 1, this.pageNumber + 2); // Kết thúc tại trang hiện tại + 2 (tối đa là trang cuối - 1)
    // Thêm dấu "..." nếu khoảng cách giữa trang đầu và `startPage` lớn hơn 1
    if (startPage > 2) {
      this.pages.push({
        key: "ellipsis-start",
        number: "...",
        isEllipsis: true
      });
    }

    // Thêm các trang trong khoảng `startPage` đến `endPage`
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push({
        key: `page-${i}`,
        number: i,
        isEllipsis: false,
        class: `slds-button page-number ${i === this.pageNumber ? "active" : ""}`
      });
    }

    // Thêm dấu "..." nếu khoảng cách giữa `endPage` và trang cuối lớn hơn 1
    if (endPage < this.totalPage - 1) {
      this.pages.push({
        key: "ellipsis-end",
        number: "...",
        isEllipsis: true,
        class: "slds-button page-number disabled"
      });
    }

    // Luôn thêm trang cuối cùng nếu tổng số trang > 1
    if (this.totalPage > 1) {
      this.pages.push({
        key: `page-${this.totalPage}`,
        number: this.totalPage,
        isEllipsis: false,
        class: `slds-button page-number ${this.pageNumber === this.totalPage ? "active" : ""}`
      });
    }
  }

  // Xử lý khi nhấn số trang
  handlePageClick(event) {
    const selectedPage = Number(event.target.dataset.page);
    if (!isNaN(selectedPage) && selectedPage !== this.pageNumber) {
      this._pageNumber = selectedPage;
      this.dispatchPageChangeEvent();
      this.calculatePages();
    }
  }
  // Đặt class cho số trang hiện tại
  getPageClass(page) {
    return page === this.pageNumber
      ? "slds-button slds-button_brand"
      : "slds-button slds-button_neutral";
  }

  handlePrevious() {
    if (this.pageNumber > 1) {
      this._pageNumber -= 1;
      this.dispatchPageChangeEvent();
      this.calculatePages();
    }
  }

  handleNext() {
    if (this.pageNumber < this.totalPage) {
      this._pageNumber += 1;
      this.dispatchPageChangeEvent();
      this.calculatePages();
    }
  }

  handleActivePageNumber() {
    const nextButton = this.template.querySelector(
      `lightning-button[data-page="${this.pageNumber}"]`
    );
    console.log("nextButton", nextButton);
    if (nextButton) {
      nextButton.click(); // Kích hoạt sự kiện click
    }
  }

  handleFirstPage() {
    this._pageNumber = 1;
    this.dispatchPageChangeEvent();
  }

  handleLastPage() {
    this._pageNumber = this.totalPage;
    this.dispatchPageChangeEvent();
  }

  // Check if Previous button should be disabled
  get isPreviousDisabled() {
    return this.pageNumber === 1;
  }

  // Check if Next button should be disabled
  get isNextDisabled() {
    return this.pageNumber === this.totalPage;
  }
}

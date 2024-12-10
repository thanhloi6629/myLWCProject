import { LightningElement, api, track } from 'lwc';

export default class PaginationComponent extends LightningElement {
    @api pageSize;
    @api totalPages;
    _pageNumber = [];
    @track pages = [];  /// danh sách số trang
    @api
    get pageNumber() {
        return this._pageNumber;
    }
    set pageNumber(pageNumber) {
        this._pageNumber = pageNumber;
    }

    dispatchPageChangeEvent() {
        this.dispatchEvent(new CustomEvent('changepagenumber', { detail: this._pageNumber }));
    }

    connectedCallback() {
        this.calculatePages(); // Tính toán danh sách các số trang khi component được khởi tạo
    }

    calculatePages() {
       this.pages = Array.from({ length: this.totalPages }, (_, i) => {
            const page = i + 1;
            return {
                number: page,
                class: `slds-button page-number ${page === this.pageNumber ? 'active' : ''}`,
            };
        });
    }

     // Xử lý khi nhấn số trang
    handlePageClick(event) {
        const selectedPage = Number(event.target.label);
        if (selectedPage !== this.pageNumber) {
            this._pageNumber = selectedPage;
            this.dispatchPageChangeEvent();
        }
    }
    // Đặt class cho số trang hiện tại
    getPageClass(page) {
        return page === this.pageNumber ? 'slds-button slds-button_brand' : 'slds-button slds-button_neutral';
    }

    
    get formattedPages() {
        return this._pages.map(page => ({
            number: page,
            class: this.getPageClass(page)
        }));
    }
        

    // connectedCallback() {
    //     console.log('P-student', JSON.stringify(this.student));
    //     console.log('P-pageSize', this._items);
    //     if (this.student && this.student.length > 0) {
    //         this.totalPages = Math.ceil(this.student.length / this.pageSize);
    //         this.updatePaginatedstudent();
    //     }
    // }

    handlePrevious () {
        if (this.pageNumber > 1) {
            this._pageNumber -= 1
            this.dispatchPageChangeEvent();
        }
    }

    handleNext () {
        if (this.pageNumber < this.totalPages) {
            this._pageNumber += 1;
            this.dispatchPageChangeEvent();
        }
    }
    handleFirstPage () {
        this._pageNumber = 1;
        this.dispatchPageChangeEvent();
    }

    handleLastPage () {
        this._pageNumber = this.totalPages;
        this.dispatchPageChangeEvent();
    }

    // Check if Previous button should be disabled
    get isPreviousDisabled() {
        return this.pageNumber === 1;
    }

    // Check if Next button should be disabled
    get isNextDisabled() {
        return this.pageNumber === this.totalPages;
    }

}
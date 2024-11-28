import { LightningElement, track, api } from 'lwc';

export default class PaginationComponent extends LightningElement {
    @api records = [];
    @track currentPage = 1;
    @track totalPages = 0;
    pageSize = 5;

    connectedCallback() {
        if (this.records && this.records.length > 0) {
            this.totalPages = Math.ceil(this.records.length / this.pageSize);
            this.updatePaginatedRecords();
        }
    }

    updatePaginatedRecords () {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        this.paginatedRecords = this.records.slice(start, end);
    }
    handlePrevious () {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.updatePaginatedRecords();
        }
    }
    handleNext () {
        if (this.currentPage < this.totalPages) {
            this.currentPage = this.currentPage + 1;
            this.updatePaginatedRecords();
        }
    }

    // Check if Previous button should be disabled
    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    // Check if Next button should be disabled
    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

}
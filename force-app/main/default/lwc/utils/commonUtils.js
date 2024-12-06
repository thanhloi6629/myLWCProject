import { ShowToastEvent } from "lightning/platformShowToastEvent";

/**
 * Hiển thị thông báo Toast
 * @param {Object} component - `this` của component đang sử dụng.
 * @param {String} notify - Nội dung thông báo.
 * @param {String} title - Tiêu đề thông báo (mặc định là 'Success').
 * @param {String} variant - Loại thông báo ('success', 'error', 'warning', 'info') (mặc định là 'success').
 */
export function handleEditSuccess(component, notify, title = "Success", variant = "success") {
    component.dispatchEvent(
        new ShowToastEvent({
            title,
            message: notify,
            variant
        })
    );
}

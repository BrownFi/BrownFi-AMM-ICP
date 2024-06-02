export const enum TRANSACTION_STATUS {
    IDLE = "idle", // user doing nothing
    SUBMITTING = "submitting", // user click submit
    SUCCESS = "success", // transaction success
    FAIL = "fail", // transaction fail
}
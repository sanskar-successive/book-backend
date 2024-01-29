
interface IBulkUpload {
    recordsProcessed: number,
    totalErrors: number,
    timeTaken: number,
    session_id: string,
    createdBy: any,
    updatedBy: any
}

export default IBulkUpload;

interface IBulkUpload{
    recordsProcessed : number,
    totalErrors : number,
    timeTaken : number,
    session_id : string
}

export default IBulkUpload;
interface IBulkError{
    rowNumber : number,
    errorDetails : object,
    session_id : string
}

export default IBulkError;
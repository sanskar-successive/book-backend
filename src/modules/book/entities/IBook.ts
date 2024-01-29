export interface IBook {
    title : string,
    coverImage ?: string,
    price : number,
    rating : number,
    category : string,
    author : IAuthor,
    moreDetails : IMoreDetails,
    createdBy : any,
    updatedBy : any
}

export interface IAuthor{
    name : string,
    about : string,
}

export interface IMoreDetails{
    seller : string,
    text_language : string,
    description : string,
    fileSize : number,
    pages : number,
    publisher : string,
    firstPublished ?: Date,
    verified : boolean,
    edition : number,
}
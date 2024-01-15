const checkYear = (req, res, next)=>{

    const {year} = req.query;

    if(year===""){

        return res.send("year is required");
    }

    if(isNaN(year)){

        return res.send("year must be number");
    }

    if(Number(year) > 2000){

        return res.send("year must be before 2000");
    }

    next();
}

export default checkYear;
class ApiFeatures{
    constructor(query,queryStr){
        this.query =  query;
        this.queryStr = queryStr;  
    }
    
    search(){
       const keyword = this.queryStr.keyword ? {
        name:{
            $regex : this.queryStr.keyword,
            $options: "i"
        }
       }:{}
       console.log(keyword); 
        this.query = this.query.find({...keyword})
        return this;
    }

    pagination(resultperPage){
     const currentPage = this.queryStr.page || 1;
     const skip = resultperPage*(currentPage-1);
     this.query = this.query.limit(resultperPage).skip(skip)
     return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}
       const removeFields = ["keyword","page","limit"]
       removeFields.forEach(key=> delete queryCopy[key])

    //Filter for price
    let queryStr = JSON.stringify(queryCopy)
    queryStr =queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=> `$${key}`)
    this.query = this.query.find(JSON.parse(queryStr))
    return this;

    }

}

module.exports = ApiFeatures
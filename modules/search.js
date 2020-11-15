const db = require('./db_manager');

module.exports = {
    //Query di ricerca, options è usato per indicare molteplici filtri da applicare alla ricerca 
    getMediasByOptions: async (options) =>{ //unsafeOptions 
        //const defaults = {genre: "void", title: "void", quality: "void", price: {value:"void", operation: "void"}, 
        //views_count:{value:"void", operation: "void"}, director_name: "void", actors: "void"};
        //const options = Object.assign({},defaults, unsafeOptions);
        let conditions = "";
        console.log(options);

        //if (options.genre === "void") 
        //if (typeof (options.genre) == 'undefined') 
        //if (options.genre === undefined)
        //if (!("genre" in options))  
        if (options.genre === undefined) {
            conditions += " AND genre=genre";
        }else {
            conditions += " AND genre=" + db.escape(options.genre);
        }

        if (options.title === undefined){
            conditions += " AND title=title";
        }else {
            conditions += " AND title=" + db.escape(options.title);
        }

        if (options.quality === undefined){
            conditions += " AND quality=quality";
        }else {
            conditions += " AND quality=" + db.escape(options.quality);
        }

        if (options.price === undefined){
            conditions += " AND price=price";
        }else {
            switch (options.price.operation){
                case 0:
                    conditions += " AND CAST( price as DECIMAL) = CAST(" + db.escape(parseFloat(options.price.value)) + "AS DECIMAL)";
                    break;
                case 1:
                    conditions += " AND price<=" + db.escape(parseFloat(options.price.value));
                    break;
                case 2:
                    conditions += " AND price>=" + db.escape(parseFloat(options.price.value));
                    break;
                default:
                    throw "Wrong operation choice. Please choose another operation";
            }
            
        }

        if (options.views_count === undefined){
            conditions += " AND views_count=views_count";
        }else {
            switch (options.views_count.operation){
                case 0:
                    conditions += " AND views_count=" + db.escape(options.views_count.value);
                    break;
                case 1:
                    conditions += " AND views_count<=" + db.escape(options.views_count.value);
                    break;
                case 2:
                    conditions += " AND views_count>=" + db.escape(options.views_count.value);
                    break;
                default:
                    throw "Wrong option choice. Please choose another option";
            }
        }

        if (options.director_name === undefined){
            conditions += " AND director_name=director_name";
        }else {
            conditions += " AND director_name LIKE " + db.escape("%"+ options.director_name + "%"); 
            console.log(conditions) ;
        }

        if(options.actors === undefined){
            conditions += " AND actors=actors";
        }else {
            conditions += " AND actors LIKE " + db.escape("%" + options.actors + "%");
        }
        
        let querySearch = await db.query('SELECT * FROM media WHERE available=true' + conditions, []);
        return querySearch;
    }
    
    
}
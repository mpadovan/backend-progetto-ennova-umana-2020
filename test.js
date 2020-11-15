(async () => {
    const search = require("./modules/search")
    const db_manager = require('./modules/db_manager')

    db_manager.connect("root", "", "progetto_ennova_umana");
    console.log(await search.getMediasByOptions({title:"Tolo Tolo"}));
})()


//{genre: "void", title: "Tolo Tolo", quality: "void", price: {value:"void", operation: "void"}, 
//views_count:{value:"void", operation: "void"}, director_name: "void", actors: "void"}

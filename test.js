(async () => {
    const search = require("./modules/search")
    const db_manager = require('./modules/db_manager')

    db_manager.connect("root", "", "progetto_ennova_umana");
    console.log(await search.getMediasByOptions({actors: "l."}));
})()




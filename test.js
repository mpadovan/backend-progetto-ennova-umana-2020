(async () => {
    const Media = require('./modules/media');
    const db_manager = require('./modules/db_manager')
    db_manager.connect("progetto", "", "progetto_ennova_umana", '192.168.64.2');
    let a = await Promise.all([Media.getMostPopularMedias(), Media.getTopMediasByGenre('ChiaraT92'), Media.getNewReleases()]);
    let obj = {
        popular: a[0],
        topByGenre: a[1],
        newReleases: a[2]
    }
})()
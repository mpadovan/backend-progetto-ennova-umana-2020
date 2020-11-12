const auth_filter = require('./modules/auth_filter');
const auth =  require('./modules/auth_filter');
const db_manager = require('./modules/db_manager')

db_manager.connect("progetto", "", "progetto_ennova_umana");
auth_filter.isAuthorized({body:{nickname: "mpadovan"}}, null, null);
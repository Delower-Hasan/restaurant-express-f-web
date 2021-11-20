import connectionPromise from '../connection.js';

export const getCommandes = async() => {
    let connection = await connectionPromise;

    let results = await connection.all(
        'SELECT * FROM commande;'
    );
    return results;
}

export const CommandeStatus = async(status_id,commande_id) => {
    let connection = await connectionPromise;
    let sql = "UPDATE commande SET texte = ? WHERE id_commande = ?";
    connection.run(sql, [status_id,commande_id]);
}


export const addTocommande = async(idUtilisateur) => {
    let connection = await connectionPromise;
    connection.run('INSERT INTO commande (id_utilisateur,date,texte) VALUES(?,?,?)', [idUtilisateur,Date.now(),1]);
}



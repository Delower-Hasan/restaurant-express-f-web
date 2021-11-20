import connectionPromise from '../connection.js';


export const getPanier = async() => {
    let connection = await connectionPromise;
    let results = await connection.all(
        'SELECT * FROM panier;'
    );
    return results;
}


export const addProduit = async(idUtilisateur, idProduits, quantite) => {
    let connection = await connectionPromise;
   
    var sql = 'SELECT * FROM panier WHERE id_produit=?';
      var results = await connection.all(sql, idProduits);
    if(results ==''){
        return connection.run('INSERT INTO panier (id_utilisateur, id_produit,quantite) VALUES(?,?,?)', [idUtilisateur, idProduits, quantite]);
       
    }else{
        let sql = "UPDATE panier SET quantite = ? WHERE id_produit = ?";
        return connection.run(sql, [quantite+1,idProduits]);
    }
    
}


export const deletePanier = async(product_id) => {
    let connection = await connectionPromise;
    let sql = "DELETE FROM panier WHERE id_produit = ?";
    connection.run(sql, [product_id]);
}
   
export const UpdateCart = async(id, quantite) => {
    let connection = await connectionPromise;
    let sql = "UPDATE panier SET quantite = ? WHERE id_produit = ?";
     connection.run(sql, [quantite,id]);
    
}



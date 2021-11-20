import connectionPromise from '../connection.js';

export const getProduits = async () =>{
   let connection = await connectionPromise;
    let results = await connection.all(

        'SELECT * FROM produit;'
    );

    return results;
}


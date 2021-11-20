// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, request, response, urlencoded } from 'express';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './csp-options.js'
import { getProduits } from './model/produits.js';
import { getCommandes,CommandeStatus,addTocommande } from './model/commandes.js';
import { getPanier,addProduit,deletePanier,UpdateCart } from './model/panier.js';


/*let produits = await getProduits();
console.log(produits);*/

// Création du serveur
const app = express();
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));


// Ajouter les routes ici ...
app.get('/home', (request, response) => {
    response.render('home', {
        titre: 'Page d\'accueil',

    });

});


app.get('/', (request, response) => {
    response.render('home', {
        titre: 'Page d\'accueil',
    });

});
import connectionPromise from './connection.js';
app.get('/produits', async(request, response) => {
    const paniers = await getPanier();
    let connection = await connectionPromise;
 let results = await connection.all(
     'SELECT * FROM produit'
 ); 


let products = []    
     paniers.forEach((pani)=>{
         results.forEach(product=>{
             if(product.id_produit == pani.id_produit){
                 products.push({product:product, quantite:pani.quantite});
             }
         })
     });
   
    response.render('produits', {
        titre: 'menu',
        carts: products,
        produits: await getProduits()
    });
});

app.get('/commandes', async(request, response) => {
  
    response.render('commandes', {
        titre: 'commandes',
        commandes: await getCommandes(),
      
    });
});

app.post('/commandes-status', async(request, response) => {
    const {status_id,commande_id} =request.body
    CommandeStatus(status_id,commande_id)
   return response.status(200).json({
        success: true,
        data: {status_id,commande_id}
    })
});


// app.post('/menu', async(request, response) => {
//     addProduit(
//         request.body.idUitilisateur,
//         request.body.idproduits,
//         request.body.quantite,
//     );
// });



app.get('/menu', async(request, response) => {
    response.render('panier', {
        items: await getProductPanier()
    });
});

app.get('/reservation', (request, response) => {
    response.render('reservation', {
        titre: 'reservation',
        errmsg: ''
    });

});
app.post('/reservation', (request, response) => {
    const {fname,lname,email,tel, date, person}= request.body;
        let errMessage = ''
       let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        

        if(fname == ''){
            errMessage = 'Please Provide your first name!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }else if(fname.length <2 || fname.length >=20){
            errMessage= 'First name must be greater than 2 and less than 20 !'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }
        else if(lname ==''){
            errMessage = 'Please Provide your last name!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }else if(lname.length <2 || lname.length >=20){
            errMessage= 'Last name must be greater than 2 and less than 20 !'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }
        else if(email ==''){
            errMessage = 'Please Provide your email!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }
        
        else if(!email.match(regexEmail)){
            errMessage= 'Please Provide a valid email!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }
        else if(tel ==''){
            errMessage = 'Please Provide your Phone!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }
        else if(isNaN(tel)){
            errMessage = 'Phone must be in number not charecters!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }
        else if(date ==''){
            errMessage = 'Please Provide your Date!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        }
        else if(person ==''){
            errMessage = 'Please Provide your Person number!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        
        }
        else if(isNaN(person)){
            errMessage = 'Person must be in Number!'
            response.render('reservation', {
                titre: 'reservation',
                errmsg: errMessage
            });
        
        }
        
        else{
            return response.status(200).json({
                success:true,
                data: request.body
            })
        }


});

// PAYMENT
app.get('/payment', (request, response) => {
    response.render('payment', {
        titre: 'payment',
        errmsg:''
    });
});

app.post('/payment', (request, response) => {
    const {fname,cardName, email,address,card_number,card_cvc,exp_month,exp_year,amount} = request.body
    let errMessage = ''
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    

     if(fname == ''){
         errMessage = 'Please Provide your name!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }else if(fname.length <2 || fname.length >=20){
         errMessage= 'Name must be greater than 2 and less than 20 !'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(cardName ==''){
         errMessage = 'Please Provide your Card name!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }else if(cardName.length <2 || cardName.length >=20){
         errMessage= 'Name must be greater than 2 and less than 20 !'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(email ==''){
         errMessage = 'Please Provide your email!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     
     else if(!email.match(regexEmail)){
         errMessage= 'Please Provide a valid email!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(address ==''){
         errMessage = 'Please Provide your Address!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(card_number == ''){
         errMessage = 'Please Provide your card!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
    
     else if(isNaN(card_number)){
         errMessage = 'Card must be in number not in charecters!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(card_cvc ==''){
         errMessage = 'Please Provide Card CVC!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(exp_month ==''){
         errMessage = 'Please Provide Expired months!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(exp_month >=13){
         errMessage = 'Months must be in between 1-12'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(exp_year ==''){
         errMessage = 'Please Provide Expired yesrs!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(amount ==''){
         errMessage = 'Please Provide Amount!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     else if(isNaN(amount)){
         errMessage = 'Amount must be in Number!'
         response.render('payment', {
             titre: 'payment',
             errmsg: errMessage
         });
     }
     
     else{
        addTocommande(1)
         return response.status(200).json({
             success:true,
             data: request.body
         })
     }



});


// panier Post
app.post('/panier', (request, response) => {
    const {idUitilisateur,idproduits,quantite} =request.body
    addProduit(idUitilisateur,idproduits,quantite)
    
   return response.status(200).json({
        success: true,
        data: 'successfully added'
    })
});
// panier delete
app.post('/panier-delete', (request, response) => {
    const {product_id} =request.body
    deletePanier(product_id)
    
   return response.status(200).json({
        success: true,
        data: 'successfully added'
    })
});

// panier Update
app.post('/update-cart', (request, response) => {
    const {id, quantite} =request.body
    UpdateCart(id,quantite)
   return response.status(200).json({
        success: true,
        data: 'successfully updated'
    })
});
// Carts
app.get('/carts', async(request, response) => {
    const paniers = await getPanier();
    let connection = await connectionPromise;
 let results = await connection.all(
     'SELECT * FROM produit'
 ); 

let products = []    
     paniers.forEach((pani)=>{
         results.forEach(product=>{
             if(product.id_produit == pani.id_produit){
                 products.push({product:product, quantite:pani.quantite});
             }
         })
     });
    response.render('carts', {
        titre: 'menu',
        carts: products,
    });
});





// Renvoyer une erreur 404 pour les routes non définies
app.use(function(request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + 'not found.');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);
let statuse = document.getElementById('status');
statuse.addEventListener('change',function(e){
    let status_id = e.target.value;
    let commande_id = e.target.getAttribute('data-id');
    fetch('http://localhost:5000/commandes-status', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({status_id,commande_id})
            });
})
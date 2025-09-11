

fetch('https://pokeapi.co/api/v2/pokemon?offset=20&limit=100')
.then(res => {
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return res.json(); // o res.text(), res.blob()
})
.then(data => {
    for (let index = 0; index < 4; index++) {
        const p = document.createElement('p');
        p.textContent = data.results[ Math.floor(Math.random() * data.results.length)].name
        document.getElementById(`pokemon_${index + 1}`).appendChild(p)
    }
    
})
.catch(err => console.error('Error:', err));

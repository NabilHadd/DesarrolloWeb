const visibility = [false, false, false, false]


const contents = document.querySelectorAll(".content");
contents.forEach(content=> {
    content.style.display = 'none'
})



//Reconocimiento de que se le esta haciendo click a cada una de los apartados, servira despues para abrirlos y cerrarlos cuando sea necesario.
const items = document.querySelectorAll('.button');

items.forEach(item => {
    item.addEventListener("click", () => {
        const container = item.parentElement.querySelector(".content");

        if(visibility[Number(item.id)]){
            container.style.display = 'none';
            visibility[Number(item.id)] = false;
        }else{
            container.style.display = 'block'
            visibility[Number(item.id)] = true;
        }
    })
})
//Esta diseñado de esta manera debido a que en el taller dice "Navegar a una vista detallada por cada recurso, mostrando información ampliada al seleccionarlo."
// y "los usuarios puedan explorar los datos sin necesidad de recargar la página."




//Consulta pokemons
fetch('https://pokeapi.co/api/v2/pokemon?offset=20&limit=1000')
.then(res => {
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return res.json(); // o res.text(), res.blob()
})
.then(data => {
    for (let index = 0; index < 4; index++) {
        const num = Math.floor(Math.random() * data.results.length)
        const p = document.createElement('p');
        const pokemon_url = data.results[num].url
        p.textContent = data.results[num].name
        document.getElementById(`pokemon_${index + 1}`).appendChild(p)
        fetch(pokemon_url)
        .then(res => {
            if(!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        }).then(data => {
            const html_img = document.createElement('img');
            html_img.src = data.sprites.front_default;
            document.getElementById(`pokemon_${index + 1}`).appendChild(html_img)
        })
    }
    
})
.catch(err => console.error('Error:', err));
//Fin consulta pokemons.

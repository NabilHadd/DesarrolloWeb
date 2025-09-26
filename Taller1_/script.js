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

//consulta recetas
fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then(res => {
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        const meals = data.meals;
        let nums = []
        for (let index = 0; index<4; index++) {
            const num = Math.floor(Math.random()*meals.length);
            if(nums.includes(num)) {
                index--;
                continue;
            }
            nums.push(num)
            const meal = meals[num];


            const container = document.getElementById(`meal_${index +1}`);
            const mealname = document.createElement('p');
            mealname.textContent = meal.strMeal;
            container.appendChild(mealname);
            const img = document.createElement('img');
            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;

            img.dataset.name = meal.strMeal;
            img.dataset.instructions = meal.strInstructions;

            let ingredients = [];
            for (let i  = 1; i<= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim()!=="") {
                    ingredients.push(`${measure} ${ingredient}`);
                }
            }
            img.dataset.ingredients = JSON.stringify(ingredients);
            img.dataset.img = meal.strMealThumb;
            container.appendChild(img);
        }
    })
    .catch(err=> console.error('Error:' , err));
    //fin consulta recetas


    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIngredients = document.getElementById('modal-ingredients');
    const modalImg = document.getElementById('modal-img');
    const modalSteps = document.getElementById('modal-steps');
    const closeBtn = document.getElementById('close');

    // eventos en el contenedor
    document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.dataset.name) {
            modalTitle.textContent = e.target.dataset.name;
            modalSteps.textContent = e.target.dataset.instructions;
            modalImg.src = e.target.dataset.img;
            modalImg.alt = e.target.dataset.name;

    // parseo de ingredientes 
            const ingredients = JSON.parse(e.target.dataset.ingredients);
            modalIngredients.innerHTML = ingredients.map(i => `<li>${i}</li>`).join("");

            modal.style.display = 'flex';
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });


const economia = document.querySelector('[data-container="economia"]');
const economia_content = economia.querySelector('.grid');
console.log(economia_content)


//Consulta economica
//uf, utm, cobre, dolar, euro, yen, ipc, tasa desempleo, bitcoin.
//para calcular si subio o bajo consulta los datos del dia anterior con el siguiente get
//https://findic.cl/api/{indicador}/{dd-mm-yyyy} donde indicas el indicador y el dia actual -1.
fetch('https://findic.cl/api/')
.then(res => {
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return res.json(); // o res.text(), res.blob()
})
.then(data => {
    const llaves = Object.keys(data);
    const date = data.fecha
    const names = llaves.slice(3, 19); //dejamos solo 16 items para que se ordenen bien en forma de matriz. 4X4 para desktop, 8x2 para tablet y 16x1 para celular.
    
    const items = names.map(n => ({
        codigo: data[n].codigo,
        nombre: data[n].nombre,
        valor: data[n].valor,
        fecha: data[n].fecha
    }));

    items.map(i=> {
        const div = document.createElement('div');
        div.id = i.codigo;
        div.classList.add('rounded', 'lg');
        const pNombre = document.createElement('p');
        pNombre.textContent = i.nombre;
        div.appendChild(pNombre);

    // Crear un <p> para el valor y agregarlo al div
        const pValor = document.createElement('p');
        pValor.textContent = i.valor;
        div.appendChild(pValor);

    // Crear un <p> para la fecha y agregarlo al div
        const pFecha = document.createElement('p');
        pFecha.textContent = i.fecha;
        div.appendChild(pFecha);
        economia_content.appendChild(div);
    });

    console.log(items);
    
})
.catch(err => console.error('Error:', err));
//Fin consulta economica

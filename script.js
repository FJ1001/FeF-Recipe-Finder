const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        const recipesContainer = document.getElementById('recipes-container');
        const favoritesContainer = document.getElementById('favorites-container');

        searchButton.addEventListener('click', searchRecipes);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchRecipes();
            }
        });

        async function searchRecipes() {
            const query = searchInput.value.trim();
            if (!query) return;

            recipesContainer.innerHTML = '<p>Loading...</p>';
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
                const data = await response.json();
                displayRecipes(data.meals);
            } catch (error) {
                recipesContainer.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
            }
        }

        function displayRecipes(recipes) {
            recipesContainer.innerHTML = '';
            if (!recipes) {
                recipesContainer.innerHTML = '<p>No recipes found. Try another search.</p>';
                return;
            }

            recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');
                recipeCard.innerHTML = `
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <h3>${recipe.strMeal}</h3>
                    <div class="recipe-details">
                        <button onclick="viewRecipeDetails('${recipe.idMeal}')">View Details</button>
                        <button onclick="saveToFavorites('${recipe.idMeal}', '${recipe.strMeal}', '${recipe.strMealThumb}')">Save</button>
                    </div>
                `;
                recipesContainer.appendChild(recipeCard);
            });
        }

        async function viewRecipeDetails(id) {
            recipesContainer.innerHTML = '<p>Loading recipe details...</p>';
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            const recipe = data.meals[0];

            const details = `
                <h3>${recipe.strMeal}</h3>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <p><strong>Category:</strong> ${recipe.strCategory}</p>
                <p><strong>Area:</strong> ${recipe.strArea}</p>
                <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
                <a href="${recipe.strSource}" target="_blank">Full Recipe</a>
            `;
            recipesContainer.innerHTML = details;
        }

        function saveToFavorites(id, title, image) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const newFavorite = { id, title, image };

            if (!favorites.some(fav => fav.id === id)) {
                favorites.push(newFavorite);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                displayFavorites();
                alert('Recipe saved to favorites!');
            } else {
                alert('This recipe is already in your favorites.');
            }
        }

        function displayFavorites() {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favoritesContainer.innerHTML = '';

            favorites.forEach(favorite => {
                const favoriteCard = document.createElement('div');
                favoriteCard.classList.add('favorite-card');
                favoriteCard.innerHTML = `
                    <img src="${favorite.image}" alt="${favorite.title}">
                    <h3>${favorite.title}</h3>
                    <div class="actions">
                        <button onclick="viewRecipeDetails('${favorite.id}')">View</button>
                        <button onclick="removeFromFavorites('${favorite.id}')">Remove</button>
                    </div>
                `;
                favoritesContainer.appendChild(favoriteCard);
            });
        }

        function removeFromFavorites(id) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(fav => fav.id !== id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
            alert('Recipe removed from favorites.');
        }

        // Display favorites on page load
        document.addEventListener('DOMContentLoaded', displayFavorites);

const btnContainer = document.getElementById("btn-container");
const cardContainer = document.getElementById("card-container");
const errorElement = document.getElementById("error-element");
const sortBtn = document.getElementById("sort-btn");

const fetchCategories = async () => {
  const res = await fetch(
    ` https://openapi.programming-hero.com/api/videos/categories`
  );

  const data = await res.json();
  const categories = data.data;
  dynamicBtn(categories);
};

const dynamicBtn = (categories) => {
  categories.forEach((card) => {
    const newButton = document.createElement("button");
    newButton.classList = `category-btn btn btn-ghost bg-slate-700 text-white text-lg`;
    newButton.innerText = card.category;
    newButton.addEventListener("click", () => {
      fetchDataByCategories(card.category_id);
      const allBtn = document.querySelectorAll(".category-btn");
      for (const btn of allBtn) {
        console.log("btn click", btn);
        btn.classList.remove("bg-red-600");
      }
      newButton.classList.add("bg-red-600");
    });
    btnContainer.appendChild(newButton);
    // console.log(card);
  });
};

let selectedCategory = 1000;
let sortView = false;

sortBtn.addEventListener("click", () => {
  console.log("sort by view");
  sortView = true;
  fetchDataByCategories(selectedCategory, sortView);
});

const fetchDataByCategories = async (categoryId, sortView) => {
  selectedCategory = categoryId;
  const res = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  );
  const data = await res.json();
  const categoryCard = data.data;

  if (sortView) {
    categoryCard.sort((a, b) => {
      const totalViewsStartFirst = a.others?.views;
      const totalViewsStartSecond = b.others?.views;
      const totalViewsStartFirstNumber =
        parseFloat(totalViewsStartFirst.replace("K", "")) || 0;
      const totalViewsStartSecondNumber =
        parseFloat(totalViewsStartSecond.replace("K", "")) || 0;

      return totalViewsStartSecondNumber - totalViewsStartFirstNumber;
    });
  }

  if (categoryCard.length === 0) {
    errorElement.classList.remove("hidden");
  } else {
    errorElement.classList.add("hidden");
  }

  cardContainer.textContent = "";
  categoryCard.forEach((video) => {
    let timeCount = "";

    if (video.others.posted_date) {
      const millioseconds = video.others.posted_date;
      const seconds = Math.floor(millioseconds / 60);
      const minute = Math.floor(seconds / 60);
      const hour = Math.floor(seconds / 3600);

      timeCount = `${video.others.posted_date[hour]} hrs ${video.others.posted_date[minute]} min ago`;
    }

    let verifiedBadge = "";
    if (video.authors[0].verified) {
      verifiedBadge = `
         <img 
         src="images/verify.png"
         alt="Shoes"
         class="rounded-xl"
         />
        `;
    }
    const newCard = document.createElement("div");
    newCard.classList = `card bg-slate-700 text-white shadow-xl rounded-lg`;
    newCard.innerHTML = `
    
        <figure class="px-10 pt-10">
              <img
                src="${video.thumbnail}"
                alt="Shoes"
                class="rounded-xl"
              />
              </figure>
              ${timeCount}
           
            <div class="flex space-x-4 justify-start items-start pl-10 py-6">
            <div>
              <img
                src="${video.authors[0].profile_picture}"
                alt="Shoes"
                class="w-12 h-12 rounded-full"
              />
            </div>

            <div>
                <h2 class="card-title">${video.title}</h2> 
                <div class="flex gap-3 mt-3">
                    <p>${video.authors[0].profile_name}</p>
                    ${verifiedBadge} 
                </div>
                <p><span>${video.others.views}</span> Views</p>
            </div>
        </div>
    `;
    cardContainer.appendChild(newCard);
  });

  console.log(categoryCard);
};

fetchCategories();
fetchDataByCategories(selectedCategory, sortView);

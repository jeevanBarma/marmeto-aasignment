// Original code with modifications

const search = document.getElementById("SearchBar");
const listBtn = document.getElementById("listViewBtn");
const gridBtn = document.getElementById("gridViewBtn");
const listContainer = document.getElementById("listView");
const gridContainer = document.getElementById("gridView");
const apiUrl = "https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093";

const imgUrl = {
  1: "https://res.cloudinary.com/dafhhfgcj/image/upload/v1704961884/Rectangle_3_qrmyh7.png",
  2: "https://res.cloudinary.com/dafhhfgcj/image/upload/v1704961884/Rectangle_5_tnn2x4.png",
  3: "https://res.cloudinary.com/dafhhfgcj/image/upload/v1704961885/Rectangle_5_1_fzr40z.png",
};

const fetchedData = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && Array.isArray(data.data)) {
      return data;
    } else {
      console.error("Unexpected data structure:", data);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createProductCard = (product, isGrid) => {
  const productCard = document.createElement("div");
  productCard.className = isGrid ? "grid-product-card" : "list-product-card";

  const productImage = document.createElement("img");
  productImage.src = imgUrl[Math.ceil(Math.random() * 3)]; // Images are deleting in the server

  const productTitle = document.createElement("h3");
  productTitle.innerText = product.product_title.toUpperCase();

  const productBadge = document.createElement("span");
  productBadge.className = "badge";
  productBadge.innerText = product.product_badge;

  const productVariants = document.createElement("div");
  productVariants.className = "product-variants";
  product.product_variants.forEach((variant) => {
    const variantItem = document.createElement("h6");
    for (const key in variant) {
      if (variant.hasOwnProperty(key)) {
        variantItem.innerText = `${variant[key]}\n \n`.toUpperCase();
      }
    }
    productVariants.appendChild(variantItem);
  });

  productCard.appendChild(productImage);
  productCard.appendChild(productTitle);
  productCard.appendChild(productBadge);
  productCard.appendChild(productVariants);

  return productCard;
};

const listContainerView = (data) => {
  listContainer.innerHTML = "";
  data.data.forEach((item) => {
    const productCard = createProductCard(item, false);
    listContainer.appendChild(productCard);
  });
};

const gridContainerView = (data) => {
  gridContainer.innerHTML = "";
  data.data.forEach((item) => {
    const productCard = createProductCard(item, true);
    gridContainer.appendChild(productCard);
  });
};

const handleSearch = async () => {
  const data = await fetchedData();
  const searchValue = search.value.trim().toLowerCase();
  listContainer.innerHTML = "";
  gridContainer.innerHTML = "";

  if (Array.isArray(data.data)) {
    data.data.forEach((product) => {
      if (isMatch(product, searchValue)) {
        const productCard = createProductCard(product, false);
        highlightSearchResult(productCard, searchValue);
        listContainer.appendChild(productCard);

        const gridProductCard = createProductCard(product, true);
        highlightSearchResult(gridProductCard, searchValue);
        gridContainer.appendChild(gridProductCard);
      }
    });
  } else {
    console.error("Data is not in the expected format:", data);
  }
};

const isMatch = (product, searchValue) => {
  const propertiesToSearch = [
    product.product_title.toLowerCase(),
    ...product.product_variants.flatMap((variant) =>
      Object.values(variant).map((value) => value.toLowerCase())
    ),
  ];
  return propertiesToSearch.some((property) => property.includes(searchValue));
};

const highlightSearchResult = (productCard, searchValue) => {
  const elementsToHighlight = productCard.querySelectorAll(
    "h3, .product-variants h6"
  );
  elementsToHighlight.forEach((element) => {
    const text = element.innerText;
    const highlightedText = searchValue
      ? text.replace(
          new RegExp(searchValue, "gi"),
          (match) => `<span class="highlight">${match}</span>`
        )
      : text;

    element.innerHTML = highlightedText;
  });
};

const showListView = async () => {
  listContainer.style.display = "block";
  gridContainer.style.display = "none";
};

const showGridView = async () => {
  listContainer.style.display = "none";
  gridContainer.style.display = "block";
};

const displayData = async () => {
  try {
    const data = await fetchedData();
    listContainerView(data);
    gridContainerView(data);
  } catch (error) {
    return error;
  }
};

listBtn.addEventListener("click", showListView);
gridBtn.addEventListener("click", showGridView);
search.addEventListener("input", handleSearch); // Change here

displayData();

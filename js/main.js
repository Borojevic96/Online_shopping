function getProducts(success, failure) {
    const URL = "https://raw.githubusercontent.com/Borojevic96/Online_shopping/master/product.json";
    fetch(URL, {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => response.json())
        .then(showProducts)
        .catch(err => {
            errorMessage(err.message);
        });
}

function errorMessage() {
    window.innerHTML = "Error"
}

function getProductId(id) {
    const URL = "https://raw.githubusercontent.com/Borojevic96/Online_shopping/master/product.json";
    fetch(URL, {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => response.json())
        .then(function (pr) {
            let p = pr.filter(x => {
                if (x.id == id) {
                    return true;
                }
            })
            products = pr;
            showProductId(p[0]);
            buyArticle(p[0]);
        })
        .catch(err => {
            errorMessage(err.message);
        });
}

function showProductId(product) {
    if (product == null || typeof product == undefined) {
        window.location.href = "index.html";
    }

    let titleBar = document.getElementById('title-bar');
    titleBar.textContent = product.title;

    let titleHead = document.getElementById('proizvod');
    titleHead.textContent = product.title;

    let productContent = document.getElementById('text_wrap');
    productContent.innerHTML = "";
    let h1 = document.createElement("h1");
    h1.textContent = product.title;
    productContent.appendChild(h1);

    let p = document.createElement("p");
    p.textContent = product.desc;
    productContent.appendChild(p);

    let pricegty = document.createElement("div");
    pricegty.className = "pricegty";
    productContent.appendChild(pricegty);

    let input = document.createElement("input");
    input.id = 'vrijednost';
    input.type = 'number';
    pricegty.appendChild(input);


    let price = document.createElement('p');
    price.className = 'priceId';
    let cost = new Intl.NumberFormat('en-CA',
        {style: 'currency', currency: 'BAM'}).format(product.price);
    price.textContent = cost;
    pricegty.appendChild(price);

    let button = document.createElement('button');
    button.id = 'dodajUKosaricu';
    button.textContent = 'Dodaj u korpu';
    pricegty.appendChild(button);

    let imgPath = './img/';
    let productImg = document.getElementById("product_image");
    let productGallery = document.getElementById("product_gallery");

    for (const s of product.additional) {
        let imageWrap = document.createElement("div");
        productImg.appendChild(imageWrap);

        let image = document.createElement("img");
        image.src = imgPath + s;
        imageWrap.appendChild(image);

        let imgGallery = document.createElement("div");
        productGallery.appendChild(imgGallery);

        let imageSlider = document.createElement("img");
        imageSlider.src = imgPath + s;
        imgGallery.appendChild(imageSlider);
    }

    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav'
    });
    $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        arrows: false,
        dots: true,
        focusOnSelect: true
    });

    $('a[data-slide]').click(function (e) {
        e.preventDefault();
        var slideno = $(this).data('slide');
        $('.slider-nav').slick('slickGoTo', slideno - 1);
    });

    $('#vrijednost').on('change', function () {
        let value = $(this).val();
        if (value > 0) {
            let price = product.price;
            let sum = value * price;
            $('.priceId').text("BAM " + sum);
        } else {
            alert("Unijeli ste broj manji od nule!");
        }
    })
}

function showCart() {
    cart.init();
    if (cart.items.length == 0) {
        alert("Korpa je prazna");
        setTimeout(function () {
            window.location.href = "index.html";
        }, 500);
        return;
    }
    let productImage = document.getElementById('card-content');
    let imgPath = './img/';
    productImage.innerHTML = "";
    cart.items.forEach(function (item) {
        let wrapp = document.createElement("div");
        wrapp.id = "cart_wrapper";
        productImage.appendChild(wrapp);
        let cardBox1 = document.createElement("div");
        cardBox1.className = "box1";
        wrapp.appendChild(cardBox1);

        let image = document.createElement("img");
        image.className = "item_image";
        image.src = imgPath + item.img;
        image.alt = item.title;
        cardBox1.appendChild(image);

        let title = document.createElement("p");
        title.className = "item_title";
        title.textContent = item.title;
        cardBox1.appendChild(title);

        let qty = document.createElement("input");
        qty.className = "vrijednost";
        qty.id = item.id;
        qty.placeholder = item.qty;
        cardBox1.appendChild(qty);

        let price = document.createElement("p");
        price.className = "price";
        price.id = item.id;
        price.innerText = item.price;
        cardBox1.appendChild(price);

        let cardBox2 = document.createElement("div");
        cardBox2.className = "box2";
        wrapp.appendChild(cardBox2);

        let suma = document.createElement("p");
        suma.className = "priceId";
        suma.id = item.id;
        let sumart = item.qty * item.price;
        suma.textContent = "BAM " + sumart;
        cardBox2.appendChild(suma);

        let button = document.createElement("button");
        button.className = "delete";
        button.id = item.id;
        button.textContent = "X";
        cardBox2.appendChild(button);
    })

    $('.vrijednost').on('change', function () {
        let value = $(this).val();
        let vrijednostId = $(this)[0].id;
        let number = parseInt($(`p#${vrijednostId}.price`).text());
        let sum = value * number;
        if (sum > 0) {
            $(`p#${vrijednostId}.priceId`).text("BAM " + sum);
            cart.changeQty(vrijednostId, value);
        } else {
            alert("Unijeli ste broj manji od nule, molimo Vas unesite validnu količinu artikla!");
        }
    })

    $(".delete").on('click', function () {
        let id = $(this)[0].id;
        cart.remove(id);
        window.location.href = "korpa.html";
    })
}

function showArticle() {
    cart.init();
    let productImage = document.getElementById('card-content');
    let imgPath = './img/';
    productImage.innerHTML = "";
    let total = 0;

    cart.items.forEach(function (item) {
        let cardBox1 = document.createElement("div");
        cardBox1.className = "box1 border";
        productImage.appendChild(cardBox1);

        let image = document.createElement("img");
        image.className = "item_image";
        image.src = imgPath + item.img;
        image.alt = item.title;
        cardBox1.appendChild(image);

        let title = document.createElement("p");
        title.className = "item_title";
        title.textContent = item.title;
        cardBox1.appendChild(title);

        let qty = document.createElement("p");
        qty.id = "vrijednost";
        qty.textContent = item.qty;
        cardBox1.appendChild(qty);

        let price = document.createElement("p");
        price.id = "price";
        let sum = item.price * item.qty;
        total += sum;
        let cost = new Intl.NumberFormat('en-CA',
            {style: 'currency', currency: 'BAM'}).format(sum);
        price.textContent = cost;
        cardBox1.appendChild(price);
    })

    let totalPrice = document.getElementById("ukupno");
    totalPrice.textContent = "BAM " + total;
}

function buyArticles() {
    $("#zakljuci").prop('disabled', true);
    alert("Narudžba poslana");
    cart.empty();
    setTimeout(function () {
        window.location.href = "index.html";
    }, 2000);
}

function showProducts(products) {
    //take data.products and display inside <section id="products">
    let imgPath = './img/';
    let productSection = document.getElementById('products');
    productSection.innerHTML = "";
    products.forEach(product => {
        let card = document.createElement('a');
        card.className = 'article-content';
        card.id = product.id;
        card.href = "page.html?id=" + `${product.id}`;

        //add the image to the card
        let img_div = document.createElement('div');
        img_div.className = 'article-img';
        card.appendChild(img_div);
        let img = document.createElement('img');
        img.alt = product.title;
        img.src = imgPath + product.img;
        img_div.appendChild(img);

        //add the price
        let content_div = document.createElement('div');
        content_div.className = 'article-info';
        card.appendChild(content_div);

        //add the title to the card
        let title = document.createElement('p');
        title.textContent = product.title;
        content_div.appendChild(title);

        let price = document.createElement('p');
        let cost = new Intl.NumberFormat('en-CA',
            {style: 'currency', currency: 'CAD'}).format(product.price);
        price.textContent = cost;
        price.className = 'price';
        content_div.appendChild(price);

        //add the card to the section
        productSection.appendChild(card);
    })
}

function buyArticle(buy) {
    cart.init();
    $("#dodajUKosaricu").click(function () {
        let kolicina = $("#vrijednost").val();
        cart.add(buy.id, kolicina);
        window.location.href = "korpa.html";
    });
}

const cart = {
    key: '11c737a8-3c20-4b00-81fa-09fb04fa3164',
    items: [],
    init() {
        let selectedItems = localStorage.getItem(cart.key);
        if (selectedItems) {
            cart.items = JSON.parse(selectedItems);
        }
    },
    async sync() {
        let tempCart = JSON.stringify(cart.items);
        await localStorage.setItem(cart.key, tempCart);
    },
    find(id) {
        let result = cart.items.filter(item => {
            if (item.id == id) {
                return true;
            }
        });
        if (result && result[0])
            return result[0];
    },
    add(id, increase = 1) {
        if (cart.find(id)) {
            cart.increaseQty(id, increase);
        } else {
            let temp = products.filter(product => {
                if (product.id == id) {
                    return true;
                }
            });
            if (temp) {
                let itemToAdd = {
                    id: temp[0].id,
                    title: temp[0].title,
                    qty: increase,
                    images: temp[0].additional,
                    price: temp[0].price,
                    img: temp[0].img
                }
                cart.items.push(itemToAdd);
                cart.sync();
            } else {
                console.error(`Adding product with id=${id} went wrong, try again!`);
            }
        }
    },
    remove(id) {
        cart.items = cart.items.filter(item => {
            if (item.id != id)
                return true;
        });
        cart.sync();
    },
    increaseQty(id, qty = 1) {
        cart.items = cart.items.map(item => {
            if (item.id === id)
                item.qty = parseInt(item.qty) + parseInt(qty);
            return item;
        });
        cart.sync();
    },
    changeQty(id, qty = 1) {
        cart.items = cart.items.map(item => {
            if (item.id == id) {
                if (item.qty <= 0) {
                    alert("Broj je ispod  nule!");
                } else {
                    item.qty = parseInt(qty);
                }
            }
            return item;
        });
        cart.sync();
    },
    empty() {
        cart.items = [];
        cart.sync();
    },
}


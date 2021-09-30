// Contentful Port
const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "egg06jh7fcs0",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "5MdTI7tH4fkle1CzZcgwfj8J7hUvl0BCGQ4cXCEZIXE"
  });


// Variables Initialization
const navBtn = document.querySelector('.open-nav') 
const closeNavBtn = document.querySelector('.close-nav')
const navDOM = document.querySelector('.nav-sidebar')
const navOverlay = document.querySelector('.nav-overlay')
const cartBtn = document.querySelector('.open-cart')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.products-center')
// Test
const myslide = document.querySelectorAll('.myslide')
const dot = document.querySelectorAll('.dot');
const prevButton = document.querySelector('.prev')
const nextButton = document.querySelector('.next')
// Cart
let cart = []
// Buttons
let buttonsDOM = []
let counter = 1


// Fetching products locally
class Products {
    async getProducts(){
        try {

            let contentful = await client.getEntries({
                content_type: 'knifeCompanyProducts'
            })
            console.log(contentful)

            let result = await fetch('products.json')
            let data = await result.json()

            let products = contentful.items  
            products = products.map(item=>{
                const {title, price, brand, bestseller} = item.fields
                const {id} = item.sys
                const image = item.fields.image.fields.file.url
                return {id, image, price,title, brand, bestseller} 
            })
            return products
        } catch (error){
            console.log(error)
        }
    }
}

// Display products
class UI {
    displayProducts(products){
        let result = ''
        products.forEach(product => {
            if (product.bestseller == true){
                result +=`
                <!-- Single Product -->
                <article class="product">
                    <div class="img-container">
                        <img 
                            src=${product.image} 
                            alt="product" 
                            class="product-img"
                        />
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart"></i>
                            Add To Cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>RM ${product.price}</h4>
                </article>
                <!-- End of Single Product -->
                `
            }
        })
        productsDOM.innerHTML = result

    }

    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')]
        buttonsDOM = buttons
        buttons.forEach(button => {
            let id = button.dataset.id 
            let inCart = cart.find(item =>item.id === id)
            if(inCart){
                button.innerText = "In Cart"
                button.disabled = true
            } else
            button.addEventListener('click', (event)=>{
                event.target.innerText = "In Cart"
                event.target.disabled = true
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount:1}
                // add product to the cart
                cart = [...cart, cartItem]
                // save cart in local storage
                Storage.saveCart(cart)
                // set cart values
                this.setCartValues(cart)
                // display cart item
                this.addCartItem(cartItem)
                // show the cart
                this.showCart()
            })
        })
    }
    setCartValues(cart){
        let tempTotal = 0
        let itemsTotal = 0
        cart.map(item=>{
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal
    }

    addCartItem(item){
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `
            <img 
                src=${item.image} 
                alt="product"
            />
            <div>
                <h4>${item.title}</h4>
                <h5>RM ${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `
        cartContent.appendChild(div)
    }

    
    showCart(){
        cartOverlay.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }
    setupApp(){
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populate(cart)
        this.slideFunc(counter)
        cartBtn.addEventListener('click', this.showCart)
        closeCartBtn.addEventListener('click', this.hideCart)
        navBtn.addEventListener('click', this.openNav)
        closeNavBtn.addEventListener('click', this.closeNav)
        prevButton.addEventListener('click', this.minusSlides)
        nextButton.addEventListener('click', this.plusSlides)
    }

    // Test carousel image slider JS
    setupSlider(){
        // let counter = 1;
        this.slideFunction(counter)
    }

    plusSlides(n) {
        let i
        for(i = 0;i<myslide.length;i++){
        	myslide[i].style.display = "none";
        }

        if (counter <5){
            counter +=1
            myslide[counter - 1].style.display = "block";
            dot[counter - 1].className += " active";
            dot[counter - 2].className = dot[counter -2].className.replace(' active', '');

        } else {
            for(i = 0;i<dot.length;i++) {
                dot[i].className = dot[i].className.replace(' active', '');
            }            
            counter = 1
            myslide[counter - 1].style.display = "block";
            dot[counter - 1].className += " active";


        }

    }
    minusSlides() {
        let i
        for(i = 0;i<myslide.length;i++){
            myslide[i].style.display = "none";
        }
        if (counter >1){
            counter -=1
            myslide[counter - 1].style.display = "block";
            dot[counter - 1].className += " active";
            dot[counter].className = dot[counter].className.replace(' active', '');
        } else {
            for(i = 0;i<dot.length;i++) {
                dot[i].className = dot[i].className.replace(' active', '');
            }    
            counter = 5
            myslide[counter - 1].style.display = "block";
            dot[counter - 1].className += " active";
        }
 
    }

    slideFunc() {
        let i;
        for(i = 0;i<myslide.length;i++){
        	myslide[i].style.display = "none";
        }

        for(i = 0;i<dot.length;i++) {
            dot[i].className = dot[i].className.replace(' active', '');
        }
       
        myslide[0].style.display = "block";
        dot[0].className += " active";
    }

    // End of Test carousel image slider JS

    populate(cart){
        cart.forEach(item => this.addCartItem(item))

    }

    hideCart(){
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
    }

    openNav(){
        navOverlay.classList.add('transparentBcg-nav')
        navDOM.classList.add('show-sidebar')
    }

    closeNav(){
        navOverlay.classList.remove('transparentBcg-nav')
        navDOM.classList.remove('show-sidebar')
    }

    cartLogic(){
        clearCartBtn.addEventListener('click', ()=>{
            this.clearCart()
        })
        cartContent.addEventListener('click', event=>{
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target
                let id = removeItem.dataset.id
                cartContent.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id)
            } else if (event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target
                let id = addAmount.dataset.id
                let tempItem = cart.find(item => item.id == id)
                tempItem.amount = tempItem.amount + 1
                Storage.saveCart(cart)
                this.setCartValues(cart)
                addAmount.nextElementSibling.innerText = tempItem.amount

            } else if (event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target
                let id = lowerAmount.dataset.id
                let tempItem = cart.find(item => item.id == id)
                tempItem.amount = tempItem.amount - 1 
                if (tempItem.amount > 0){
                    Storage.saveCart(cart)
                    this.setCartValues(cart)
                    lowerAmount.previousElementSibling.innerText = tempItem.amount
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeItem(id)
                }
            }
        })
    }

    clearCart(){
        // Clear cart button 
        let cartItems = cart.map(item => item.id)
        cartItems.forEach(id => this.removeItem(id))
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart()
    }

    removeItem(id){
        cart = cart.filter(item => item.id !== id)
        this.setCartValues(cart)
        Storage.saveCart(cart)
        let button = this.getSingleButton(id)
        button.disabled = false
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
    }

    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id)
    }


}

// Local Storage
class Storage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products))
    }
    
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'))
        return products.find(product => product.id === id)
    }

    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    static getCart(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [] 
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI()
    const products = new Products()
    // Setup Application
    ui.setupApp()

    // Fetch all products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(()=>{
        ui.getBagButtons()
        ui.cartLogic()
    })
})


// Test
// const myslide = document.querySelectorAll('.myslide'),
// 	  dot = document.querySelectorAll('.dot');
// let counter = 1;
// slidefun(counter);

// let timer = setInterval(autoSlide, 8000);
// function autoSlide() {
// 	counter += 1;
// 	slidefun(counter);
// }
// function plusSlides(n) {
// 	counter += n;
// 	slidefun(counter);
// 	// resetTimer();
// }
// function currentSlide(n) {
// 	counter = n;
// 	slidefun(counter);
// 	// resetTimer();
// }
// function resetTimer() {
// 	clearInterval(timer);
// 	timer = setInterval(autoSlide, 8000);
// }

// function slidefun(n) {
	
// 	let i;
//     console.log(myslide.length)
// 	// for(i = 0;i<myslide.length;i++){
// 	// 	myslide[i].style.display = "none";
// 	// }
//     myslide[0].style.display = "none";
//     myslide[1].style.display = "none";
//     myslide[2].style.display = "none";
//     myslide[3].style.display = "none";
//     myslide[4].style.display = "none";

// 	for(i = 0;i<dot.length;i++) {
// 		dot[i].className = dot[i].className.replace(' active', '');
// 	}
// 	if(n > myslide.length){
// 	   counter = 1;
// 	   }
// 	if(n < 1){
// 	   counter = myslide.length;
// 	   }
// 	myslide[counter - 1].style.display = "block";
// 	dot[counter - 1].className += " active";
// }
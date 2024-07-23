document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', () => ({
        title: 'Perfect Pizza API',
        pizzas: [],
        cart: [],
        cartTotal: 0.00,
        showCheckout: false,
        cartId: 'Q85vQwtboE',
        username: 'oksiya',
        paymentAmount: 0,
        checkoutMessage: '',
        getCart(){
             const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
             return axios.get(getCartURL);
        },

        init() {
            const url = 'https://pizza-api.projectcodex.net/api/pizzas';
            axios
                .get(url)
                .then(result => {
                    this.pizzas = result.data.pizzas;
                })
        },
        showCartData(){
            this.getCart().then(result => {
                const cartData = result.data;
                this.cart = cartData.pizzas;
                this.cartTotal = cartData.total.toFixed(2);
                //alert(this.cartTotal)
            })
        },
        addPizza(pizzaId){
            return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/add`, {
                "cart_code" : this.cartId,
                "pizza_id" : pizzaId
            })
        },
        removePizza(pizzaId){
            return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/remove`, {
                "cart_code" : this.cartId,
                "pizza_id" : pizzaId
            })
        },

        addToCart(pizzaId) {
            this.addPizza(pizzaId)
                .then(() => {
                    this.showCartData();
                })
            
        },

        removeFromCart(pizzaId) {
            this.removePizza(pizzaId)
                .then(() => {
                    this.showCartData();
                })
            
        },

        checkout() {
            this.showCheckout = true;
        },

        confirmPayment() {
            const totalCost = this.cart.reduce((total, item) => total + item.totalPrice, 0);
            if (this.paymentAmount >= totalCost) {
                this.checkoutMessage = 'Enjoy your pizzas!';
                this.cart = [];
                this.showCheckout = false;
            } else {
                this.checkoutMessage = 'Sorry - that is not enough money!';
            }
            setTimeout(() => {
                this.checkoutMessage = '';
            }, 3000);
        },

        get totalCost() {
            return this.cart.reduce((total, item) => total + item.totalPrice, 0);
        }
    }));
});

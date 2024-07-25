document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', () => ({
        title: 'Perfect Pizza API',
        pizzas: [],
        cart: [],
        cartTotal: 0.00,
        showCheckout: false,
        showLogin: true, // Show the login modal initially
        cartId: '',
        username: '',
        paymentAmount: 0.00,
        checkoutMessage: '',
        isLoggedIn: false,
        loginMessage: '',
        
        createCart() {
            const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`;
            return axios.get(createCartURL).then(result => {
                this.cartId = result.data.cart_code;
            });
        },
        getCart() {
            const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
            return axios.get(getCartURL);
        },
        init() {
            const url = 'https://pizza-api.projectcodex.net/api/pizzas';
            axios.get(url).then(result => {
                this.pizzas = result.data.pizzas;
            });

            if (this.isLoggedIn && !this.cartId) {
                this.createCart().then(() => {
                    this.showCartData();
                });
            }
        },
        showCartData() {
            this.getCart().then(result => {
                const cartData = result.data;
                this.cart = cartData.pizzas;
                this.cartTotal = cartData.total.toFixed(2);
            });
        },
        addPizza(pizzaId) {
            return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/add`, {
                "cart_code": this.cartId,
                "pizza_id": pizzaId
            });
        },
        removePizza(pizzaId) {
            return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/remove`, {
                "cart_code": this.cartId,
                "pizza_id": pizzaId
            });
        },
        addToCart(pizzaId) {
            this.addPizza(pizzaId).then(() => {
                this.showCartData();
            });
        },
        removeFromCart(pizzaId) {
            this.removePizza(pizzaId).then(() => {
                this.showCartData();
            });
        },
        pay(amount) {
            return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/pay`, {
                "cart_code": this.cartId,
                "amount": amount
            });
        },
        checkout() {
            this.showCheckout = true;
        },
        confirmPayment() {
            this.pay(this.paymentAmount).then(result => {
                if (result.data.status == 'failure') {
                    this.checkoutMessage = result.data.message;
                    setTimeout(() => {
                        this.checkoutMessage = '';
                    }, 3000);
                } else {
                    this.checkoutMessage = result.data.message;
                    setTimeout(() => {
                        this.checkoutMessage = '';
                        this.cart = [];
                        this.cartTotal = 0.00;
                        this.cartId = '';
                        this.paymentAmount = 0.00;
                        this.createCart();
                        this.showCheckout = false;
                    }, 3000);
                }
            });
        },
        login() {
            if (this.username.trim() === '') {
                this.loginMessage = 'Please enter a username.';
                return;
            }
            this.isLoggedIn = true;
            this.loginMessage = '';
            this.showLogin = false;
            this.createCart().then(() => {
                this.showCartData();
            });
        },
        openLoginModal() {
            this.showLogin = true;
        },
        closeLoginModal() {
            this.showLogin = false;
        }
    }));
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
            default: false,
        },
        cart: {
            type: Array,
            required: true,
        },
        productData: {
            type: Object,
            required: true,
        },
        almostSoldOutQuantity: {
            type: Number,
            required: true,
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" />
            </div>
            <div class="product-info">
                <!-- Simple binding that can be later changed by app.product = something -->
                <h1>{{title}}</h1>
                
                <!-- IF LSE-->
                <!-- i can use array for more than one style/class -->
                <div class="description" :style="[quantity <= almostSoldOutQuantity ? {'color': 'red' } : {}]">
                    <p v-if="quantity > almostSoldOutQuantity">In Stock</p>
                    <p v-else-if="quantity > 0">Almost sold out, there are only {{quantity}} left</p>
                    <p v-else>Out of Stock</p>
                    <p>Shipping: {{shipping}}</p>
                </div>

                <!-- Simple for-->
                <div v-show="detailsVisible">
                    <ul>
                        <li v-for="detail in productData.details">
                            {{detail}}
                        </li>
                    </ul>
                </div>

                <h4>Colors</h4>

                <!-- Style binding, for, key, event handler binding, using method from new Vue({config})-->
                <div 
                    v-for="(variant, index) in productData.variants" 
                    :key="variant.id"
                    class="color-box"
                    :style="{backgroundColor: variant.color, 'font-size': '1.1em'}"
                    @mouseover="colorHover(index)"
                >
                    
                </div>

                <!-- Disabling button based on config data object -->
                <button 
                    v-on:click="addToCart" 
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                <button 
                    v-on:click="removeFromCart" 
                    :disabled="cart === 0"
                    :class="[{ disabledButton: cart === 0 }, { 'remove-button': cart > 0 }]"
                >
                    Remove
                </button>
            </div>
        </div>
    `,
    data() {
        return {
            brand: 'LUKHOL',
            selectedVariant: 0,
            detailsVisible: true, // More performant - just hidden
            removeFromCartStyle: {
                'background-color': 'red'
            }
        };
    },
    methods: {
        addToCart() {
            const typeId = this.productData.variants[this.selectedVariant].id;
            this.$emit('add-to-cart', this.productData.id, typeId);
        },
        removeFromCart() {
            const typeId = this.productData.variants[this.selectedVariant].id;
            this.$emit('remove-from-cart', this.productData.id, typeId);
        },
        colorHover(index) {
            this.selectedVariant = index;
        }
    },
    // Computed properties are cached until any of dependencies changed.
    computed: {
        title() {
            // Can be updated in real time
            setTimeout(() => { this.brand = 'KŁODA'}, 0);
            return `${this.brand} ${this.productData.name}`;
        },
        image() {
            return this.productData.variants[this.selectedVariant].image;
        },
        inStock() {
            return this.productData.variants[this.selectedVariant].quantity > 0;
        },
        quantity() {
            console.log('quantity', this.productData);
            return this.productData.variants[this.selectedVariant].quantity;
        },
        shipping() {
            if(this.premium) {
                return "Free"
            } else {
                return "100$";
            }
        }
    },
});

const app = new Vue({
    el: '#app',
    data: {
        ALMOST_SOLD_OUT_QUANTITY: 2,
        premium: true,
        cart: [],
        products: [{ 
            id: 1,
            name: 'Socks', 
            details: ["80% cotton", "20% cotton", "BEST!"],
            variants: [
                {id: 1, color: "green", image: 'https://image.flaticon.com/icons/svg/358/358441.svg', quantity: 21, },
                {id: 2, color: "blue", image: 'https://image.flaticon.com/icons/svg/2719/2719885.svg', quantity: 12, },
            ],
        }],
    },
    methods: {
        addToCart(productId, typeId) {
            for(const product of this.products) {
                if(product.id === productId) {
                    for(const variant of product.variants) {
                        if(variant.id === typeId) {
                            variant.quantity -= 1;
                            
                            const itemInCart = this.cart.find(item => item.id === productId && item.typeId === typeId);
                            if(itemInCart) {
                                itemInCart.quantity += 1;
                            } else {
                                this.cart.push({
                                    id: product.id,
                                    typeId: variant.id,
                                    name: product.name,
                                    quantity: 1,
                                });
                            }
                            break;
                        }
                    }

                    break;
                }
            }
        },
        removeFromCart(productId, typeId) {
            console.log(productId, typeId);
            const cartItem = this.cart.find(item => item.id === productId && item.typeId === typeId);
            if(cartItem && cartItem.quantity > 1) {
                cartItem.quantity -=1 ;
            } else {
                this.cart = this.cart.filter(item => item.id !== productId && item.typeId !== typeId);
            }
        }
    }
});
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
        productDataOriginal: {
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
                    <p v-if="quantity > almostSoldOutQuantity">In Stock ({{quantity}})</p>
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
                    :disabled="!canRemove"
                    :class="[{ disabledButton: !canRemove }, { 'remove-button': canRemove }]"
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
        },
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
            return this.productData.variants[this.selectedVariant].quantity;
        },
        canRemove() {
            const originalQuantity = this.productDataOriginal.variants[this.selectedVariant].quantity;
            const currentQuantity = this.productData.variants[this.selectedVariant].quantity;
            return originalQuantity > currentQuantity;
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

function canAdd(product, productTypeId) {
    if(!product || !product.variants){ 
        return false;
    }

    const variant = product.variants.find(type => type.id === productTypeId);
    return variant && variant.quantity > 0;
}

function canRemove(product, productTypeId) {
    if(!product || !product.variants){ 
        return false;
    }

    const variant = product.variants.find(type => type.id === productTypeId);
    return variant && variant.quantity > 0;
}

function computeCart(products, currentProducts) {
    const cart = [];

    for(let i = 0; i < products.length; i++) {
        const prod = products[i];
        const currProd = currentProducts[i];

        for(let j = 0; j < prod.variants.length; j++) {
            const variant = prod.variants[j];
            const currVariant = currProd.variants[j];

            if(variant.quantity !== currVariant.quantity) {
                cart.push({
                    name: `${prod.name} (${variant.color})`,
                    productId: prod.id,
                    typeId: variant.id,
                    quantity: variant.quantity - currVariant.quantity,
                });
            }
        }
        
    }

    return cart;
}


const products = [{ 
    id: 1,
    name: 'Socks', 
    details: ["80% cotton", "20% cotton", "BEST!"],
    variants: [
        { id: 1, color: "green", image: 'https://image.flaticon.com/icons/svg/358/358441.svg', quantity: 21, price: 22.99 },
        { id: 2, color: "blue", image: 'https://image.flaticon.com/icons/svg/2719/2719885.svg', quantity: 12, price: 24.99 },
    ],
}];

const app = new Vue({
    el: '#app',
    data: {
        ALMOST_SOLD_OUT_QUANTITY: 2,
        premium: true,
        // Should be copied for eq. using lodash or immutable js but this is simple and fast to write.
        products: JSON.parse(JSON.stringify(products)),
        currentProducts: JSON.parse(JSON.stringify(products)),
    },
    methods: {
        addToCart(productId, typeId) {
            const productsCopy = JSON.parse(JSON.stringify(this.currentProducts));
            const product = productsCopy.find(p => p.id === productId);

            if(canAdd(product, typeId)) {
                for(const variant of product.variants) {
                    if(variant.id === typeId) {
                        variant.quantity -= 1;
                        this.currentProducts = productsCopy;
                        break;
                    }
                }
            }
        },
        removeFromCart(productId, typeId) {
            const productsCopy = JSON.parse(JSON.stringify(this.currentProducts));
            const product = productsCopy.find(p => p.id === productId);

            if(!product) {
                console.log('Cannot remove product ', productId);
                return;
            }

            for(const variant of product.variants) {
                if(variant.id === typeId) {
                    variant.quantity += 1;
                    this.currentProducts = productsCopy;
                    break;
                }
            }
        },
        decreaseCartItem(cartItem) {
            this.removeFromCart(cartItem.productId, cartItem.typeId);
        },
        increaseCartItem(cartItem) {
            this.addToCart(cartItem.productId, cartItem.typeId);
        }
    },
    computed: {
        cart() {
            return computeCart(this.products, this.currentProducts);
        },
    }
});
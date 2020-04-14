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
                <br />
                <product-comment-form @comment-added="commentAdded"></product-comment-form>
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
        commentAdded(commentForm) {
            this.$emit('comment-added', commentForm);
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
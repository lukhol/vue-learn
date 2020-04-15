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
        <div class="product container">
            <!-- Simple binding that can be later changed by app.product = something -->
            <div class="row">
                <div class="col-6">
                    <div class="row both-center">
                        <div class="product-image">
                            <img :src="image" class="image-responsive" />
                        </div>
                    </div>
                    <div class="row both-center">
                        <div 
                            v-for="(variant, index) in productData.variants" 
                            :key="variant.id"
                            class="color-box"
                            :style="{backgroundColor: variant.color, 'font-size': '1.1em'}"
                            @mouseover="colorHover(index)"
                        ></div>
                    </div>
                </div>
                <div class="product-info col-6">  
                    <h1 class="title">{{title}}</h1>  
                    <div class="">
                        <!-- IF LSE-->
                        <!-- i can use array for more than one style/class -->
                        <div class="product-description" :style="[quantity <= almostSoldOutQuantity ? {'color': 'red' } : {}]">
                            <p v-if="quantity > almostSoldOutQuantity">In Stock ({{quantity}})</p>
                            <p v-else-if="quantity > 0">Almost sold out, there are only {{quantity}} left</p>
                            <p v-else>Out of Stock</p>
                            <p>Shipping: {{shipping}}</p>
                        </div>

                        <div class="product-price">
                            {{variantPrice}} $
                        </div>

                        <!-- Simple for-->
                        <div v-show="detailsVisible" class="product-details">
                            <ul>
                                <li v-for="detail in productData.details">
                                    {{detail}}
                                </li>
                            </ul>
                        </div>
                        
                        <hr />

                        <!-- Disabling button based on config data object -->
                        <div class="product-buttons">
                            <button 
                                v-on:click="addToCart" 
                                :disabled="!inStock"
                                :class="{ disabledButton: !inStock }"
                                class="button button-success"
                            >
                                Add to cart
                            </button>
                            <button 
                                v-on:click="removeFromCart" 
                                :disabled="!canRemove"
                                :class="[{ disabledButton: !canRemove }, { 'button-danger': canRemove }]"
                                class="button"
                            >
                                Remove
                            </button>
                        </div>
                        
                        <!--
                            <product-comment-form @comment-added="commentAdded"></product-comment-form>
                        -->
                    </div>
                </div>
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
        variantPrice() {
            return this.productData.variants[this.selectedVariant].price;
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
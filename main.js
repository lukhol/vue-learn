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
        comments: [], // { id, productId, comment, author } ?
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
        },
        findComment(productId) {
            return this.comments.find(comment => comment.productId === productId);
        },
        commentAdded(commentForm) {
            console.log(this.comments);
            this.comments = [
                ...this.comments,
                { id: 123, ...commentForm, productId: 1}
            ];
            console.log(this.comments);
        }
    },
    computed: {
        cart() {
            return computeCart(this.products, this.currentProducts);
        },
    }
});
Vue.component('product-comment', {
    props: {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
    },
    template: `
        <div>
            {{text}}
            <strong>{{author}}</strong>
        </div>
    `,
});

Vue.component('product-comment-form', {

    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <label for="comment">Comment</label>
            <input v-model="comment" id="comment">

            <label for="author">Author</label>
            <input v-model="author" id="author">

            <button>Submit</button>
        </form>
    `,
    data() {
        return {
            comment: null,
            author: null,
        }
    },
    methods: {
        onSubmit() {
            this.$emit('comment-added', {
                comment: this.comment,
                author: this.author,
            });

            this.comment = null;
            this.author = null;
        }
    }
});
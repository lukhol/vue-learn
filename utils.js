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
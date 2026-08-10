// ======================
// ALIGN STUDIO
// SHOPPING CART
// ======================

let cart = [];

const cartItems = document.getElementById("cart-items");

const bagTotal = document.getElementById("bag-total");

const cartCount = document.getElementById("cart-count");

const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(button => {

    button.addEventListener("click", function(){

        const card = this.parentElement;

        const name = card.dataset.name;

        const price = Number(card.dataset.price);

        addProduct(name, price);

    });

});

function addProduct(name, price) {

    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    displayCart();

}

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        cartItems.innerHTML += `

        <tr>

            <td>${item.name}</td>

            <td>₹${item.price}</td>

            <td>

    <button onclick="decreaseQuantity(${index})">−</button>

    <span style="margin:0 10px;">${item.quantity}</span>

    <button onclick="increaseQuantity(${index})">+</button>

</td>

            <td>₹${itemTotal}</td>

            <td>

                <button onclick="removeProduct(${index})">

                    Remove

                </button>

            </td>

        </tr>

        `;

    });

    bagTotal.textContent = total;

    cartCount.textContent = cart.length;

}

function removeProduct(index) {

    cart.splice(index, 1);

    displayCart();

}
function increaseQuantity(index){

    cart[index].quantity++;

    displayCart();

}
function decreaseQuantity(index){

    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }else{

        cart.splice(index,1);

    }

    displayCart();

}
document
    .getElementById("generate-btn")
    .addEventListener("click", generateInvoice);

function generateInvoice(){

    if(cart.length===0){

        alert("Please add products to your bag.");

        return;

    }

    const customerName =
        document.getElementById("customerName").value;

    const mobile =
        document.getElementById("mobile").value;

    if(customerName==="" || mobile===""){
        alert("Please fill customer details.");

        return;

    }
        const member =
document.querySelector(
'input[name="membership"]:checked'
).value;

const payment =
document.querySelector(
'input[name="payment"]:checked'
).value;

const packaging =
Number(
document.getElementById("packaging").value
);
let subtotal = 0;

cart.forEach(item=>{

subtotal += item.price * item.quantity;

});

let discount = 0;

if(member==="Member"){

discount = subtotal * 0.10;

}

const taxableAmount =
subtotal - discount;

const gst =
taxableAmount * 0.18;

const grandTotal =
taxableAmount + gst + packaging;

const invoiceNo =
"AS"+
Math.floor(
100000+
Math.random()*900000
);

const today =
new Date().toLocaleDateString();
let productRows = "";

cart.forEach(item => {

    productRows += `

    <tr>

        <td>${item.name}</td>

        <td>${item.quantity}</td>

        <td>₹${item.price}</td>

        <td>₹${item.price * item.quantity}</td>

    </tr>

    `;

});

document.getElementById("invoice").innerHTML = `

<h2>ALIGN STUDIO</h2>

<p><strong>Move with Intention.</strong></p>

<hr>

<p><strong>Invoice No:</strong> ${invoiceNo}</p>

<p><strong>Date:</strong> ${today}</p>

<p><strong>Customer:</strong> ${customerName}</p>

<p><strong>Mobile:</strong> ${mobile}</p>

<br>

<table class="invoice-table">

<tr>

<th>Product</th>

<th>Qty</th>

<th>Rate</th>

<th>Total</th>

</tr>

${productRows}

</table>

<br>

<p><strong>Subtotal :</strong> ₹${subtotal.toFixed(2)}</p>

<p><strong>Membership :</strong> ${member}</p>

<p><strong>Discount :</strong> ₹${discount.toFixed(2)}</p>

<p><strong>GST (18%) :</strong> ₹${gst.toFixed(2)}</p>

<p><strong>Signature Packaging :</strong> ₹${packaging}</p>

<p><strong>Payment Mode :</strong> ${payment}</p>

<hr>

<h2 style="color:#556B5D;">

Grand Total : ₹${grandTotal.toFixed(2)}

</h2>

`;
}
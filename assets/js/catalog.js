/**
 * FZM Renovations - Private Catalog Logic
 * Fetches product data from Google Sheets CSV and generates PDF quotes.
 */

// PLACEHOLDER - User must replace this with their published Google Sheet CSV link
const GOOGLE_SHEET_CSV_URL = "PASTE_YOUR_LINK_HERE";

// Mock data for demonstration if URL is not set
const MOCK_DATA = [
    { name: "Premium Hardwood Flooring", category: "Flooring", price: "12.50", description: "Oak finish, per sq ft", image: "https://placehold.co/300x200?text=Flooring" },
    { name: "Quartz Countertop", category: "Kitchen", price: "85.00", description: "Pure white, per sq ft", image: "https://placehold.co/300x200?text=Countertop" },
    { name: "Pot Light Installation", category: "Electrical", price: "150.00", description: "Per unit, includes wiring", image: "https://placehold.co/300x200?text=Light" },
    { name: "Bathroom Vanity", category: "Bathroom", price: "1200.00", description: "60 inch double sink", image: "https://placehold.co/300x200?text=Vanity" }
];

let cart = [];
let products = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    document.getElementById('generate-pdf').addEventListener('click', generatePDF);
});

async function loadProducts() {
    const container = document.getElementById('product-grid');
    container.innerHTML = '<p>Loading products...</p>';

    try {
        if (GOOGLE_SHEET_CSV_URL === "PASTE_YOUR_LINK_HERE") {
            console.warn("Using mock data. Please update GOOGLE_SHEET_CSV_URL.");
            products = MOCK_DATA;
        } else {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            const text = await response.text();
            products = parseCSV(text);
        }

        renderProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
        container.innerHTML = '<p>Error loading products. Please check the CSV URL.</p>';
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentline = lines[i].split(',');
        const obj = {};
        // Simple mapping assuming order: Name, Category, ImageURL, Price, Description
        // Adjust indices based on actual CSV structure
        if (currentline.length >= 5) {
            obj.name = currentline[0].trim();
            obj.category = currentline[1].trim();
            obj.image = currentline[2].trim();
            obj.price = currentline[3].trim();
            obj.description = currentline[4].trim();
            result.push(obj);
        }
    }
    return result;
}

function renderProducts(items) {
    const container = document.getElementById('product-grid');
    container.innerHTML = '';

    items.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p class="text-gold">${product.category}</p>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="btn" onclick="addToCart(${index})">Add to Quote</button>
        `;
        container.appendChild(card);
    });
}

window.addToCart = function (index) {
    const product = products[index];
    cart.push(product);
    updateCartUI();
};

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartUI();
};

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartWidget = document.querySelector('.cart-widget');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        li.style.borderBottom = '1px solid #eee';
        li.style.paddingBottom = '5px';
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <span>${item.name}</span>
                <span>$${item.price}</span>
            </div>
            <small style="color:red; cursor:pointer;" onclick="removeFromCart(${index})">Remove</small>
        `;
        cartItems.appendChild(li);
        total += parseFloat(item.price.replace(/[^0-9.]/g, ''));
    });

    cartTotal.textContent = total.toFixed(2);

    if (cart.length > 0) {
        cartWidget.classList.add('active');
    } else {
        cartWidget.classList.remove('active');
    }
}

function generatePDF() {
    if (cart.length === 0) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(197, 160, 89); // Gold color
    doc.text("FZM Renovations - Quote Estimate", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);

    // Table Header
    let y = 50;
    doc.setFont(undefined, 'bold');
    doc.text("Item", 20, y);
    doc.text("Category", 100, y);
    doc.text("Price", 160, y);

    // Items
    doc.setFont(undefined, 'normal');
    y += 10;
    let total = 0;

    cart.forEach(item => {
        doc.text(item.name, 20, y);
        doc.text(item.category, 100, y);
        doc.text(`$${item.price}`, 160, y);
        total += parseFloat(item.price.replace(/[^0-9.]/g, ''));
        y += 10;
    });

    // Total
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text(`Total Estimate: $${total.toFixed(2)}`, 140, y);

    // Footer
    doc.setFontSize(10);
    doc.text("Note: This is an estimate only. Final pricing subject to on-site inspection.", 20, y + 20);

    doc.save("FZM-Quote.pdf");
}

/** @type {null|HTMLDivElement} */
let characterVisibleEl = null;
/** @type {null|HTMLDivElement} */
let characterImg = null;
/** @type {null|HTMLDivElement} */
let pricingEl = null;
/** @type {null|HTMLDivElement} */
let pricingDescEl = null;

const pricings = [
    {
        name: "Head",
        description: "Just a head, potentially with a neck/collar",
        height: 23,
        price: 15,
    },
    {
        name: "Bust",
        description: "The head, including neck, shirt collar and shoulders",
        height: 30,
        price: 20,
    },
    {
        name: "Upper Body",
        description: "Head, neck, shoulders, arms and upper body up to waist",
        height: 50,
        price: 25,
    },
    {
        name: "Full Body",
        description: "Entire character's body",
        height: 100,
        price: 35,
    },
];

window.addEventListener("DOMContentLoaded", () => {
    characterVisibleEl = document.getElementById("character-visible");
    characterImg = document.getElementById("character-img");
    pricingEl = document.getElementById("pricing");
    pricingDescEl = document.getElementById("description");

    const initialPricing = pricings[1];
    updatePricing(initialPricing.height);
    setHeight(initialPricing.height);
});

/**
 * @param {DragEvent} e
 */
function handleDragStart(e) {
    characterVisibleEl.style.transition = undefined;
    e.dataTransfer.dropEffect = "copy";
}

/**
 * @param {DragEvent} e
 */
function handleDragEnd(e) {
    characterVisibleEl.style.transition = "height 0.25s ease";

    const closestPricing = findClosestPricing(currentHeight);
    setHeight(closestPricing.height);
}

/**
 * @param {DragEvent} e
 */
function handleDragOver(e) {
    e.preventDefault();
    if (!characterVisibleEl || !characterImg) {
        return;
    }

    const topY = characterVisibleEl.getBoundingClientRect().y;
    const offset = e.clientY - topY;
    const maxHeight = characterImg.clientHeight;
    const newHeight = Math.min(100, (offset / maxHeight) * 100);

    updatePricing(newHeight);
    setHeight(newHeight);
}

let currentHeight = 0;

/**
 * @param {Number} height
 */
function setHeight(height) {
    characterVisibleEl.style.height = height + "%";
    currentHeight = height;
}

/**
 * @param {Number} height
 */
function findClosestPricing(height) {
    let closestPricing = pricings[0];

    for (let i = 1; i < pricings.length; i++) {
        const pricing = pricings[i];
        const oldDiff = Math.abs(closestPricing.height - height);
        const newDiff = Math.abs(pricing.height - height);
        if (newDiff < oldDiff) {
            closestPricing = pricing;
        }
    }

    return closestPricing;
}

/**
 * @param {Number} height
 */
function updatePricing(height) {
    if (!pricingEl || !characterVisibleEl || !pricingDescEl) {
        return;
    }

    const closestPricing = findClosestPricing(height);
    pricingEl.innerText = closestPricing.name + " $" + closestPricing.price;

    pricingDescEl.innerText = closestPricing.description;
}

/**
 * FZM Renovations - Central Site Data
 * This file contains all the text content and image paths for the public pages.
 * Edit this file to update the website content.
 */

const siteData = {
    general: {
        companyName: "FZM Renovations",
        location: "Markham, Ontario",
        phone: "(647) 831-9449",
        email: "fzmrenovations@gmail.com",
        whatsapp: "https://wa.me/16478319449",
        social: {
            facebook: "#",
            instagram: "#",
            linkedin: "#"
        }
    },
    hero: {
        title: "Transforming Homes into Masterpieces",
        subtitle: "Premium Renovations in Markham & The GTA. Craftsmanship you can trust.",
        ctaText: "Get a Free Quote",
        ctaLink: "contact.html",
        backgroundImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" // Luxury interior
    },
    benefits: [
        {
            title: "On-Time Completion",
            description: "We respect your time. Our project management ensures deadlines are met without compromising quality.",
            icon: "⏱️"
        },
        {
            title: "Licensed & Insured",
            description: "Peace of mind guaranteed. We are fully licensed and carry comprehensive liability insurance.",
            icon: "🛡️"
        },
        {
            title: "Premium Quality",
            description: "We use only the finest materials and skilled craftsmen to deliver a finish that exceeds expectations.",
            icon: "✨"
        }
    ],
    testimonials: [
        {
            name: "Sarah M.",
            location: "Markham, ON",
            text: "From start to finish, the entire process was seamless and stress-free. The attention to detail and quality of workmanship is evident in every aspect of the finished product. It exceeded my expectations!",
            rating: 5
        },
        {
            name: "James & Linda",
            location: "Richmond Hill, ON",
            text: "Working with FZM renovations has been a pleasure over multiple varying projects. The team takes great pride in their work, offers excellent customer service, and goes above and beyond to ensure clients are happy.",
            rating: 5
        },
        {
            name: "Robert T.",
            location: "Vaughan, ON",
            text: "They are so agile! They were very fast in our service. They started on Monday and finished on Friday. Reasonably priced, on time completion and excellent work.",
            rating: 5
        },
        {
            name: "Emily Chen",
            location: "Unionville, ON",
            text: "Felipe and his crew came up with a few design options for us and were very accommodating to our timeline and budget. We are very happy with our finished product!",
            rating: 5
        },
        {
            name: "David K.",
            location: "Thornhill, ON",
            text: "We are satisfied with the result of our renovation. They are detail-oriented and punctual. The price was fair and the quality is top-notch.",
            rating: 5
        }
    ],
    gallery: [
        {
            category: "kitchens",
            title: "Modern White Kitchen",
            image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1936&auto=format&fit=crop"
        },
        {
            category: "kitchens",
            title: "Luxury Marble Island",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            category: "bathrooms",
            title: "Spa-Like Master Bath",
            image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1974&auto=format&fit=crop"
        },
        {
            category: "bathrooms",
            title: "Contemporary Shower",
            image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
        },
        {
            category: "basements",
            title: "Home Theater Setup",
            image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop"
        },
        {
            category: "basements",
            title: "Open Concept Rec Room",
            image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"
        }
    ]
};

// Expose to global scope
window.siteData = siteData;

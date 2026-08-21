import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STORE_CONFIG } from "./config";

export default function YourApp() {
  // State for category filter
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [showBtt, setShowBtt] = useState(false);

  // Cart State with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("user_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [animateCart, setAnimateCart] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Customer order form in Cart
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
    notes: ""
  });

  // Modal States
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [menuQty, setMenuQty] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(null);

  // Form submit feedback states
  const [resSubmitted, setResSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Countdown timer for Special Offer
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 45, seconds: 30 });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("user_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // Total items count & total price
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const grandTotal = cartSubtotal + STORE_CONFIG.deliveryFee;

  // Add to cart with Framer Motion flying badge trigger
  const handleAddToCart = (item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.title,
          price: item.rawPrice,
          formattedPrice: item.price,
          qty,
          img: item.img,
          catName: item.catName
        }
      ];
    });

    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 1200);
  };

  // Update item quantity in cart
  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCart([]);
    }
  };

  // Generate formatted WhatsApp checkout message and redirect
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Please add items before checking out.");
      return;
    }

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    // Build Itemized List
    const itemsList = cart
      .map((item, index) => {
        const itemTotal = item.price * item.qty;
        return `${index + 1}. *${item.name}* \n   ↳ Qty: ${item.qty} × ${STORE_CONFIG.currency} ${item.price} = *${STORE_CONFIG.currency} ${itemTotal}*`;
      })
      .join("\n");

    // Pre-filled WhatsApp Message Outline
    const message = 
`🛍️ *NEW ORDER — ${STORE_CONFIG.storeName.toUpperCase()}*
────────────────────────
🆔 *Order ID:* #${orderId}
📅 *Date:* ${date}

🛒 *ORDER ITEMS:*
${itemsList}

────────────────────────
💰 *Subtotal:* ${STORE_CONFIG.currency} ${cartSubtotal}
🚚 *Delivery:* ${STORE_CONFIG.deliveryFee === 0 ? "FREE (Jahanian)" : `${STORE_CONFIG.currency} ${STORE_CONFIG.deliveryFee}`}
💵 *TOTAL BILL:* *${STORE_CONFIG.currency} ${grandTotal}*
────────────────────────

📋 *CUSTOMER DETAILS:*
👤 *Name:* ${customerInfo.name.trim() || "__________________"}
📍 *Delivery Address:* ${customerInfo.address.trim() || "__________________"}
📞 *Phone Number:* ${customerInfo.phone.trim() || "__________________"}
📝 *Order Notes / Landmark:* ${customerInfo.notes.trim() || "None"}

────────────────────────
_Please tap send to confirm your order with Feasto Jahanian!_`;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  // Menu items list with realistic Rs. prices
  const menuItems = [
    {
      id: 1,
      cat: "burgers",
      catName: "Burgers",
      title: "Classic Smash Burger",
      rawPrice: 650,
      price: "Rs. 650",
      oldPrice: "Rs. 750",
      rating: 4.9,
      reviews: 128,
      cal: 620,
      time: 12,
      desc: "Double smashed premium beef patty, melted cheddar cheese, caramelized onions, house pickles, and our legendary signature sauce on a toasted brioche bun.",
      shortDesc: "Double smashed patty, cheddar, caramelized onions, pickles & special sauce",
      img: "./img/menu/1.jpg",
      badge: "hot",
      badgeText: "Hot",
      tags: ["Halal", "Bestseller", "Beef"]
    },
    {
      id: 2,
      cat: "pizza",
      catName: "Pizza",
      title: "Margherita Royale Pizza",
      rawPrice: 1299,
      price: "Rs. 1,299",
      oldPrice: "Rs. 1,499",
      rating: 4.8,
      reviews: 95,
      cal: 480,
      time: 18,
      desc: "Fresh tomato sauce, melted mozzarella, fresh basil leaves, drizzled with virgin olive oil on hand-stretched crust.",
      shortDesc: "Fresh mozzarella, tomato sauce, aromatic herbs on hand-stretched crust",
      img: "./img/menu/2.jpg",
      badge: "new",
      badgeText: "New",
      tags: ["Cheesy", "Fresh", "Italian"]
    },
    {
      id: 3,
      cat: "chicken",
      catName: "Chicken",
      title: "Nashville Hot Fried Chicken",
      rawPrice: 599,
      price: "Rs. 599",
      oldPrice: "Rs. 699",
      rating: 5.0,
      reviews: 210,
      cal: 710,
      time: 15,
      desc: "Extra-crispy chicken breast coated in fiery Nashville spice blend, served with garlic mayo drizzle and house pickles on a toasted bun.",
      shortDesc: "Crispy fried chicken in fiery Nashville spice blend with special dip",
      img: "./img/menu/3.jpg",
      badge: "bestseller",
      badgeText: "Best Seller",
      tags: ["Spicy", "Crispy", "Popular"]
    },
    {
      id: 4,
      cat: "wraps",
      catName: "Wraps",
      title: "Loaded Fajita Chicken Wrap",
      rawPrice: 450,
      price: "Rs. 450",
      oldPrice: "",
      rating: 4.5,
      reviews: 74,
      cal: 520,
      time: 10,
      desc: "Grilled spicy chicken strips, sautéed bell peppers, onions, secret sauce, and melted cheese in a warm tortilla wrap.",
      shortDesc: "Grilled chicken, crunchy veggies & melted cheese in a warm tortilla",
      img: "./img/menu/4.jpg",
      badge: null,
      badgeText: "",
      tags: ["Grilled", "Fresh", "Snack"]
    },
    {
      id: 5,
      cat: "desserts",
      catName: "Desserts",
      title: "Nutella Molten Lava Cake",
      rawPrice: 399,
      price: "Rs. 399",
      oldPrice: "Rs. 499",
      rating: 4.9,
      reviews: 56,
      cal: 390,
      time: 8,
      desc: "Warm chocolate cake with a molten oozing Nutella center, served warm with rich chocolate drizzle.",
      shortDesc: "Molten chocolate cake with gooey Nutella center and sweet toppings",
      img: "./img/menu/5.jpg",
      badge: "new",
      badgeText: "New",
      tags: ["Sweet", "Nutella", "Chocolate"]
    },
    {
      id: 6,
      cat: "pasta",
      catName: "Pasta",
      title: "Creamy Chicken Alfredo Pasta",
      rawPrice: 850,
      price: "Rs. 850",
      oldPrice: "",
      rating: 4.9,
      reviews: 88,
      cal: 560,
      time: 20,
      desc: "Al dente penne pasta tossed in rich garlic parmesan cream sauce with seasoned grilled chicken breast and herbs.",
      shortDesc: "Al dente penne, rich parmesan cream sauce & tender grilled chicken",
      img: "./img/menu/6.jpg",
      badge: "hot",
      badgeText: "Chef's Pick",
      tags: ["Creamy", "Chef's Pick", "Cheesy"]
    }
  ];

  const galleryItems = [
    {
      id: 0,
      img: "./img/portfolio/work1.jpg",
      title: "Gourmet Burgers",
      desc: "Feasto signature smash burgers, handcrafted with 100% halal beef, premium cheese, and house sauces."
    },
    {
      id: 1,
      img: "./img/portfolio/work2.jpg",
      title: "Stone Oven Pizza",
      desc: "Authentic pizzas with generous cheese and toppings baked to golden perfection."
    },
    {
      id: 2,
      img: "./img/portfolio/work3.jpg",
      title: "Crispy Fried Chicken",
      desc: "Double-brined, golden-fried crispy chicken prepared with our secret spice blend."
    },
    {
      id: 3,
      img: "./img/portfolio/work4.jpg",
      title: "Sweet Treats & Shakes",
      desc: "Decadent desserts and thick ice cream shakes made fresh for your cravings."
    },
    {
      id: 4,
      img: "./img/portfolio/work5.jpg",
      title: "Loaded Fresh Wraps",
      desc: "Crispy and grilled wraps loaded with tenders, fresh veggies, and spicy dips."
    }
  ];

  const categories = [
    { id: "all", name: "All Items", count: "99 items", img: "./img/category/1.jpg" },
    { id: "burgers", name: "Burgers", count: "24 items", img: "./img/category/2.jpg" },
    { id: "pizza", name: "Pizza", count: "18 items", img: "./img/category/3.jpg" },
    { id: "chicken", name: "Fried Chicken", count: "15 items", img: "./img/category/4.jpg" },
    { id: "wraps", name: "Wraps", count: "12 items", img: "./img/category/5.jpg" },
    { id: "desserts", name: "Desserts", count: "20 items", img: "./img/category/6.jpg" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);
      setShowBtt(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    if (window.AOS) {
      window.AOS.init({ duration: 680, once: true, offset: 55 });
    }

    if (window.Swiper) {
      new window.Swiper(".tesSwiper", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const openMenuModal = (item) => {
    setSelectedMenuItem(item);
    setMenuQty(1);
  };

  const closeMenuModal = () => {
    setSelectedMenuItem(null);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (activeCategory !== "all" && item.cat !== activeCategory) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.catName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sarab-app">
      {/* ================= 1. TOP BAR (Client Info) ================= */}
      <div id="topbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="top-contact d-flex flex-wrap">
              <span>
                <a href={`tel:${STORE_CONFIG.whatsappNumber}`} style={{ color: "inherit" }}>
                  <i className="fas fa-phone-alt me-1"></i>{STORE_CONFIG.phoneInternational}
                </a>
              </span>
              <span>
                <a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                  <i className="fab fa-whatsapp me-1 text-success"></i>{STORE_CONFIG.phoneLocal}
                </a>
              </span>
              <span>
                <i className="fas fa-map-marker-alt me-1"></i>{STORE_CONFIG.location.shortAddress}
              </span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="ttag">
                <i className="fas fa-fire me-1"></i>{STORE_CONFIG.deliveryTag}
              </span>
              <div className="tsoc">
                <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer" title="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" title="WhatsApp Order">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer" title="TikTok">
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. NAVBAR (Client Info) ================= */}
      <nav className={`navbar navbar-expand-lg ${navScrolled ? "scrolled" : ""}`} id="nav">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 p-0" href="#hero">
            <div className="blogo d-flex align-items-center gap-2">
              <img
                src="./img/logo.jpg"
                alt="Feasto Logo"
                style={{
                  height: "46px",
                  width: "auto",
                  borderRadius: "8px",
                  objectFit: "contain",
                  background: "transparent"
                }}
              />
              <div>
                <div className="bname" style={{ fontSize: "1.45rem", fontWeight: "800", lineHeight: 1.1 }}>
                  Feas<span>to</span>
                </div>
                <div className="bsub" style={{ fontSize: "0.74rem", color: "var(--secondary)", letterSpacing: "0.5px" }}>
                  Jahanian • Fast Food
                </div>
              </div>
            </div>
          </a>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navmenu"
          >
            <i className="fas fa-bars" style={{ color: "var(--primary)", fontSize: "1.35rem" }}></i>
          </button>
          <div className="collapse navbar-collapse" id="navmenu">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item"><a className="nav-link active" href="#hero">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
              <li className="nav-item"><a className="nav-link" href="#menu">Menu</a></li>
              <li className="nav-item"><a className="nav-link" href="#cart">Cart {totalCartCount > 0 && `(${totalCartCount})`}</a></li>
              <li className="nav-item"><a className="nav-link" href="#chefs">Chefs</a></li>
              <li className="nav-item"><a className="nav-link" href="#reservation">Reservation</a></li>
              <li className="nav-item"><a className="nav-link" href="#testimonials">Reviews</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact-section">Contact</a></li>
            </ul>
            <div className="d-flex align-items-center gap-2">
              <button
                id="navSearchBtn"
                title="Search Menu"
                onClick={() => setSearchOpen(true)}
              >
                <i className="fas fa-search"></i>
              </button>

              {/* Cart Drawer Trigger Button */}
              <button
                className="btn position-relative d-flex align-items-center justify-content-center"
                onClick={() => setIsCartDrawerOpen(true)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(232,40,26,0.1)",
                  color: "var(--primary)",
                  border: "none"
                }}
                title="View Cart"
              >
                <i className="fas fa-shopping-cart"></i>
                {totalCartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.68rem" }}
                  >
                    {totalCartCount}
                  </span>
                )}
              </button>

              <a href="#menu" className="nav-link nav-cta">
                <i className="fas fa-shopping-bag me-1"></i>Order Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= SEARCH OVERLAY POPUP ================= */}
      <div id="searchOv" className={searchOpen ? "open" : ""}>
        <button className="sovclose" id="searchClose" onClick={() => setSearchOpen(false)}>
          <i className="fas fa-times"></i>
        </button>
        <div className="sovbox">
          <h4>What are you craving at Feasto?</h4>
          <div className="sovinput">
            <input
              type="text"
              id="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search burgers, pizza, fried chicken, wraps..."
              autoComplete="off"
            />
            <button onClick={() => setSearchOpen(false)}><i className="fas fa-search"></i></button>
          </div>
          <div className="sovcats">
            {categories.map((c) => (
              <div
                key={c.id}
                className={`sovcat ${activeCategory === c.id ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(c.id);
                  setSearchOpen(false);
                  const el = document.getElementById("menu");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <img src={c.img} alt="" />
                {c.name}
              </div>
            ))}
          </div>
          <div className="sovtrend">
            <p><i className="fas fa-fire me-1" style={{ color: "var(--secondary)" }}></i>Trending at Feasto Jahanian</p>
            {["Smash Burger", "Nashville Hot Chicken", "Margherita Pizza", "Lava Cake", "Fajita Wrap", "Alfredo Pasta"].map((tag) => (
              <span
                key={tag}
                className="ttag"
                onClick={() => {
                  setSearchQuery(tag);
                  const el = document.getElementById("menu");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 3. HERO (Location updated to Jahanian) ================= */}
      <section id="hero">
        <div className="hs hs1"></div>
        <div className="hs hs2"></div>
        <div className="hbgtxt">FEASTO</div>
        <div className="container">
          <div className="row align-items-center g-5" style={{ minHeight: "88vh" }}>
            <div className="col-lg-6">
              <div className="hbadge">
                <div className="hbi"><i className="fas fa-star"></i></div>
                <span>#1 Rated Fast Food Restaurant in Jahanian</span>
              </div>
              <h1 className="htitle">Delicious <span className="hl">Fast Food</span><br />for Every Moment</h1>
              <p className="hdesc">
                Experience bold flavors crafted with fresh ingredients at Yum Yum Tower, Ibrahim Town, Jahanian. Sizzling burgers, crispy fried chicken, and artisan pizzas crafted to perfection.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <a href="#menu" className="btn-red"><i className="fas fa-utensils me-1"></i>Explore Menu</a>
                {/* 4. Link "Watch Our Story" changed to "Contact Us" */}
                <a href="#contact-section" className="btn-play">
                  <div className="pico"><i className="fas fa-phone-alt"></i></div>
                  <span>Contact Us</span>
                </a>
              </div>
              {/* 5. hstats (Experience yr removed as requested) */}
              <div className="hstats d-flex gap-3 flex-wrap mt-4">
                <div className="hstat"><span className="snum">850<em>+</em></span><small>Happy Customers</small></div>
                <div className="sdiv"></div>
                <div className="hstat"><span className="snum">120<em>+</em></span><small>Menu Items</small></div>
                <div className="sdiv"></div>
                <div className="hstat"><span className="snum">15<em>+</em></span><small>Expert Chefs</small></div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ position: "relative", textAlign: "center" }}>
                <div className="hcircle">
                  <img src="./img/banner-img.jpg" alt="Feasto Burger" />
                </div>
                <div className="fcard fc1">
                  <div className="fcoi r"><i className="fas fa-fire"></i></div>
                  <div><span className="fcnum">Hot Deal</span><span className="fcsm">30% off today</span></div>
                </div>
                <div className="fcard fc2">
                  <div className="fcoi y"><i className="fas fa-star"></i></div>
                  <div><span className="fcnum">4.9/5</span><span className="fcsm">2.4k+ reviews</span></div>
                </div>
                <div className="fcard fc3">
                  <div className="fcoi g"><i className="fas fa-clock"></i></div>
                  <div><span className="fcnum">20 min</span><span className="fcsm">Fast delivery</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="mqsec">
        <div className="mqtrack">
          <div className="mqitem"><i className="fas fa-circle"></i>Feasto Crispy Fried Chicken</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Gourmet Smash Burgers</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Artisan Cheesy Pizzas</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Loaded Fresh Wraps</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Creamy Alfredo Pasta</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Nutella Lava Cakes</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Free Fast Delivery in Jahanian</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Feasto Crispy Fried Chicken</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Gourmet Smash Burgers</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Artisan Cheesy Pizzas</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Loaded Fresh Wraps</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Creamy Alfredo Pasta</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Nutella Lava Cakes</div>
          <div className="mqitem"><i className="fas fa-circle"></i>Free Fast Delivery in Jahanian</div>
        </div>
      </div>

      {/* ================= CATEGORY ================= */}
      <section id="category">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">What We Offer</span>
            <h2 className="stitle">Browse by <span>Category</span></h2>
            <div className="sline"></div>
            <p className="sdesc mx-auto" style={{ maxWidth: "480px" }}>
              From sizzling burgers to artisan pizzas — discover your favorites at Feasto Jahanian
            </p>
          </div>
          <div className="row g-3 justify-content-center">
            {categories.map((c, i) => (
              <div key={c.id} className="col-6 col-sm-4 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay={i * 70}>
                <div
                  className={`catcard ${activeCategory === c.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveCategory(c.id);
                    const el = document.getElementById("menu");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <img className="catimg" src={c.img} alt="" />
                  <div className="catnm">{c.name}</div>
                  <div className="catct">{c.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6, 7, 8. ABOUT (Client Photo & Story) ================= */}
      <section id="about">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-aos="fade-right">
              <div className="astack">
                {/* 8. aexp changed */}
                <div className="aexp" style={{ minWidth: "120px" }}>
                  <span className="anum" style={{ fontSize: "1.4rem" }}>100%</span>
                  <small>Fresh &amp; Halal<br />In Jahanian</small>
                </div>
                {/* 6. amain img replaced with client restaurant photo */}
                <div className="amain">
                  <img src="./img/restaurant.jpg" alt="Feasto Jahanian Restaurant" />
                </div>
                <div className="asm"><img src="./img/about2.jpg" alt="Feasto Food" /></div>
              </div>
            </div>
            <div className="col-lg-7" data-aos="fade-left">
              <span className="slbl">Our Story</span>
              <h2 className="stitle text-start">Welcome to <span>Feasto Jahanian</span></h2>
              <div className="sline lft"></div>
              {/* 7. Story description changed to client info */}
              <p className="sdesc mb-4">
                Feasto Jahanian brings world-class fast food and culinary excellence to Yum Yum Tower, Ibrahim Town, Jahanian. Serving sizzling burgers, crispy fried chicken, artisan pizzas, and premium fast food crafted fresh daily with high quality ingredients and passion.
              </p>
              <div className="mb-4">
                <div className="fti">
                  <div className="ftico r"><i className="fas fa-leaf"></i></div>
                  <div>
                    <h6>100% Fresh &amp; Halal Ingredients</h6>
                    <p>We source premium ingredients daily for maximum flavor, hygiene, and crunch.</p>
                  </div>
                </div>
                <div className="fti">
                  <div className="ftico y"><i className="fas fa-award"></i></div>
                  <div>
                    <h6>Signature Feasto Secret Recipes</h6>
                    <p>Our unique spice blends and gourmet sauces create an unforgettable fast food experience.</p>
                  </div>
                </div>
                <div className="fti">
                  <div className="ftico g"><i className="fas fa-shipping-fast"></i></div>
                  <div>
                    <h6>Lightning-Fast Delivery in Jahanian</h6>
                    <p>Enjoy hot, freshly prepared meals delivered straight to your door or ready for takeaway.</p>
                  </div>
                </div>
              </div>
              <a href="#menu" className="btn-red"><i className="fas fa-book-open me-1"></i>View Full Menu</a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MENU ================= */}
      <section id="menu">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">What's Cooking</span>
            <h2 className="stitle">Feasto Jahanian <span>Menu</span></h2>
            <div className="sline"></div>
          </div>
          {/* Filter buttons */}
          <div className="text-center mb-4" data-aos="fade-up">
            {[
              { id: "all", label: "All" },
              { id: "burgers", label: "Burgers" },
              { id: "pizza", label: "Pizza" },
              { id: "chicken", label: "Chicken" },
              { id: "wraps", label: "Wraps" },
              { id: "desserts", label: "Desserts" },
              { id: "pasta", label: "Pasta" }
            ].map((f) => (
              <button
                key={f.id}
                className={`filtbtn ${activeCategory === f.id ? "active" : ""}`}
                onClick={() => setActiveCategory(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="row g-4" id="mgrid">
            {filteredMenuItems.map((item, idx) => (
              <div key={item.id} className="col-sm-6 col-lg-4 mwrap" data-aos="fade-up" data-aos-delay={idx * 80}>
                <div className="mcard" onClick={() => openMenuModal(item)}>
                  <div className="mimg">
                    <img src={item.img} alt={item.title} loading="lazy" />
                    {item.badge && (
                      <div className={`mbdg ${item.badge}`}>
                        <i className="fas fa-star"></i> {item.badgeText}
                      </div>
                    )}
                    <div className="mhrt" onClick={(e) => { e.stopPropagation(); alert(`Added ${item.title} to favorites!`); }}>
                      <i className="far fa-heart"></i>
                    </div>
                  </div>
                  <div className="mbody">
                    <div className="mcat">{item.catName}</div>
                    <div className="mtit">{item.title}</div>
                    <div className="mdesc">{item.shortDesc}</div>
                    <div className="mfoot">
                      <div>
                        <div className="mprice">
                          {item.price} {item.oldPrice && <small>{item.oldPrice}</small>}
                        </div>
                        <div className="mstars">
                          <i className="fas fa-star"></i> <span style={{ color: "#bbb", fontSize: ".7rem" }}>({item.reviews})</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-danger rounded-pill px-3 py-1 fw-bold"
                          title="Add to Cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item, 1);
                          }}
                        >
                          + Add
                        </button>
                        <button
                          className="madd"
                          title="View Details"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMenuModal(item);
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <a href="#cart" className="btn-red"><i className="fas fa-shopping-cart me-1"></i>Review Cart &amp; Checkout</a>
          </div>
        </div>
      </section>

      {/* ================= MENU DETAIL POPUP MODAL ================= */}
      {selectedMenuItem && (
        <div id="menuPop" className="open" style={{ display: "flex" }}>
          <div className="mpbox">
            <button className="mpclose" id="mpClose" onClick={closeMenuModal}>
              <i className="fas fa-times"></i>
            </button>
            <div className="mpimg"><img id="mpImg" src={selectedMenuItem.img} alt="" /></div>
            <div className="mpbody">
              <div id="mpCat">{selectedMenuItem.catName}</div>
              <div id="mpTitle">{selectedMenuItem.title}</div>
              <div id="mpStars">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                <span style={{ color: "#bbb", fontSize: ".78rem", marginLeft: "6px" }}>{selectedMenuItem.rating} ({selectedMenuItem.reviews} reviews)</span>
              </div>
              <div id="mpDesc">{selectedMenuItem.desc}</div>
              <div id="mpPrice">
                {selectedMenuItem.price} {selectedMenuItem.oldPrice && <small style={{ color: "#ccc", textDecoration: "line-through", marginLeft: "8px", fontSize: "1rem" }}>{selectedMenuItem.oldPrice}</small>}
              </div>
              <div className="mpmeta" id="mpMeta">
                <div className="mpm"><div className="mpmv">{selectedMenuItem.cal} kcal</div><div className="mpml">Calories</div></div>
                <div className="mpm"><div className="mpmv">{selectedMenuItem.time} min</div><div className="mpml">Prep Time</div></div>
                <div className="mpm"><div className="mpmv">{selectedMenuItem.rating}/5</div><div className="mpml">Rating</div></div>
              </div>
              <div className="mpqty">
                <button className="mpqbtn" onClick={() => setMenuQty(Math.max(1, menuQty - 1))}>-</button>
                <span className="mpqnum">{menuQty}</span>
                <button className="mpqbtn" onClick={() => setMenuQty(menuQty + 1)}>+</button>
                <span style={{ fontSize: ".82rem", color: "#aaa", marginLeft: "9px" }}>portion</span>
              </div>
              <div className="mptags">
                {selectedMenuItem.tags.map((t) => (
                  <span key={t} className="mptag">{t}</span>
                ))}
              </div>
              <button
                className="mpaddcart"
                onClick={() => {
                  handleAddToCart(selectedMenuItem, menuQty);
                  closeMenuModal();
                }}
              >
                <i className="fas fa-shopping-cart me-1"></i>Add {menuQty}x to Cart ({STORE_CONFIG.currency} {selectedMenuItem.rawPrice * menuQty})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SPECIAL OFFER ================= */}
      <section id="special">
        <div className="spbg"></div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="sptag"><i className="fas fa-bolt me-1"></i>Limited Time Offer in Jahanian</div>
              <h2 className="sptitle">Get 30% Off<br />Our Signature<br /><span>Feasto Burger</span> Meal</h2>
              <p className="spdesc">
                Don't miss our weekend special — grab our award-winning signature burger combo with loaded seasoned fries and a chilled shake at an unbeatable price in Jahanian.
              </p>
              <div className="cdwrap">
                <div className="cditem"><span className="cdnum">{String(countdown.hours).padStart(2, "0")}</span><span className="cdlbl">Hours</span></div>
                <div className="cditem"><span className="cdnum">{String(countdown.minutes).padStart(2, "0")}</span><span className="cdlbl">Minutes</span></div>
                <div className="cditem"><span className="cdnum">{String(countdown.seconds).padStart(2, "0")}</span><span className="cdlbl">Seconds</span></div>
              </div>
              <button
                className="btn-red"
                onClick={() => {
                  handleAddToCart(
                    {
                      id: 99,
                      title: "Special Signature Burger Meal Deal",
                      rawPrice: 799,
                      price: "Rs. 799",
                      img: "./img/off-img.jpg",
                      catName: "Deals"
                    },
                    1
                  );
                }}
              >
                <i className="fas fa-shopping-cart me-1"></i>Grab Deal for Rs. 799
              </button>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="spimgw">
                <div className="spglow"></div>
                <div className="sppbdg"><span className="old">Rs. 1099</span><span className="np">Rs. 799</span></div>
                <img src="./img/off-img.jpg" alt="Special Burger Meal" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section id="gallery">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">Food Showcase</span>
            <h2 className="stitle">Feasto Jahanian <span>Showcase</span></h2>
            <div className="sline"></div>
          </div>
          <div className="ggrid" data-aos="fade-up">
            {galleryItems.map((g, idx) => (
              <div key={g.id} className="gitem" onClick={() => setGalleryIndex(idx)}>
                <img src={g.img} alt={g.title} loading="lazy" />
                <div className="gover">
                  <span><i className="fas fa-expand-alt"></i> {g.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY POPUP ================= */}
      {galleryIndex !== null && (
        <div id="galPop" className="open" style={{ display: "flex" }}>
          <div className="gpbox">
            <button className="gpclose" onClick={() => setGalleryIndex(null)}><i className="fas fa-times"></i></button>
            <img id="gpImg" src={galleryItems[galleryIndex].img} alt="" />
            <div className="gpcap">
              <h5>{galleryItems[galleryIndex].title}</h5>
              <p>{galleryItems[galleryIndex].desc}</p>
            </div>
            <div className="gpnav">
              <button onClick={() => setGalleryIndex((galleryIndex - 1 + galleryItems.length) % galleryItems.length)}>
                <i className="fas fa-chevron-left me-1"></i>Prev
              </button>
              <button onClick={() => setGalleryIndex((galleryIndex + 1) % galleryItems.length)}>
                Next <i className="fas fa-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 9. CART & WHATSAPP ORDERING ENGINE (Replaces #history section) ================= */}
      <section id="cart" className="py-5" style={{ background: "var(--light)", minHeight: "60vh" }}>
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">Direct WhatsApp Ordering</span>
            <h2 className="stitle">Your <span>Food Cart</span></h2>
            <div className="sline"></div>
            <p className="sdesc mx-auto" style={{ maxWidth: "540px" }}>
              Review your items, enter delivery address in Jahanian, and send your order directly to our WhatsApp kitchen!
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-5" data-aos="fade-up">
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "rgba(232,40,26,0.1)",
                  color: "var(--primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  marginBottom: "20px"
                }}
              >
                <i className="fas fa-shopping-basket"></i>
              </div>
              <h4 className="mb-2">Your Cart is Currently Empty</h4>
              <p className="text-muted mb-4">Choose from our delicious burgers, pizza, chicken and wraps to get started.</p>
              <a href="#menu" className="btn-red">
                <i className="fas fa-utensils me-1"></i>Browse Menu Items
              </a>
            </div>
          ) : (
            <div className="row g-4 align-items-start">
              {/* Itemized Cart List */}
              <div className="col-lg-7" data-aos="fade-right">
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    padding: "28px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <h5 className="mb-0 fw-bold">Order Items ({totalCartCount})</h5>
                    <button
                      className="btn btn-sm text-danger"
                      onClick={clearCart}
                      style={{ fontSize: "0.85rem" }}
                    >
                      <i className="fas fa-trash-alt me-1"></i>Clear All
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 border-bottom"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.img}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              objectFit: "cover"
                            }}
                          />
                          <div>
                            <h6 className="mb-1 fw-bold" style={{ fontSize: "0.95rem" }}>{item.name}</h6>
                            <span className="text-muted" style={{ fontSize: "0.82rem" }}>
                              {STORE_CONFIG.currency} {item.price} each
                            </span>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                          {/* Quantity selector */}
                          <div
                            className="d-flex align-items-center"
                            style={{
                              background: "#f5f5f5",
                              borderRadius: "30px",
                              padding: "4px 8px"
                            }}
                          >
                            <button
                              className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
                              onClick={() => updateCartQty(item.id, -1)}
                              style={{ width: "26px", height: "26px", color: "var(--dark)" }}
                            >
                              -
                            </button>
                            <span className="fw-bold px-2" style={{ fontSize: "0.9rem" }}>{item.qty}</span>
                            <button
                              className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
                              onClick={() => updateCartQty(item.id, 1)}
                              style={{ width: "26px", height: "26px", color: "var(--dark)" }}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-end" style={{ minWidth: "80px" }}>
                            <strong style={{ color: "var(--primary)", fontSize: "1rem" }}>
                              {STORE_CONFIG.currency} {item.price * item.qty}
                            </strong>
                          </div>

                          <button
                            className="btn btn-sm text-secondary p-0"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Summary */}
                  <div className="mt-4 pt-2">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Subtotal:</span>
                      <span className="fw-bold">{STORE_CONFIG.currency} {cartSubtotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Delivery Fee (Jahanian):</span>
                      <span className="text-success fw-bold">
                        {STORE_CONFIG.deliveryFee === 0 ? "FREE" : `${STORE_CONFIG.currency} ${STORE_CONFIG.deliveryFee}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <span className="fw-bold" style={{ fontSize: "1.15rem" }}>Total Bill:</span>
                      <span className="fw-bold" style={{ color: "var(--primary)", fontSize: "1.25rem" }}>
                        {STORE_CONFIG.currency} {grandTotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info & WhatsApp Checkout Form */}
              <div className="col-lg-5" data-aos="fade-left">
                <div
                  style={{
                    background: "var(--dark)",
                    borderRadius: "18px",
                    padding: "28px",
                    color: "#fff",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)"
                  }}
                >
                  <h4 className="mb-2 text-white" style={{ fontSize: "1.25rem" }}>
                    <i className="fab fa-whatsapp text-success me-2"></i>Checkout on WhatsApp
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", marginBottom: "20px" }}>
                    Fill your delivery details below. Clicking checkout generates your WhatsApp order message automatically.
                  </p>

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <label style={{ fontSize: "0.78rem", color: "#ccc", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name (e.g. Usman Ali)"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        style={{
                          background: "#2a2a2a",
                          border: "1px solid #444",
                          color: "#fff",
                          padding: "10px 14px",
                          borderRadius: "10px"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.78rem", color: "#ccc", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Delivery Address in Jahanian *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="House/Street, Area, Landmark (Jahanian)"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        style={{
                          background: "#2a2a2a",
                          border: "1px solid #444",
                          color: "#fff",
                          padding: "10px 14px",
                          borderRadius: "10px"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.78rem", color: "#ccc", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="0300-XXXXXXX"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        style={{
                          background: "#2a2a2a",
                          border: "1px solid #444",
                          color: "#fff",
                          padding: "10px 14px",
                          borderRadius: "10px"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.78rem", color: "#ccc", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Order Notes / Special Requests
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Extra sauce, spicy, no mayo, etc..."
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        style={{
                          background: "#2a2a2a",
                          border: "1px solid #444",
                          color: "#fff",
                          padding: "10px 14px",
                          borderRadius: "10px"
                        }}
                      ></textarea>
                    </div>

                    <button
                      className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2"
                      onClick={handleWhatsAppCheckout}
                      style={{
                        backgroundColor: "#25d366",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "1.05rem",
                        border: "none",
                        boxShadow: "0 4px 18px rgba(37, 211, 102, 0.4)"
                      }}
                    >
                      <i className="fab fa-whatsapp fa-lg"></i>
                      Send Order via WhatsApp ({STORE_CONFIG.currency} {grandTotal})
                    </button>

                    <div className="text-center" style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.45)" }}>
                      <i className="fas fa-lock me-1"></i>Direct order to Feasto kitchen ({STORE_CONFIG.phoneLocal})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= CHEFS ================= */}
      <section id="chefs">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">The Culinary Team</span>
            <h2 className="stitle">Meet Feasto <span>Chefs</span></h2>
            <div className="sline"></div>
          </div>
          <div className="row g-4">
            {[
              { name: "Alice Mortal", role: "Head Fast Food Chef", exp: "12 years experience", img: "./img/chefs/1.jpg" },
              { name: "Michael Corn", role: "Grill Master", exp: "8 years experience", img: "./img/chefs/2.jpg" },
              { name: "Faz Chowdel", role: "Pastry & Dessert Chef", exp: "10 years experience", img: "./img/chefs/3.jpg" },
              { name: "William Latnum", role: "Pizza Artisan", exp: "9 years experience", img: "./img/chefs/4.jpg" }
            ].map((chef, idx) => (
              <div key={chef.name} className="col-sm-6 col-lg-3" data-aos="fade-up" data-aos-delay={idx * 80}>
                <div className="chcard">
                  <div className="chimg">
                    <img src={chef.img} alt={chef.name} loading="lazy" />
                    <div className="chsoc">
                      <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                      <a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
                      <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                    </div>
                  </div>
                  <div className="chbody">
                    <div className="chnm">{chef.name}</div>
                    <div className="chrole">{chef.role}</div>
                    <div className="chexp">{chef.exp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 10. OPENING HOURS & FIND US (Client Info) ================= */}
      <section id="hours">
        <div className="hrsbg"></div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl" style={{ color: "#a5d6bc" }}>Opening Hours</span>
            <h2 className="stitle" style={{ color: "#fff" }}>We're Open <span style={{ color: "var(--secondary)" }}>For You</span></h2>
            <div className="sline"></div>
          </div>
          <div className="row g-4 align-items-start">
            <div className="col-lg-5" data-aos="fade-right">
              <div className="hrscard">
                <div className="hrsrow">
                  <span className="hrsday"><i className="fas fa-calendar-week me-2" style={{ color: "var(--secondary)" }}></i>Monday - Sunday</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="hdot on"></div>
                    <span className="hrstime">11:00 AM - 02:00 AM</span>
                  </div>
                </div>
                <div className="hrsrow">
                  <span className="hrsday"><i className="fas fa-utensils me-2" style={{ color: "var(--secondary)" }}></i>Kitchen Cutoff</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="hrstime text-warning">01:30 AM</span>
                  </div>
                </div>
                <div className="hrsrow">
                  <span className="hrsday"><i className="fas fa-concierge-bell me-2" style={{ color: "var(--secondary)" }}></i>Available Services</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="hrstime text-success">Dine-in • Takeaway • Delivery</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3" data-aos="zoom-in">
              <div className="hrscta">
                <i className="fas fa-truck-fast fa-2x mb-3" style={{ color: "rgba(255,255,255,.8)" }}></i>
                <h4>Order Online</h4>
                <p>Free delivery across Jahanian in 25 min</p>
                <a href="#menu" className="btnw">Order Now →</a>
              </div>
            </div>
            {/* 10. hrscard replaced with Feasto client info */}
            <div className="col-lg-4" data-aos="fade-left">
              <div className="hrscard">
                <h5 style={{ color: "#fff", marginBottom: "18px", fontFamily: "'Poppins',sans-serif", fontSize: ".95rem", fontWeight: 700 }}>
                  <i className="fas fa-map-marker-alt me-2" style={{ color: "var(--secondary)" }}></i>Find Feasto Jahanian
                </h5>
                <div className="hrsrow">
                  <span className="hrsday"><i className="fas fa-location-dot me-2" style={{ color: "var(--secondary)" }}></i>Address</span>
                  <span className="hrstime" style={{ fontSize: ".8rem" }}>{STORE_CONFIG.location.fullAddress}</span>
                </div>
                <div className="hrsrow">
                  <span className="hrsday"><i className="fas fa-phone me-2" style={{ color: "var(--secondary)" }}></i>Phone</span>
                  <span className="hrstime" style={{ fontSize: ".8rem" }}>{STORE_CONFIG.phoneInternational}</span>
                </div>
                <div className="hrsrow">
                  <span className="hrsday"><i className="fab fa-whatsapp me-2 text-success"></i>WhatsApp</span>
                  <span className="hrstime" style={{ fontSize: ".8rem" }}>{STORE_CONFIG.phoneLocal}</span>
                </div>
                <div className="hrsrow">
                  <span className="hrsday"><i className="fas fa-envelope me-2" style={{ color: "var(--secondary)" }}></i>Email</span>
                  <span className="hrstime" style={{ fontSize: ".8rem" }}>{STORE_CONFIG.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">What People Say</span>
            <h2 className="stitle">Feasto Customers <span>Feedback</span></h2>
            <div className="sline"></div>
          </div>
          <div className="swiper tesSwiper" data-aos="fade-up">
            <div className="swiper-wrapper">
              {[
                { name: "Ahmed Raza", role: "Jahanian Resident", text: "The best burgers in Jahanian without any doubt! The smash burger has crispy edges, juicy beef, and the sauce is unmatched.", img: "./img/testimonial/1.jpg" },
                { name: "Sana Tariq", role: "Food Enthusiast", text: "Ordered delivery to Ibrahim Town and food was steaming hot within 20 minutes. Great packaging and generous portion sizes.", img: "./img/testimonial/2.jpg" },
                { name: "Bilal Hassan", role: "Regular Customer", text: "The Nashville chicken and molten lava cake are outstanding. Feasto has elevated the fast food scene in Jahanian completely!", img: "./img/testimonial/3.jpg" },
                { name: "Usman Malik", role: "Family Diner", text: "Lovely atmosphere at Yum Yum Tower. Clean dining, friendly staff, and the pizza crust is baked to absolute perfection.", img: "./img/testimonial/4.jpg" }
              ].map((t, idx) => (
                <div key={idx} className="swiper-slide">
                  <div className="tescard">
                    <div className="tesq">"</div>
                    <div className="tess"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                    <p className="testxt">{t.text}</p>
                    <div className="tesauth">
                      <img src={t.img} alt="" loading="lazy" />
                      <div>
                        <div className="tesnm">{t.name}</div>
                        <div className="tesrl">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination mt-4" style={{ position: "static" }}></div>
          </div>
        </div>
      </section>

      {/* ================= 11. RESERVATION (Client Info) ================= */}
      <section id="reservation">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">Book a Table</span>
            <h2 className="stitle">Make a <span>Reservation</span></h2>
            <div className="sline"></div>
            <p className="sdesc mx-auto" style={{ maxWidth: "480px" }}>
              Reserve your table at Feasto Jahanian (Yum Yum Tower, Ibrahim Town) for family gatherings and parties.
            </p>
          </div>
          <div className="row g-4 align-items-start">
            {/* 11. Reservation contact card updated with client info */}
            <div className="col-lg-4" data-aos="fade-right">
              <div style={{ background: "var(--dark)", borderRadius: "18px", padding: "36px" }}>
                <h4 style={{ color: "#fff", fontSize: "1.3rem", marginBottom: "8px" }}>Feasto Booking Info</h4>
                <p style={{ color: "rgba(255,255,255,.55)", fontSize: ".85rem", marginBottom: "26px" }}>
                  We are ready to host you and your family at Feasto Jahanian.
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "46px", height: "46px", borderRadius: "11px", background: "rgba(232,40,26,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontSize: "1.1rem", flexShrink: 0 }}>
                      <i className="fas fa-clock"></i>
                    </div>
                    <div><strong style={{ display: "block", color: "#ccc", fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".8px" }}>Opening Hours</strong><span style={{ color: "#fff", fontSize: ".87rem" }}>{STORE_CONFIG.operatingHours.display}</span></div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "46px", height: "46px", borderRadius: "11px", background: "rgba(232,40,26,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontSize: "1.1rem", flexShrink: 0 }}>
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div><strong style={{ display: "block", color: "#ccc", fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".8px" }}>Call for Booking</strong><span style={{ color: "#fff", fontSize: ".87rem" }}>{STORE_CONFIG.phoneInternational}</span></div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "46px", height: "46px", borderRadius: "11px", background: "rgba(232,40,26,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontSize: "1.1rem", flexShrink: 0 }}>
                      <i className="fas fa-users"></i>
                    </div>
                    <div><strong style={{ display: "block", color: "#ccc", fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".8px" }}>Group Dining &amp; Parties</strong><span style={{ color: "#fff", fontSize: ".87rem" }}>Special seating &amp; family halls</span></div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "46px", height: "46px", borderRadius: "11px", background: "rgba(232,40,26,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontSize: "1.1rem", flexShrink: 0 }}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div><strong style={{ display: "block", color: "#ccc", fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".8px" }}>Location</strong><span style={{ color: "#fff", fontSize: ".87rem" }}>{STORE_CONFIG.location.shortAddress}</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8" data-aos="fade-left">
              <div className="fcard">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setResSubmitted(true);
                  }}
                >
                  <div className="row g-3">
                    <div className="col-sm-6"><label className="flbl">Full Name *</label><input type="text" required className="fctrl" placeholder="Your Name" /></div>
                    <div className="col-sm-6"><label className="flbl">Phone Number *</label><input type="tel" required className="fctrl" placeholder="0300-XXXXXXX" /></div>
                    <div className="col-sm-6"><label className="flbl">Email Address *</label><input type="email" required className="fctrl" placeholder="you@email.com" /></div>
                    <div className="col-sm-6">
                      <label className="flbl">Number of Guests *</label>
                      <select className="fctrl" defaultValue="2 People">
                        <option>1 Person</option>
                        <option>2 People</option>
                        <option>3 - 4 People</option>
                        <option>5 - 6 People</option>
                        <option>7 - 10 People</option>
                        <option>10+ People</option>
                      </select>
                    </div>
                    <div className="col-sm-6"><label className="flbl">Date *</label><input type="date" required className="fctrl" /></div>
                    <div className="col-sm-6">
                      <label className="flbl">Time *</label>
                      <select className="fctrl" defaultValue="08:00 PM">
                        <option>12:00 PM</option>
                        <option>01:00 PM</option>
                        <option>02:00 PM</option>
                        <option>06:00 PM</option>
                        <option>07:00 PM</option>
                        <option>08:00 PM</option>
                        <option>09:00 PM</option>
                        <option>10:00 PM</option>
                        <option>11:00 PM</option>
                      </select>
                    </div>
                    <div className="col-12"><label className="flbl">Special Requests</label><textarea className="fctrl" rows="3" placeholder="Birthday, anniversary, high chair, dietary needs..."></textarea></div>
                    <div className="col-12"><button type="submit" className="btn-red w-100 justify-content-center" id="resBtn"><i className="fas fa-calendar-check me-1"></i>Confirm Reservation</button></div>
                  </div>
                </form>
                {resSubmitted && (
                  <div className="sucmsg d-flex mt-3" id="resOk" style={{ display: "flex" }}>
                    <i className="fas fa-check-circle me-2"></i>
                    <p className="mb-0">Table reserved at Feasto Jahanian! We will confirm via call/WhatsApp shortly.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BLOG ================= */}
      <section id="blog">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">News &amp; Updates</span>
            <h2 className="stitle">Feasto <span>Updates</span></h2>
            <div className="sline"></div>
          </div>
          <div className="row g-4">
            {[
              { title: "Grand Opening of Feasto at Yum Yum Tower Jahanian", author: "Feasto Team", comments: "48 Comments", day: "14", month: "Mar", tag: "Feasto News", img: "./img/blog/1.jpg" },
              { title: "Why Our Nashville Fried Chicken is Jahanian's Favorite", author: "Chef Marcus", comments: "32 Comments", day: "28", month: "Feb", tag: "Food & Taste", img: "./img/blog/2.jpg" },
              { title: "Secret Behind Our Freshly Smashed Beef Burgers", author: "Feasto Kitchen", comments: "26 Comments", day: "05", month: "Jan", tag: "Kitchen Secrets", img: "./img/blog/3.jpg" }
            ].map((blog, idx) => (
              <div key={blog.title} className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={idx * 80}>
                <div className="blcard">
                  <div className="blimg">
                    <img src={blog.img} alt="" loading="lazy" />
                    <div className="bldatebdg"><span className="bd">{blog.day}</span><span className="bm">{blog.month}</span></div>
                  </div>
                  <div className="blbody">
                    <div className="bltag">{blog.tag}</div>
                    <div className="bltit"><a href="#!">{blog.title}</a></div>
                    <div className="blmeta"><span><i className="fas fa-user"></i>{blog.author}</span><span><i className="fas fa-comment"></i>{blog.comments}</span></div>
                    <a href="#!" className="blmore">Read More <i className="fas fa-arrow-right"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. #newsletter section is REMOVED as requested */}

      {/* ================= 13. CONTACT (Client Info) ================= */}
      <section id="contact-section">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="slbl">Get In Touch</span>
            <h2 className="stitle">Contact <span>Feasto Jahanian</span></h2>
            <div className="sline"></div>
            <p className="sdesc mx-auto" style={{ maxWidth: "480px" }}>
              Have questions, catering requests, or order inquiries? Reach out to us directly in Jahanian.
            </p>
          </div>
          <div className="row g-4">
            {/* 13. ctdark replaced with client user info */}
            <div className="col-lg-4" data-aos="fade-right">
              <div className="ctdark">
                <h4>Let's Talk</h4>
                <p className="ctsub">Direct contact for orders, catering, and inquiries in Jahanian.</p>
                <div className="ctitem">
                  <div className="cticon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="ctinfo">
                    <strong>Address</strong>
                    <span>{STORE_CONFIG.location.fullAddress}</span>
                  </div>
                </div>
                <div className="ctitem">
                  <div className="cticon"><i className="fas fa-phone-alt"></i></div>
                  <div className="ctinfo">
                    <strong>Phone Call</strong>
                    <span><a href={`tel:${STORE_CONFIG.whatsappNumber}`} style={{ color: "inherit" }}>{STORE_CONFIG.phoneInternational}</a></span>
                  </div>
                </div>
                <div className="ctitem">
                  <div className="cticon"><i className="fab fa-whatsapp text-success"></i></div>
                  <div className="ctinfo">
                    <strong>WhatsApp Order</strong>
                    <span><a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>{STORE_CONFIG.phoneLocal}</a></span>
                  </div>
                </div>
                <div className="ctitem">
                  <div className="cticon"><i className="fas fa-envelope"></i></div>
                  <div className="ctinfo">
                    <strong>Email</strong>
                    <span>{STORE_CONFIG.email}</span>
                  </div>
                </div>
                <div className="ctitem">
                  <div className="cticon"><i className="fas fa-clock"></i></div>
                  <div className="ctinfo">
                    <strong>Working Hours</strong>
                    <span>{STORE_CONFIG.operatingHours.display}</span>
                  </div>
                </div>
                <div className="ctsocrow">
                  <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                  <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer" title="Instagram"><i className="fab fa-instagram"></i></a>
                  <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer" title="TikTok"><i className="fab fa-tiktok"></i></a>
                </div>
              </div>
            </div>
            <div className="col-lg-8" data-aos="fade-left">
              <div className="fcard">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                >
                  <div className="row g-3">
                    <div className="col-sm-6"><label className="flbl">Your Name *</label><input type="text" required className="fctrl" placeholder="Your Name" /></div>
                    <div className="col-sm-6"><label className="flbl">Email Address *</label><input type="email" required className="fctrl" placeholder="you@email.com" /></div>
                    <div className="col-sm-6"><label className="flbl">Phone Number *</label><input type="tel" required className="fctrl" placeholder="0300-XXXXXXX" /></div>
                    <div className="col-sm-6">
                      <label className="flbl">Subject *</label>
                      <select className="fctrl" defaultValue="General Inquiry">
                        <option>General Inquiry</option>
                        <option>Catering &amp; Party Orders</option>
                        <option>Home Delivery Question</option>
                        <option>Feedback &amp; Suggestions</option>
                      </select>
                    </div>
                    <div className="col-12"><label className="flbl">Message *</label><textarea className="fctrl" required rows="5" placeholder="Write your message here..."></textarea></div>
                    <div className="col-12"><button type="submit" className="btn-red" id="ctcBtn"><i className="fas fa-paper-plane me-1"></i>Send Message</button></div>
                  </div>
                </form>
                {contactSubmitted && (
                  <div className="sucmsg d-flex mt-3" id="ctcOk" style={{ display: "flex" }}>
                    <i className="fas fa-check-circle me-2"></i>
                    <p className="mb-0">Message sent! The Feasto Jahanian team will reply shortly.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 14, 15. FOOTER (Client Info & Removed Sarab Copyright) ================= */}
      <footer>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <img
                  src="./img/logo.jpg"
                  alt="Feasto Logo"
                  style={{
                    height: "46px",
                    width: "auto",
                    borderRadius: "8px",
                    objectFit: "contain",
                    background: "transparent"
                  }}
                />
                <div className="fnm mb-0">Feas<span>to</span></div>
              </div>
              <p className="fdesc">
                Yum Yum Tower, Ibrahim Town, Jahanian. Bringing world-class fast food flavors together in a fast, friendly, and delicious experience.
              </p>
              <div className="fsoc">
                <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
                <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                <a href={STORE_CONFIG.socialMedia.facebook} target="_blank" rel="noreferrer"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="ftit">Quick Links</div>
              <ul className="flinks ps-0">
                <li><a href="#hero"><i className="fas fa-chevron-right"></i>Home</a></li>
                <li><a href="#about"><i className="fas fa-chevron-right"></i>About Us</a></li>
                <li><a href="#menu"><i className="fas fa-chevron-right"></i>Our Menu</a></li>
                <li><a href="#cart"><i className="fas fa-chevron-right"></i>Food Cart</a></li>
                <li><a href="#reservation"><i className="fas fa-chevron-right"></i>Reservation</a></li>
                <li><a href="#contact-section"><i className="fas fa-chevron-right"></i>Contact</a></li>
              </ul>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="ftit">Our Menu</div>
              <ul className="flinks ps-0">
                <li><a href="#menu"><i className="fas fa-chevron-right"></i>Burgers</a></li>
                <li><a href="#menu"><i className="fas fa-chevron-right"></i>Pizza</a></li>
                <li><a href="#menu"><i className="fas fa-chevron-right"></i>Fried Chicken</a></li>
                <li><a href="#menu"><i className="fas fa-chevron-right"></i>Wraps &amp; Rolls</a></li>
                <li><a href="#menu"><i className="fas fa-chevron-right"></i>Pasta</a></li>
                <li><a href="#menu"><i className="fas fa-chevron-right"></i>Desserts</a></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <div className="ftit">Get In Touch</div>
              <div className="fci">
                <div className="fciico"><i className="fas fa-map-marker-alt"></i></div>
                <div className="fciinfo"><strong>Address</strong>{STORE_CONFIG.location.fullAddress}</div>
              </div>
              <div className="fci">
                <div className="fciico"><i className="fas fa-phone-alt"></i></div>
                <div className="fciinfo"><strong>Phone</strong>{STORE_CONFIG.phoneInternational}</div>
              </div>
              <div className="fci">
                <div className="fciico"><i className="fab fa-whatsapp text-success"></i></div>
                <div className="fciinfo"><strong>WhatsApp</strong>{STORE_CONFIG.phoneLocal}</div>
              </div>
              <div className="fci">
                <div className="fciico"><i className="fas fa-clock"></i></div>
                <div className="fciinfo"><strong>Hours</strong>{STORE_CONFIG.operatingHours.display}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="fbot">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              {/* 15. Sarab paragraph removed and replaced with clean Feasto copyright */}
              <p className="mb-0">
                &copy; {new Date().getFullYear()} <span>Feasto Jahanian</span>. All Rights Reserved. Delivered with <i className="fas fa-heart text-danger"></i> in Jahanian, Pakistan.
              </p>
              <div>
                <a href="#!">Dine-in</a>
                <a href="#!">Takeaway</a>
                <a href="#!">Home Delivery</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= BACK TO TOP BUTTON ================= */}
      <button
        id="btt"
        className={showBtt ? "show" : ""}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Scroll to top"
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* ================= FRAMER MOTION FLOATING ANIMATED CART BUTTON ================= */}
      <AnimatePresence>
        {totalCartCount > 0 && (
          <>
            {/* Top Right Flying Badge Animation */}
            {animateCart && (
              <motion.div
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -45, scale: 0.6 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: "24px",
                  right: "24px",
                  zIndex: 9999,
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  boxShadow: "0 4px 15px rgba(232,40,26,0.5)"
                }}
              >
                +1 Item Added!
              </motion.div>
            )}

            {/* Bottom Floating View Cart Button Bar */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => {
                const el = document.getElementById("cart");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  setIsCartDrawerOpen(true);
                }
              }}
              style={{
                position: "fixed",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9990,
                backgroundColor: "#25d366",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "50px",
                boxShadow: "0 10px 30px rgba(37, 211, 102, 0.45)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontWeight: "600",
                fontSize: "0.95rem"
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  color: "#25d366",
                  fontSize: "0.82rem",
                  fontWeight: "bold"
                }}
              >
                {totalCartCount}
              </span>
              <span>View Cart &bull; {STORE_CONFIG.currency} {grandTotal}</span>
              <i className="fas fa-arrow-right"></i>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= SLIDE-OVER CART DRAWER MODAL ================= */}
      {isCartDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "flex-end"
          }}
          onClick={() => setIsCartDrawerOpen(false)}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "100%",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.25)"
            }}
          >
            {/* Drawer Header */}
            <div
              className="d-flex justify-content-between align-items-center p-3 border-bottom"
              style={{ backgroundColor: "var(--dark)", color: "#fff" }}
            >
              <h5 className="mb-0 text-white font-bold" style={{ fontSize: "1.1rem" }}>
                <i className="fas fa-shopping-cart text-danger me-2"></i>Your Feasto Cart ({totalCartCount})
              </h5>
              <button
                className="btn btn-sm text-white"
                onClick={() => setIsCartDrawerOpen(false)}
                style={{ fontSize: "1.2rem" }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-grow-1 p-3 overflow-auto">
              {cart.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
                  <h5>Your cart is empty</h5>
                  <p className="text-muted small">Add your favorite items from the menu!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center justify-content-between p-2 rounded border"
                      style={{ background: "#fcfcfc" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.img}
                          alt={item.name}
                          style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                        />
                        <div>
                          <div className="fw-bold" style={{ fontSize: "0.88rem" }}>{item.name}</div>
                          <div className="text-muted small">{STORE_CONFIG.currency} {item.price} each</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center"
                          style={{ background: "#eee", borderRadius: "20px", padding: "2px 6px" }}
                        >
                          <button
                            className="btn btn-sm p-0"
                            onClick={() => updateCartQty(item.id, -1)}
                            style={{ width: "20px" }}
                          >
                            -
                          </button>
                          <span className="small fw-bold px-1">{item.qty}</span>
                          <button
                            className="btn btn-sm p-0"
                            onClick={() => updateCartQty(item.id, 1)}
                            style={{ width: "20px" }}
                          >
                            +
                          </button>
                        </div>
                        <span className="fw-bold text-danger small" style={{ minWidth: "60px", textAlign: "right" }}>
                          {STORE_CONFIG.currency} {item.price * item.qty}
                        </span>
                        <button
                          className="btn btn-sm text-secondary p-0 ms-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-3 border-top bg-light">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total:</span>
                  <span className="fw-bold text-danger" style={{ fontSize: "1.15rem" }}>
                    {STORE_CONFIG.currency} {grandTotal}
                  </span>
                </div>
                <button
                  className="btn btn-danger w-100 py-2 mb-2 fw-bold"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    const el = document.getElementById("cart");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <i className="fas fa-clipboard-list me-1"></i>Fill Address &amp; Order
                </button>
                <button
                  className="btn w-100 py-2 fw-bold text-white"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    handleWhatsAppCheckout();
                  }}
                  style={{ backgroundColor: "#25d366" }}
                >
                  <i className="fab fa-whatsapp me-1"></i>Quick WhatsApp Checkout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

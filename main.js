const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const cone = c => `
  <svg viewBox="0 0 100 150">
    <path d="M22 70h56L50 145z" fill="#E8B56A"/>
    <path d="M32 82l36 0M38 98l24 0" stroke="#C98F45" stroke-width="3"/>
    <circle cx="50" cy="52" r="34" fill="${c}"/>
    <ellipse cx="38" cy="38" rx="9" ry="6" fill="#fff" opacity=".5"/>
  </svg>
`;

const COL = ["#6EC6FF", "#FFF1C9", "#6B4A3A", "#FF8FB1", "#FFB938", "#D98A2B"];

// EDIT: product images, details & prices
const PRODUCTS = [
  {
    name: "Delight Tub",
    description: "Our creamy Milk Candy ice cream in a 750ml family tub, made for sharing with everyone at home.",
    price: "₹150",
    image: "image/tub.webp",
    alt: "Milk Candy Delight Tub family pack",
    tag: "Family pack",
    featured: true,
  },
  {
    name: "Milk Candy",
    description: "Our signature ice cream featuring authentic milk candy pieces in creamy vanilla base.",
    price: "₹20",
    image: "image/milk-candy.png",
    alt: "Milk Candy bar",
    tag: "Best Seller",
    featured: true,
  },
  {
    name: "Vanilla Ice Cream",
    description: "Smooth and creamy classic.",
    price: "₹10",
    image: "image/vanilla.jpg",
    alt: "Milk Candy vanilla ice cream",
  },
  {
    name: "Strawberry Ice Cream",
    description: "Sweet, fruity and fresh.",
    price: "₹10",
    image: "image/strawberry.jpg",
    alt: "Milk Candy strawberry ice cream",
  },
  {
    name: "Chocolate Ice Cream",
    description: "Rich cocoa in every bite.",
    price: "₹10",
    image: "image/chocolate.jpg",
    alt: "Milk Candy chocolate ice cream",
  },
];

// EDIT: distributors by district (placeholders)
const D = (n, c) =>
  Array.from({ length: c }, (_, i) => ({
    name: `Distributor ${i + 1} (placeholder)`,
    loc: n,
    ph: "+91 XXXXX XXXXX",
  }));

const DIST = {
  Aizawl: [
    { name: "Milk Candy office", loc: "Aizawl", ph: "+91 89748 61315" },
  ],
  Lunglei: [
    { name: "Thlamuana", loc: "Lunglei", ph: "+91 9324663493" },
  ],
  Champhai:  [
    { name: "Sang  Sang Ice Cream", loc: "Champhai", ph: "+91 82599 33978" },
     { name: "Thartei, Zotlang", loc: "Champhai", ph: "+91 76279 10469" },
  
  ],
  Serchhip: [
    { name: "Ngaihawmi", loc: "Serchhip", ph: "+91 90898 15229" },
     { name: "Rengluaia, Serchhip North", loc: "Serchhip", ph: "+91 98627 26168" },
  ],
  Kolasib: [
    { name: "Dingpuii, Kolasib Vengthar", loc: "Kolasib", ph: "+91 98623 35020" },
     { name: "Masangi, Kolasib Venglai", loc: "Kolasib", ph: "+91 98636 55130" },
      { name: "Thakimi", loc: "Kolasib", ph: "+91 87874 65172" },
  ],
  Lawngtlai: [
    { name: "Mahmingi", loc: "Lawngtlai", ph: "+91 69090 90515" },
  ],
  Mamit: [
    { name: "LV Store", loc: "Mamit", ph: "+91 98628 03586" },
  ],
  Khawzawl: [
    { name: "Mahlimi", loc: "Khawzawl", ph: "+91 98626 47486" },
  ],
};

addEventListener("load", () =>
  setTimeout(() => $("#loader").classList.add("off"), 150),
);

$$("[data-cone]").forEach(
  e => (e.innerHTML = cone(COL[+e.dataset.cone % 3 == 0 ? 0 : +e.dataset.cone % 3 == 1 ? 3 : 4])),
);

const pg = document.body.dataset.page;
$$("#menu a").forEach(a => a.dataset.p === pg && a.classList.add("act"));

$("#burger").onclick = () => $("#menu").classList.toggle("open");

addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#prog").style.width = (scrollY / (h.scrollHeight - innerHeight)) * 100 + "%";
  $("#top").classList.toggle("show", scrollY > 500);
});

$("#top").onclick = () => scrollTo({ top: 0 });

const io = new IntersectionObserver(
  es =>
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.15 },
);

$$(".rv").forEach(e => io.observe(e));

// counters
const co = new IntersectionObserver(es =>
  es.forEach(e => {
    if (!e.isIntersecting) return;
    co.unobserve(e.target);

    const n = +e.target.dataset.n;
    const s = e.target.dataset.s;
    let t0;

    const f = t => {
      t0 ??= t;
      const p = Math.min((t - t0) / 1500, 1);
      e.target.textContent = Math.floor(n * p) + (p == 1 ? s : "");
      p < 1 && requestAnimationFrame(f);
    };

    requestAnimationFrame(f);
  }),
);

$$("[data-n]").forEach(e => co.observe(e));

// hero slider
if ($("#hero")) {
  const heroMedia = matchMedia("(min-width: 760px)");
  const loadHeroImages = () => {
    if (!heroMedia.matches) return;
    $$(".slide img", $("#hero")).forEach(img => {
      if (!img.dataset.src) return;
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  };
  loadHeroImages();
  heroMedia.addEventListener("change", loadHeroImages);

  const sl = $$(".slide");
  const dots = $("#dots");
  let i = 0;
  let t;

  sl.forEach((_, k) => {
    const b = document.createElement("button");
    b.ariaLabel = "Slide " + (k + 1);
    b.onclick = () => go(k);
    dots.append(b);
  });

  const go = k => {
    i = (k + sl.length) % sl.length;
    sl.forEach((s, j) => s.classList.toggle("on", j == i));
    $$("button", dots).forEach((b, j) => b.classList.toggle("on", j == i));
    clearInterval(t);
    t = setInterval(() => go(i + 1), 4000);
  };

  $("#pv").onclick = () => go(i - 1);
  $("#nx").onclick = () => go(i + 1);
  go(0);

  // 3D carousel
  const st = $("#stage");
  const ring = document.createElement("div");
  ring.className = "ring";
  st.append(ring);

  const n = 5;
  const R = Math.round(135 / Math.tan(Math.PI / n)) + 60;

  const cards = PRODUCTS.map((p, k) => {
    const c = document.createElement("div");
    c.className = `pc${p.featured ? " pc-featured" : ""}`;
    c.innerHTML = `
      <div class="product-image">
        <img src="${p.image}" alt="${p.alt}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
      </div>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <span class="price">${p.price}</span>
      <p class="product-availability">Find at a nearby store</p>
    `;
    c.style.transform = `rotateY(${k * 72}deg) translateZ(${R}px)`;
    c.onclick = () => {
      const current = ((a % n) + n) % n;
      let direction = (k - current + n) % n;
      if (direction > n / 2) direction -= n;
      a += direction;
      spin();
    };
    ring.append(c);
    return c;
  });

  let a = 0;
  let pause = false;

  const spin = () => {
    ring.style.transform = `translateZ(-${R}px) rotateY(${-a * 72}deg)`;
    cards.forEach((c, k) => {
      const f = k == ((a % n) + n) % n;
      c.classList.toggle("front", f);
      c.style.transform = `rotateY(${k * 72}deg) translateZ(${R}px) scale(${f ? 1.12 : 0.85})`;
      c.style.opacity = f ? 1 : 0.7;
    });
  };

  spin();
  $("#product-prev").onclick = () => {
    a -= 1;
    spin();
  };
  $("#product-next").onclick = () => {
    a += 1;
    spin();
  };

  setInterval(() => {
    if (!pause) {
      a += 1;
      spin();
    }
  }, 3000);

  st.onmouseenter = () => (pause = true);
  st.onmouseleave = () => (pause = false);

  // distributors
  const ch = $("#chips");
  const dl = $("#dlist");

  Object.keys(DIST).forEach((d, k) => {
    const b = document.createElement("button");
    b.textContent = d;
    b.onclick = () => show(d);
    ch.append(b);
  });

  const show = d => {
    $$("button", ch).forEach(b => b.classList.toggle("on", b.textContent == d));
    dl.innerHTML = DIST[d]
      .map(
        x =>
          `<div class="card glass"><h3>${x.name}</h3><p>${x.loc}, Mizoram</p><a href="tel:${x.ph.replace(/\s/g, "")}">${x.ph}</a></div>`,
      )
      .join("");
  };

  show("Aizawl");

  // FAQ
  $$(".fq button").forEach(
    b =>
      (b.onclick = () => {
        const q = b.parentNode;
        const fa = $(".fa", q);
        const o = q.classList.toggle("open");
        fa.style.maxHeight = o ? fa.scrollHeight + "px" : 0;
      }),
  );
}

// contact form
const cf = $("#cf");

if (cf) {
  cf.onsubmit = async e => {
    e.preventDefault();

    const b = $("#sb");
    const m = $("#msg");
    b.disabled = true;
    b.textContent = "Sending...";
    m.className = "";
    m.textContent = "";

    try {
      const r = await fetch(cf.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(cf),
      });
      const j = await r.json();

      if (j.success) {
        m.className = "ok";
        m.textContent = "Thank you! Your message has been sent.";
        cf.reset();
      } else {
        throw 0;
      }
    } catch (_) {
      m.className = "err";
      m.textContent =
        "Could not send your message. Check your connection or the access key and try again.";
    }

    b.disabled = false;
    b.textContent = "Send message";
  };
}

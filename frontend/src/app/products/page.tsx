"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  desc: string;
  details: string;
  tag: string;
  rating: number;
}

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Sky Shell - 120 Shots",
    category: "Elite Series",
    subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=600&auto=format&fit=crop",
    desc: "High-flying multi-shot shell painting the sky with colorful starburst patterns.",
    details: "This massive 120-shot high-altitude display shell cake fires consecutively in rapid intervals, filling the night sky with brilliant red, green, and blue willow drops. Crafted with zero child labor, it features a dual safety fuse assembly and stable ground baseplate to prevent tipping.",
    tag: "Bestseller",
    rating: 5,
  },
  {
    id: "p2",
    name: "Peacock Fountain",
    category: "Fountains",
    subcategory: "Fountains",
    image: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=600&auto=format&fit=crop",
    desc: "Dazzling spray of golden and silver sparks rising to a height of 10 feet.",
    details: "Emits a high-density, low-smoke spray of glowing gold sparks that slowly transitions into a glittering peacock-tail feather shape of green and yellow sparks. Made with eco-friendly chemical binders to reduce smoke by up to 30%.",
    tag: "Popular",
    rating: 5,
  },
  {
    id: "p3",
    name: "Tri-Color Sparklers",
    category: "Traditional Crackers",
    subcategory: "Sparklers",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
    desc: "Classic hand-held wire sparklers casting red, green, and gold colors.",
    details: "Premium extra-long burning wire sparklers designed specifically for children. They feature cold-spark chemical formulas that emit bright colored lights without producing high thermal heat, making them incredibly safe to hold.",
    tag: "Kid Safe",
    rating: 5,
  },
  {
    id: "p4",
    name: "Whistling Ground Chakra",
    category: "Traditional Crackers",
    subcategory: "Chakras",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    desc: "Fast circular floor spinner emitting whistling soundscapes and silver sparks.",
    details: "Spinning chakra that spins rapidly on the ground, creating concentric rings of silver sparks and a sharp whistling whistle tone on ascent. Built with double-thickness paper casings to prevent fracturing during spins.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p5",
    name: "Diwali Celebration Box",
    category: "Gift Boxes",
    subcategory: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    desc: "Premium curated assortment of sparklers, fountains, and ground spinners.",
    details: "The ultimate festive package. Curated with family safety in mind, it contains 25 items including colored sparklers, flower pots, ground chakras, and mild-sound novelty crackers. Enclosed in a humidity-protective gift box.",
    tag: "Premium",
    rating: 5,
  },
  {
    id: "p6",
    name: "Glittering Flower Pot",
    category: "Traditional Crackers",
    subcategory: "Flower Pots",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600&auto=format&fit=crop",
    desc: "Cone pot emitting eruption showers of colored sparks and crackling pops.",
    details: "A classic cone fountain that shoots sparkling stars up to 8 feet high. The spray begins as solid gold and erupts into multi-colored crackling star points. Made with low-nitrate powder to decrease smoke emissions.",
    tag: "Traditional",
    rating: 4,
  },
  {
    id: "p7",
    name: "Golden Willow Rocket",
    category: "Aerial Novelties",
    subcategory: "Rockets",
    image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?q=80&w=600&auto=format&fit=crop",
    desc: "High soaring rocket that whistles on ascent and explodes into stars.",
    details: "High-flying rocket that ascends with a sharp whistling fuse trail and detonates into a golden weeping willow canopy at 150 feet. Equipped with a balanced guide stick to ensure perfectly vertical flight paths.",
    tag: "New Launch",
    rating: 5,
  },
  {
    id: "p8",
    name: "Silver Shower Fountain",
    category: "Fountains",
    subcategory: "Fountains",
    image: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=600&auto=format&fit=crop",
    desc: "Dense shower of silver volcanic sparks shooting up to 8 feet high.",
    details: "Volcanic-style cone pot that creates a dense, bright silver shower of light. Features a long ignition fuse and double-walled thermal packaging to ensure safety during launch.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p9",
    name: "Crimson Red Sparklers",
    category: "Traditional Crackers",
    subcategory: "Sparklers",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
    desc: "Elegant hand-held wire sparklers casting intense ruby red sparks.",
    details: "Hand-held sparklers that burn with an intense crimson red hue. Made using low-ash chemical recipes to prevent hot particles from falling onto hands, ensuring a safe experience for celebrations.",
    tag: "Eco Friendly",
    rating: 5,
  },
  {
    id: "p10",
    name: "Spinning Star Wheel",
    category: "Traditional Crackers",
    subcategory: "Chakras",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    desc: "Concentric rings of bright gold sparks spinning smoothly on flat grounds.",
    details: "Traditional ground spinner wheel. It whirls at high speed, casting gold and yellow sparks in a uniform circle. Features high-grade clay plugs to ensure the card spins flat on concrete.",
    tag: "Traditional",
    rating: 4,
  },
  {
    id: "p11",
    name: "Elite Sky Shell Cake - 50 Shots",
    category: "Elite Series",
    subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=600&auto=format&fit=crop",
    desc: "High altitude multi-shot cake throwing crackling chrysanthemums.",
    details: "A premium 50-shot cake throwing high-altitude shells that detonate into crackling chrysanthemum patterns. Equipped with safety feet and a broad base template to guarantee zero ground wobble.",
    tag: "Bestseller",
    rating: 5,
  },
  {
    id: "p12",
    name: "Golden Peacock Flower Pot",
    category: "Traditional Crackers",
    subcategory: "Flower Pots",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600&auto=format&fit=crop",
    desc: "Eruption cone fountain casting golden sparks up to 6 feet.",
    details: "Large cone pot. It ignites with a mild crackle, generating a dense cone fountain of bright gold stars. Formulated with charcoal powder to reduce particulate emissions by up to 25%.",
    tag: "Popular",
    rating: 5,
  },
  {
    id: "p13",
    name: "Neon Green Sparklers",
    category: "Traditional Crackers",
    subcategory: "Sparklers",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
    desc: "Safe hand-held sparklers throwing bright neon green starbursts.",
    details: "Hand-held green sparklers. The cold-spark formula burns slowly with zero ash fallout, making it ideal for festival photos and child-safe celebrations.",
    tag: "Kid Safe",
    rating: 4,
  },
  {
    id: "p14",
    name: "Musical Sky Rocket",
    category: "Aerial Novelties",
    subcategory: "Rockets",
    image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?q=80&w=600&auto=format&fit=crop",
    desc: "Rocket soaring with whistle and detonating with a sharp sound report.",
    details: "Fast rocket that climbs with a loud whistling tail, exploding into silver strobe points at 120 feet. Equipped with a sturdy wooden guide stick to prevent erratic flight patterns.",
    tag: "New Launch",
    rating: 5,
  },
  {
    id: "p15",
    name: "Volcanic Ash Fountain",
    category: "Fountains",
    subcategory: "Fountains",
    image: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=600&auto=format&fit=crop",
    desc: "Cascading sparks rising in volcanic waves of gold and silver.",
    details: "Fountain styling resembling a volcanic vent. It shoots dense gold sparks transitioning to silver crackling points. Built with double-thickness cardboard to ensure steady pressure.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p16",
    name: "Whirling Red Chakra",
    category: "Traditional Crackers",
    subcategory: "Chakras",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    desc: "Rapid spinner releasing concentric red spark circles on ground floors.",
    details: "Rapid ground chakra. Spins on a flat surface, casting rings of ruby red sparks. Formulated using clay plugs and balanced paper wings to prevent tipping.",
    tag: "Traditional",
    rating: 5,
  },
  {
    id: "p17",
    name: "Wedding Special Assortment",
    category: "Gift Boxes",
    subcategory: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    desc: "Curated premium box containing sparkles, fountains, and high-altitude cakes.",
    details: "Perfect for marriage events. It compiles elite colored sparklers, massive 50-shot sky cakes, golden fountains, and whistling ground chakras into a single humidity-resistant package.",
    tag: "Premium",
    rating: 5,
  },
  {
    id: "p18",
    name: "Crackling Chrysanthemum Pot",
    category: "Traditional Crackers",
    subcategory: "Flower Pots",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600&auto=format&fit=crop",
    desc: "Cone fountain emitting dense golden crackles up to 7 feet.",
    details: "Classic cone shape. Erupts with a series of loud, crackling gold sparks that replicate chrysanthemums. Built with a broad safety base for stable operations.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p19",
    name: "Screaming Strobe Shell - 25 Shots",
    category: "Elite Series",
    subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=600&auto=format&fit=crop",
    desc: "High altitude cake casting silver blinking strobe points.",
    details: "A 25-shot aerial display. Launches silver shells that whistle loudly on climb and burst into blinking strobe patterns. Features strict chemical ratios to lower post-blast smoke.",
    tag: "New Launch",
    rating: 5,
  },
  {
    id: "p20",
    name: "Concentric Gold Spinner",
    category: "Traditional Crackers",
    subcategory: "Chakras",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    desc: "Floor spinner casting gold rings and cracking star points on concrete.",
    details: "Spins with a loud hum, casting gold rings and crackles. Made using a high-density paper frame to ensure complete combustion with zero card residue.",
    tag: "Traditional",
    rating: 4,
  },
  {
    id: "p21",
    name: "Mega Comet Shell - 100 Shots",
    category: "Elite Series",
    subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=600&auto=format&fit=crop",
    desc: "High-flying multi-shot comet cake painting the sky in bright yellow stars.",
    details: "A premium 100-shot aerial cake. It throws yellow comet stars that rise to 120 feet in rapid sequence. Features a sturdy timber baseplate to prevent movement.",
    tag: "Bestseller",
    rating: 5,
  },
  {
    id: "p22",
    name: "Golden Twinkling Stars",
    category: "Traditional Crackers",
    subcategory: "Twinkling Stars",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600&auto=format&fit=crop",
    desc: "Sparkling sticks throwing golden blinking points mimicking starry nights.",
    details: "Safety firework sticks designed for hand-held fun. They produce rapid strobe blinking flashes of warm gold lights. Crafted with low-heat formulas to protect hands.",
    tag: "Kid Safe",
    rating: 5,
  },
  {
    id: "p23",
    name: "Cold Spark Sparklers",
    category: "Traditional Crackers",
    subcategory: "Sparklers",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
    desc: "Safe hand-held wire sparklers casting gold sparks with zero heat.",
    details: "Hand-held sparklers. The cold-spark technology burns without heat or ash fallout, making it the safest sparkler for children's festivals.",
    tag: "Kid Safe",
    rating: 5,
  },
  {
    id: "p24",
    name: "Mega Sound Ground Cracker",
    category: "Traditional Crackers",
    subcategory: "Ground",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop",
    desc: "Traditional explosive paper wrap firing loud sonic reports on the ground.",
    details: "A classic sound cracker pack. Features high-purity composition to create sharp, single-blast reports for festive celebration vibes. Plugs are securely sealed with heavy-duty clay.",
    tag: "Bestseller",
    rating: 4,
  },
  {
    id: "p25",
    name: "Elite Festival Assortment",
    category: "Gift Boxes",
    subcategory: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    desc: "Curated premium box containing sparklers, fountains, chakras, and rockets.",
    details: "A premium assortment package. Contains 30 items including colored sparklers, volcanic fountains, ground chakras, and high-altitude rockets. Sealed in a moisture-resistant storage container.",
    tag: "Premium",
    rating: 5,
  },
  {
    id: "p26",
    name: "Silver Twinkling Stars",
    category: "Traditional Crackers",
    subcategory: "Twinkling Stars",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600&auto=format&fit=crop",
    desc: "Long metal sticks casting bright silver twinkling flashes in the dark.",
    details: "A pack of 10 twinkling sparkler sticks. Emit brilliant, diamond-white strobe sparks with lower smoke residues, creating beautiful photo backgrounds.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p27",
    name: "Screaming Comet Rocket",
    category: "Aerial Novelties",
    subcategory: "Rockets",
    image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?q=80&w=600&auto=format&fit=crop",
    desc: "Rocket soaring with whistle and detonating with a gold willow burst.",
    details: "Soars vertically with a loud whistle, exploding into a golden willow pattern at 130 feet. Equipped with a balanced guide stick to ensure vertical trajectories.",
    tag: "New Launch",
    rating: 5,
  },
  {
    id: "p28",
    name: "Classic Laxmi Bomb",
    category: "Traditional Crackers",
    subcategory: "Ground",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop",
    desc: "Green thread-wrapped explosive cracker producing loud single reports.",
    details: "The most respected sound cracker in Sivakasi. Packed with safe chemical blends and bound with natural jute thread wraps to ensure consistent fuse combustion heights.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p29",
    name: "Electric Blue Sparklers",
    category: "Traditional Crackers",
    subcategory: "Sparklers",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
    desc: "Hand-held wire sparklers casting intense neon blue sparks.",
    details: "Hand-held sparklers burning with a vivid blue color. The cold-spark recipe ensures safe operation with minimal smoke and zero hot ash fallout.",
    tag: "Eco Friendly",
    rating: 5,
  },
  {
    id: "p30",
    name: "Concentric Red Wheel",
    category: "Traditional Crackers",
    subcategory: "Chakras",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    desc: "Floor wheel spinning rapidly and throwing bright ruby red sparks.",
    details: "Spins with a loud hum, casting rings of red sparks. Formulated using clay plugs and a balanced frame to ensure it stays flat during high-speed rotation.",
    tag: "Traditional",
    rating: 4,
  },
  {
    id: "p31",
    name: "Sonic Boom Crackers Cake",
    category: "Elite Series",
    subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=600&auto=format&fit=crop",
    desc: "Multi-shot aerial cake throwing loud crackling star shells consecutively.",
    details: "A 50-shot aerial cake. Throws cracking chrysanthemum shells that explode consecutively at 100 feet. Features safety feet and a broad base plate to ensure zero wobble.",
    tag: "New Launch",
    rating: 5,
  },
  {
    id: "p32",
    name: "Multi-Color Pencil Candles",
    category: "Traditional Crackers",
    subcategory: "Pencil Candles",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600&auto=format&fit=crop",
    desc: "Pencil-shaped crackers emitting continuous colored fire lines.",
    details: "Classic pencil candle crackers. Once lit from the top, they throw a steady colored fire line that shifts colors from red to green and yellow. Zero explosive sound.",
    tag: "Kid Safe",
    rating: 4,
  },
  {
    id: "p33",
    name: "Kids Specialty Box",
    category: "Gift Boxes",
    subcategory: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    desc: "Curated selection of hand-held sparklers, cold fountains, and spinner chakras.",
    details: "Assortment box curated for kids. Contains 20 items including color sparklers, whistling chakras, and soundless fountains. Packaged in a heavy-duty humidity-resistant box.",
    tag: "Premium",
    rating: 5,
  },
  {
    id: "p34",
    name: "High-Altitude Strobe Rocket",
    category: "Aerial Novelties",
    subcategory: "Rockets",
    image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?q=80&w=600&auto=format&fit=crop",
    desc: "Rocket soaring vertically and exploding into blinking silver strobe stars.",
    details: "Soars to 140 feet with a whistling trail, exploding into silver strobes. Equipped with a balanced guide stick to guarantee vertical flight trajectories.",
    tag: "Bestseller",
    rating: 5,
  },
  {
    id: "p35",
    name: "Cascading Gold Fountain",
    category: "Fountains",
    subcategory: "Fountains",
    image: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=600&auto=format&fit=crop",
    desc: "Fountain throwing dense golden sparks rising up to 7 feet.",
    details: "Cone-shaped fountain throwing gold sparks. Formulated using charcoal powder to reduce particulate emissions by up to 25% while keeping the sparks bright.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p36",
    name: "Musical Candle Sparkler",
    category: "Traditional Crackers",
    subcategory: "Pencil Candles",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600&auto=format&fit=crop",
    desc: "Glow candles that release sparkling stars while whistling mild musical notes.",
    details: "A safety pencil candle variation. Fires glittering gold stars and plays a mild musical tone as the fuse progresses. Safe to plant into flower beds.",
    tag: "Popular",
    rating: 4,
  },
  {
    id: "p37",
    name: "Golden Strobe Shell Cake - 30 Shots",
    category: "Elite Series",
    subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=600&auto=format&fit=crop",
    desc: "Aerial cake throwing gold willow shells with blinking strobe effects.",
    details: "A 30-shot aerial cake. Throws shells that burst into golden willow shapes with blinking strobes. Equipped with safety feet and a broad base plate for stability.",
    tag: "New Launch",
    rating: 5,
  },
  {
    id: "p38",
    name: "1000 Wala Garland Crackers",
    category: "Traditional Crackers",
    subcategory: "Garland Crackers",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop",
    desc: "Premium long string garland chain of 1000 crackers firing in sequence.",
    details: "Heavy garland chain cracker. Ignites a rhythmic sound cascade that runs consecutively for 45 seconds. Constructed with thick paper wrapping to avoid loose casing debris.",
    tag: "Bestseller",
    rating: 5,
  },
  {
    id: "p39",
    name: "100 Wala Garland Crackers",
    category: "Traditional Crackers",
    subcategory: "Garland Crackers",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop",
    desc: "Medium length chain garland of 100 crackling firecrackers.",
    details: "A 100-count garland string cracker. Perfect for short celebrations, it fires a crisp set of sequential sounds. Fitted with a secure safety fuse connector.",
    tag: "Traditional",
    rating: 4,
  },
  {
    id: "p40",
    name: "Grand Wedding Assortment Box",
    category: "Gift Boxes",
    subcategory: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    desc: "Curated premium box containing elite sparklers, fountains, and high-altitude cakes.",
    details: "Premium marriage celebration package. Contains 40 items including colored sparklers, volcanic fountains, ground chakras, and high-altitude rockets. Packaged in a heavy-duty box.",
    tag: "Premium",
    rating: 5,
  },
];

interface LocalProductCardProps {
  product: Product;
  onClick: (e: React.MouseEvent) => void;
}

function LocalProductCard({ product, onClick }: LocalProductCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let sparks: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }[] = [];
    let isHovering = false;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const createSpark = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      const maxLife = Math.random() * 20 + 15;
      const color = `hsla(${Math.floor(Math.random() * 30) + 15}, 100%, 65%, `;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        color,
      });
    };

    const parent = canvas.parentElement;
    const handleMouseEnter = () => { isHovering = true; };
    const handleMouseLeave = () => { isHovering = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      const rect = canvas.getBoundingClientRect();
      createSpark(e.clientX - rect.left, e.clientY - rect.top);
    };

    if (parent) {
      parent.addEventListener("mouseenter", handleMouseEnter);
      parent.addEventListener("mouseleave", handleMouseLeave);
      parent.addEventListener("mousemove", handleMouseMove);
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHovering && Math.random() < 0.25) {
        createSpark(Math.random() * canvas.width, Math.random() * canvas.height);
      }

      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        const alpha = s.life / s.maxLife;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = s.color + alpha + ")";
        ctx.fill();

        return s.life > 0;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mouseenter", handleMouseEnter);
        parent.removeEventListener("mouseleave", handleMouseLeave);
        parent.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="rounded-3xl bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-4 shadow-lg hover:shadow-2xl hover:border-orange-500/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-[430px] select-none group relative overflow-hidden cursor-pointer"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="space-y-4 relative z-10">
        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {product.tag && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
              {product.tag}
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mt-0.5">
                  {product.subcategory}
                </span>
              )}
            </div>
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: product.rating }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2">
            {product.desc}
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-end">
        <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-300">
          View & Enquire
        </span>
      </div>
    </div>
  );
}

function ProductsCatalog() {
  const searchParams = useSearchParams();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const itemsPerPage = 20;

  const categories = [
    "All",
    "Traditional Crackers",
    "Elite Series",
    "Fountains",
    "Aerial Novelties",
    "Gift Boxes",
  ];

  const subcategoriesList = [
    "All",
    "Ground",
    "Chakras",
    "Sparklers",
    "Twinkling Stars",
    "Pencil Candles",
    "Flower Pots",
    "Garland Crackers",
  ];

  // Capture URL search parameters on load/change
  useEffect(() => {
    const cat = searchParams.get("category");
    const subcat = searchParams.get("subcategory");

    if (cat) {
      // Handle casing variations
      const foundCat = categories.find(
        (c) => c.toLowerCase() === decodeURIComponent(cat).toLowerCase()
      );
      if (foundCat) {
        setActiveCategory(foundCat);
      }
    } else {
      setActiveCategory("All");
    }

    if (subcat) {
      const decodedSub = decodeURIComponent(subcat);
      // chakra vs chakkras spelling matching
      const matchedSub = subcategoriesList.find(
        (s) =>
          s.toLowerCase() === decodedSub.toLowerCase() ||
          (s === "Chakras" && decodedSub.toLowerCase() === "chakkras")
      );
      if (matchedSub) {
        setActiveSubcategory(matchedSub);
      } else {
        setActiveSubcategory(decodedSub);
      }
    } else {
      setActiveSubcategory("All");
    }
  }, [searchParams]);

  // Reset pagination on filters trigger
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSubcategory, searchQuery]);

  // Handle active subcategory reset on category tab change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory("All");
  };

  // Filtering Logic
  const filteredProducts = mockProducts.filter((product) => {
    // 1. Category Filter Match
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    // 2. Subcategory Filter Match (only applies if activeCategory is Traditional Crackers)
    const matchesSubcategory =
      activeCategory !== "Traditional Crackers" ||
      activeSubcategory === "All" ||
      product.subcategory.toLowerCase() === activeSubcategory.toLowerCase() ||
      (activeSubcategory === "Chakras" && product.subcategory.toLowerCase() === "chakkras");

    // 3. Search Bar Match
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardClick = (product: Product, e: React.MouseEvent) => {
    window.dispatchEvent(
      new CustomEvent("trigger-firework", {
        detail: {
          x: e.clientX,
          y: e.clientY,
          type: "crackle",
        },
      })
    );
    setSelectedProduct(product);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative">
      
      <FireworksCanvas />

      {/* SECTION 1: BREADCRUMB HERO */}
      <section className="relative w-full py-32 flex items-center justify-center overflow-hidden z-20 bg-zinc-950">
        <BreadcrumbCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-0" />

        <div className="absolute inset-0 overflow-hidden z-0 opacity-40 pointer-events-none">
          <div className="absolute bottom-10 left-1/4 h-2 w-2 rounded-full bg-orange-500 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute top-1/4 right-1/3 h-3 w-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDuration: "2s" }} />
          <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" style={{ animationDuration: "4s" }} />
        </div>

        <div className="max-w-[1600px] mx-auto w-full text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10 relative">
          <div className="flex justify-center animate-slide-up-fade">
            <nav className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/5 dark:bg-black/40 border border-white/10 dark:border-zinc-800 backdrop-blur-md rounded-full shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-500 select-none group">
              <Link href="/" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-orange-400 transition-colors group/home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500 transition-all duration-300 group-hover/home:scale-110 group-hover/home:rotate-12">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                <span>Home</span>
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5 text-zinc-600 transition-transform duration-300 group-hover:translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span>Products</span>
              </div>
            </nav>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Pyro Catalog
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade" style={{ animationDelay: "200ms" }}>
            Browse through our extensive range of safe, certified, and eco-friendly fireworks. Search, filter, and enquire to light up your special events.
          </p>
        </div>
      </section>

      {/* SECTION 2: SEARCH, FILTER, AND PRODUCTS PANEL */}
      <section className="relative w-full py-16 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 relative z-30">
            
            {/* COLUMN 1: LEFT SIDEBAR FILTERS (Sticky) */}
            <div className="w-full lg:w-[280px] flex-shrink-0">
              <div className="bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-3xl p-6 space-y-8 lg:sticky lg:top-28 h-fit shadow-lg text-left">
                
                {/* Search Bar Block */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                    Search Products
                  </h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search catalog..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 shadow-inner"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                    </svg>
                  </div>
                </div>

                {/* Vertical Categories Block */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                    Categories
                  </h4>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat, idx) => {
                      const isActive = activeCategory === cat;
                      return (
                        <div key={idx} className="space-y-1">
                          <button
                            onClick={() => handleCategoryChange(cat)}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                              isActive
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-md shadow-orange-500/10"
                                : "bg-zinc-50/50 dark:bg-black/20 border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300/80 dark:hover:border-white/10"
                            }`}
                          >
                            <span>{cat}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isActive 
                                ? "bg-white/20 text-white" 
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                            }`}>
                              {cat === "All" 
                                ? mockProducts.length 
                                : mockProducts.filter((p) => p.category === cat).length
                              }
                            </span>
                          </button>

                          {/* Accordion Submenu for Traditional Crackers */}
                          {cat === "Traditional Crackers" && isActive && (
                            <div className="pl-4 pt-1 pb-2 space-y-1.5 border-l border-zinc-200 dark:border-zinc-800 ml-4 mt-1">
                              {subcategoriesList.map((sub, sIdx) => {
                                const isSubActive = activeSubcategory === sub;
                                return (
                                  <button
                                    key={sIdx}
                                    onClick={() => setActiveSubcategory(sub)}
                                    className={`block w-full text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                                      isSubActive
                                        ? "text-orange-500 bg-orange-500/5"
                                        : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                                    }`}
                                  >
                                    • {sub}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMN 2: RIGHT DISPLAY GRID */}
            <div className="flex-1 space-y-10">
              
              {/* Product Cards Grid */}
              <div>
                {filteredProducts.length === 0 ? (
                  <div className="py-24 text-center space-y-4 bg-white/40 dark:bg-zinc-900/10 backdrop-blur-sm rounded-3xl border border-zinc-200/50 dark:border-white/5 max-w-xl mx-auto">
                    <div className="text-4xl">🎆</div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                      No Products Found
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto font-medium">
                      We couldn't find any products matching your parameters. Please try adjusting your search terms or filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                      <LocalProductCard
                        key={product.id}
                        product={product}
                        onClick={(e) => handleCardClick(product, e)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && filteredProducts.length > 0 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/5 bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-orange-500 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }).map((_, pageIdx) => {
                    const pageNum = pageIdx + 1;
                    const isSelected = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-11 w-11 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm border cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-orange-500/10"
                            : "bg-white dark:bg-zinc-900/40 border-zinc-200/80 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/5 bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-orange-500 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                    aria-label="Next Page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] max-w-3xl w-full p-6 md:p-10 relative overflow-hidden shadow-2xl animate-slide-up-fade text-left">
            
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer z-50 shadow-sm"
              aria-label="Close details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-40">
              <div className="relative group max-w-sm w-full mx-auto md:p-3">
                <div className="absolute top-6 -left-6 w-full h-full bg-orange-500/5 rounded-[1.8rem] border border-orange-500/10 pointer-events-none z-0" />
                <div className="absolute inset-0 border border-orange-500/20 rounded-[1.8rem] pointer-events-none z-0" />
                <div className="p-2 bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 rounded-[1.8rem] shadow-xl relative overflow-hidden z-10">
                  <div className="relative h-64 md:h-80 w-full rounded-[1.4rem] overflow-hidden">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct.tag && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
                        {selectedProduct.tag}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.subcategory && (
                      <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mt-1">
                        {selectedProduct.subcategory}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex gap-0.5 text-amber-400 pt-1">
                    {Array.from({ length: selectedProduct.rating }).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-zinc-100 dark:border-white/5 pt-4">
                  <h4 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-600 tracking-widest">
                    Product Details & Specifications
                  </h4>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                    {selectedProduct.details}
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Link
                    href={`/enquiry?product=${encodeURIComponent(selectedProduct.name)}`}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500" />
      </div>
    }>
      <ProductsCatalog />
    </Suspense>
  );
}

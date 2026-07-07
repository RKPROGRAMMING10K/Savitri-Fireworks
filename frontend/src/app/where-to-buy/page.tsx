"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";
import DealersCanvas from "@/components/DealersCanvas";

interface Dealer {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  hours: string;
  license: string;
  manager: string;
}

const mockDealers: Dealer[] = [
  // Tamil Nadu
  {
    id: "d1",
    name: "Savitri Official Factory Outlet",
    city: "Sivakasi",
    state: "Tamil Nadu",
    address: "45, Pyrotechnic Industrial Zone, Sivakasi, Tamil Nadu - 626123",
    phone: "+91 98765 43210",
    hours: "9:00 AM - 8:00 PM",
    license: "PESO-FAC-TN-4039",
    manager: "K. Rajkumar",
  },
  {
    id: "d2",
    name: "Savitri Chennai Depot",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "12, Anna Salai, near Gemini Flyover, Chennai, Tamil Nadu - 600006",
    phone: "+91 98765 43211",
    hours: "10:00 AM - 9:00 PM",
    license: "PESO-DEP-TN-5091",
    manager: "A. Srinivasan",
  },
  {
    id: "d3",
    name: "Meenakshi Fireworks Agencies",
    city: "Madurai",
    state: "Tamil Nadu",
    address: "88, Bypass Road, Madurai, Tamil Nadu - 625016",
    phone: "+91 98765 43212",
    hours: "9:30 AM - 8:30 PM",
    license: "PESO-RET-TN-2093",
    manager: "M. Ganesan",
  },
  {
    id: "d4",
    name: "Royal Firecrackers Emporium",
    city: "Coimbatore",
    state: "Tamil Nadu",
    address: "102, Avinashi Road, Coimbatore, Tamil Nadu - 641018",
    phone: "+91 98765 43213",
    hours: "10:00 AM - 9:00 PM",
    license: "PESO-RET-TN-3029",
    manager: "V. Anand",
  },
  // Karnataka
  {
    id: "d5",
    name: "Savitri Bengaluru Hub",
    city: "Bengaluru",
    state: "Karnataka",
    address: "55, Residency Road, Opposite Gateway Hotel, Bengaluru, Karnataka - 560025",
    phone: "+91 80234 56789",
    hours: "10:00 AM - 9:30 PM",
    license: "PESO-DEP-KA-8022",
    manager: "H. N. Gowda",
  },
  {
    id: "d6",
    name: "Chamundi Firework Agencies",
    city: "Mysuru",
    state: "Karnataka",
    address: "33, Outer Ring Road, near Hebbal Industrial Area, Mysuru, Karnataka - 570016",
    phone: "+91 80234 56790",
    hours: "9:00 AM - 8:30 PM",
    license: "PESO-RET-KA-1029",
    manager: "R. K. Prasad",
  },
  {
    id: "d7",
    name: "Karnataka Crackers Outlet",
    city: "Hubballi",
    state: "Karnataka",
    address: "77, Gokul Road, Hubballi, Karnataka - 580030",
    phone: "+91 80234 56791",
    hours: "9:30 AM - 8:30 PM",
    license: "PESO-RET-KA-4402",
    manager: "S. Patil",
  },
  {
    id: "d8",
    name: "Coastal Fireworks Co.",
    city: "Mangaluru",
    state: "Karnataka",
    address: "14, Hampankatta Road, Mangaluru, Karnataka - 575001",
    phone: "+91 80234 56792",
    hours: "10:00 AM - 9:00 PM",
    license: "PESO-RET-KA-9021",
    manager: "B. D'Souza",
  },
  // Andhra Pradesh
  {
    id: "d9",
    name: "Krishna Pyro Stores",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    address: "99, MG Road, Labbipet, Vijayawada, Andhra Pradesh - 520010",
    phone: "+91 86612 34567",
    hours: "9:30 AM - 9:00 PM",
    license: "PESO-RET-AP-5039",
    manager: "Ch. Rao",
  },
  {
    id: "d10",
    name: "Vizag Firework Agency",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    address: "40, Beach Road, near MVP Colony, Visakhapatnam, Andhra Pradesh - 530017",
    phone: "+91 86612 34568",
    hours: "10:00 AM - 9:30 PM",
    license: "PESO-DEP-AP-8921",
    manager: "P. Satish",
  },
  {
    id: "d11",
    name: "Balaji Crackers Depot",
    city: "Tirupati",
    state: "Andhra Pradesh",
    address: "20, Temple Street, Tirupati, Andhra Pradesh - 517501",
    phone: "+91 86612 34569",
    hours: "8:00 AM - 9:00 PM",
    license: "PESO-RET-AP-1029",
    manager: "K. Reddy",
  },
  // Telangana
  {
    id: "d12",
    name: "Savitri Hyderabad Depot",
    city: "Hyderabad",
    state: "Telangana",
    address: "88, Gachibowli Main Road, near DLF Cyber City, Hyderabad, Telangana - 500032",
    phone: "+91 40567 89012",
    hours: "10:00 AM - 10:00 PM",
    license: "PESO-DEP-TS-7092",
    manager: "M. A. Khan",
  },
  {
    id: "d13",
    name: "Kakatiya Firework Agencies",
    city: "Warangal",
    state: "Telangana",
    address: "11, Hunter Road, Hanamkonda, Warangal, Telangana - 506001",
    phone: "+91 40567 89013",
    hours: "9:00 AM - 8:30 PM",
    license: "PESO-RET-TS-4029",
    manager: "G. Venkatesh",
  },
  {
    id: "d14",
    name: "Nizam Pyro Distributors",
    city: "Nizamabad",
    state: "Telangana",
    address: "44, Station Road, Nizamabad, Telangana - 503001",
    phone: "+91 40567 89014",
    hours: "9:30 AM - 8:30 PM",
    license: "PESO-RET-TS-9021",
    manager: "T. Srinivas",
  },
  // Maharashtra
  {
    id: "d15",
    name: "Savitri Mumbai Depot",
    city: "Mumbai",
    state: "Maharashtra",
    address: "12, Link Road, Andheri West, opposite Citi Mall, Mumbai, Maharashtra - 400053",
    phone: "+91 22678 90123",
    hours: "10:00 AM - 9:30 PM",
    license: "PESO-DEP-MH-9040",
    manager: "D. Deshmukh",
  },
  {
    id: "d16",
    name: "Deccan Fireworks Outlet",
    city: "Pune",
    state: "Maharashtra",
    address: "90, JM Road, Shivaji Nagar, Pune, Maharashtra - 411004",
    phone: "+91 22678 90124",
    hours: "9:30 AM - 9:00 PM",
    license: "PESO-RET-MH-5092",
    manager: "S. Kulkarni",
  },
  {
    id: "d17",
    name: "Vidarbha Crackers Agency",
    city: "Nagpur",
    state: "Maharashtra",
    address: "55, Wardha Road, Nagpur, Maharashtra - 440015",
    phone: "+91 22678 90125",
    hours: "9:00 AM - 8:30 PM",
    license: "PESO-RET-MH-1029",
    manager: "V. Sharma",
  },
  // Kerala
  {
    id: "d18",
    name: "Savitri Kochi Outlet",
    city: "Kochi",
    state: "Kerala",
    address: "22, MG Road, near Ernakulam South Junction, Kochi, Kerala - 682016",
    phone: "+91 48423 45678",
    hours: "9:30 AM - 8:30 PM",
    license: "PESO-DEP-KL-4091",
    manager: "P. J. Mathew",
  },
  {
    id: "d19",
    name: "Ananthapuri Fireworks",
    city: "Thiruvananthapuram",
    state: "Kerala",
    address: "19, Kowdiar Road, Thiruvananthapuram, Kerala - 695003",
    phone: "+91 48423 45679",
    hours: "10:00 AM - 8:30 PM",
    license: "PESO-RET-KL-9201",
    manager: "G. Nair",
  },
  {
    id: "d20",
    name: "Malabar Firecrackers",
    city: "Kozhikode",
    state: "Kerala",
    address: "66, Beach Road, Kozhikode, Kerala - 673032",
    phone: "+91 48423 45680",
    hours: "9:30 AM - 9:00 PM",
    license: "PESO-RET-KL-1203",
    manager: "K. Ibrahim",
  },
];

interface LocalDealerCardProps {
  dealer: Dealer;
  onClick: (e: React.MouseEvent) => void;
}

function LocalDealerCard({ dealer, onClick }: LocalDealerCardProps) {
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

      if (isHovering && Math.random() < 0.2) {
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
      className="group rounded-3xl bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-6 shadow-md hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-1.5 transition-all duration-500 select-none relative overflow-hidden cursor-pointer flex flex-col justify-between h-[230px] text-left"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="space-y-3.5 relative z-10">
        {/* Header tags */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-wider">
            {dealer.city}
          </span>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
            {dealer.state}
          </span>
        </div>

        {/* Title & Info */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
            {dealer.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2">
            {dealer.address}
          </p>
        </div>
      </div>

      {/* Action Row */}
      <div className="relative z-10 pt-3.5 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
          Open: {dealer.hours}
        </span>
        <span className="text-xs font-black text-orange-500 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View Depot Details
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3 w-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function WhereToBuyCatalog() {
  const searchParams = useSearchParams();

  const [activeState, setActiveState] = useState("Tamil Nadu");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  const states = [
    "Tamil Nadu",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
    "Maharashtra",
    "Kerala",
  ];

  // Capture URL parameters if state is pre-selected
  useEffect(() => {
    const urlState = searchParams.get("state");
    if (urlState) {
      const decodedState = decodeURIComponent(urlState);
      const foundState = states.find(
        (s) => s.toLowerCase() === decodedState.toLowerCase()
      );
      if (foundState) {
        setActiveState(foundState);
      }
    }
  }, [searchParams]);

  // Handle activeState toggle & trigger background mesh lasers
  const handleStateChange = (state: string, e: React.MouseEvent) => {
    setActiveState(state);
    
    // Dispatch coordinate laser shot event to DealersCanvas
    window.dispatchEvent(
      new CustomEvent("state-selected", {
        detail: {
          x: e.clientX,
          y: e.clientY,
        },
      })
    );

    // Dispatch cracker click sparkles
    window.dispatchEvent(
      new CustomEvent("trigger-firework", {
        detail: {
          x: e.clientX,
          y: e.clientY,
          type: "sparkler",
        },
      })
    );
  };

  // Filter Dealers
  const filteredDealers = mockDealers.filter((dealer) => {
    const matchesState = dealer.state === activeState;
    const matchesSearch =
      dealer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background canvas signals */}
      <FireworksCanvas />
      <DealersCanvas />

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
                <span>Where to Buy</span>
              </div>
            </nav>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
            Official{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Distributors
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade" style={{ animationDelay: "200ms" }}>
            Find licensed retail depots and official outlets in your state. Authenticity and safe factory testing guaranteed at every location.
          </p>
        </div>
      </section>

      {/* SECTION 2: MAP SELECTOR & DEALERS GRID */}
      <section className="relative w-full py-16 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Grid: Left (Dealers & Search) vs Right (States Selector List) */}
          <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-10 relative z-30">
            
            {/* COLUMN 1: LEFT SIDEBAR DEALERS DISPLAY (3/4 Width) */}
            <div className="flex-1 space-y-8 text-left">
              
              {/* Search Box Header */}
              <div className="bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                    {activeState} Outlets
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                    Showing authorized dealers and licensed depots.
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search by city or depot name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                  </svg>
                </div>
              </div>

              {/* Cards Grid */}
              <div>
                {filteredDealers.length === 0 ? (
                  <div className="py-24 text-center space-y-4 bg-white/40 dark:bg-zinc-900/10 backdrop-blur-sm rounded-3xl border border-zinc-200/50 dark:border-white/5 max-w-md mx-auto">
                    <div className="text-3xl">🎆</div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                      No Outlets Found
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto font-medium">
                      No depots match your search criteria. Please try adjust filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredDealers.map((dealer, idx) => (
                      <div
                        key={dealer.id}
                        className="animate-slide-up-fade"
                        style={{ animationDelay: `${idx * 80}ms` }}
                      >
                        <LocalDealerCard
                          dealer={dealer}
                          onClick={() => setSelectedDealer(dealer)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* COLUMN 2: RIGHT STATE SELECTOR (1/4 Width, Sticky) */}
            <div className="w-full lg:w-[280px] flex-shrink-0">
              <div className="bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-3xl p-6 space-y-6 lg:sticky lg:top-28 h-fit shadow-lg text-left animate-fade-in">
                
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                    Select State
                  </h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal font-medium">
                    Click any state to connect to local dealer coordinates.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {states.map((state, idx) => {
                    const isActive = activeState === state;
                    const cityCount = mockDealers.filter((d) => d.state === state).length;

                    return (
                      <button
                        key={idx}
                        onClick={(e) => handleStateChange(state, e)}
                        className={`w-full text-left px-5 py-3.5 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                          isActive
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-md shadow-orange-500/10 scale-[1.01]"
                            : "bg-zinc-50/50 dark:bg-black/20 border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300/80 dark:hover:border-white/10 hover:scale-[1.005]"
                        }`}
                      >
                        <span>{state}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        }`}>
                          {cityCount} Hubs
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* DEPOT DETAILS MODAL */}
      {selectedDealer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          {/* Main Card Container */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] max-w-2xl w-full p-6 md:p-10 relative overflow-hidden shadow-2xl animate-slide-up-fade text-left">
            
            {/* Ambient glows behind modal columns */}
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setSelectedDealer(null)}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer z-50 shadow-sm"
              aria-label="Close details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6 relative z-40">
              
              {/* Header Titles */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-wider">
                    {selectedDealer.city}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                    {selectedDealer.state}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                  {selectedDealer.name}
                </h2>
              </div>

              {/* Address details & simulated Map block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Info Text Column */}
                <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Full Address
                    </h4>
                    <p className="leading-relaxed font-semibold">{selectedDealer.address}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Operational Hours
                    </h4>
                    <p className="font-semibold">{selectedDealer.hours} (Mon - Sat)</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Contact Details
                    </h4>
                    <p className="font-semibold">Phone: {selectedDealer.phone}</p>
                    <p className="font-semibold">Depot Manager: {selectedDealer.manager}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      PESO License Code
                    </h4>
                    <p className="font-mono text-[10px] tracking-wider text-orange-500 font-black">{selectedDealer.license}</p>
                  </div>
                </div>

                {/* Simulated GPS Radar Map Visual block */}
                <div className="h-48 md:h-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 overflow-hidden relative flex flex-col justify-center items-center p-6 text-center select-none">
                  {/* Radar ping */}
                  <span className="relative flex h-14 w-14">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-14 w-14 bg-orange-500/20 border border-orange-500/40 items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-orange-500">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.655 7.587a15.223 15.223 0 002.573 1.938 5.568 5.568 0 00.462.208zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </span>
                  <h4 className="text-[10px] font-black uppercase text-zinc-900 dark:text-white mt-4 tracking-widest leading-none">
                    GPS SIGNAL ACTIVE
                  </h4>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-[150px] mx-auto font-medium">
                    Authorized outlet coords locked for delivery tracking.
                  </p>
                </div>

              </div>

              {/* Action Row */}
              <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedDealer(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-black uppercase border border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Link
                  href={`/enquiry?dealer=${encodeURIComponent(selectedDealer.name)}`}
                  className="inline-flex items-center justify-center px-8 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-md hover:shadow-orange-500/10 transition-all duration-300"
                >
                  Request Transit Order
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}

export default function WhereToBuyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500" />
      </div>
    }>
      <WhereToBuyCatalog />
    </Suspense>
  );
}

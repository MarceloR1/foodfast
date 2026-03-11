"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, ChevronRight, Star, Clock, MapPin, Loader2 } from "lucide-react";
import { getCategories, getFeaturedRestaurants, Category, Restaurant } from "@/services/api";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, rests] = await Promise.all([
          getCategories(),
          getFeaturedRestaurants()
        ]);
        setCategories(cats);
        setRestaurants(rests);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-dark">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-dark" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Food<span className="text-primary">Fast</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
              <a href="#" className="hover:text-primary transition-colors">Menu</a>
              <a href="#" className="hover:text-primary transition-colors">Restaurantes</a>
              <a href="#" className="hover:text-primary transition-colors">Ofertas</a>
              <a href="#" className="hover:text-primary transition-colors">Soporte</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-white hover:text-primary transition-colors">Log in</button>
              <button className="px-6 py-2 bg-primary text-dark font-semibold rounded-full hover:bg-primary-dark transition-all transform hover:scale-105">Sign up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                🚀 Delivery rápido en 30 min
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                La comida que amas, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  entregada al instante.
                </span>
              </h1>
              <p className="text-lg text-white/60 max-w-lg">
                Descubre los mejores restaurantes de tu zona y disfruta de una experiencia gastronómica premium desde la comodidad de tu hogar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Introduce tu dirección..." 
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-white/20"
                  />
                </div>
                <Link href="/checkout" className="px-8 py-4 bg-primary text-dark font-bold rounded-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group">
                  Explorar ahora
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in group">
               {/* Background Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[120px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
               
               {/* Hero Image */}
               <div className="relative w-full aspect-square max-w-md bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-[40px] overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02] group-hover:rotate-1">
                  <Image 
                    src="/images/hero.png" 
                    alt="Premium Food" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-40"></div>
               </div>

               {/* Floating Stats */}
               <div className="absolute -bottom-6 -left-6 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl animate-slide-up animation-delay-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl">
                        <Star className="w-6 h-6 text-dark fill-current" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">4.9/5</div>
                        <div className="text-white/40 text-sm">Rating promedio</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-dark-lighter/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Categorías Populares</h2>
              <p className="text-white/40">Explora lo que más se antoja hoy</p>
            </div>
            <button className="text-primary font-medium hover:underline flex items-center gap-1 group">
              Ver todas <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-48 rounded-[32px] bg-white/5 animate-pulse border border-white/10"></div>
              ))
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat.id} className="group relative h-48 rounded-[32px] overflow-hidden border border-white/10 hover:border-primary/30 transition-all cursor-pointer">
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-xl font-bold text-white mb-1">{cat.name}</span>
                    <div className="w-8 h-1 bg-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </div>
              ))
            ) : (
                <div className="col-span-full py-12 text-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                   No se encontraron categorías. Revisa tu base de datos.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Restaurantes Destacados</h2>
              <p className="text-white/40">Calidad gourmet seleccionada para ti</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 rounded-[40px] bg-white/5 animate-pulse border border-white/10"></div>
              ))
            ) : restaurants.length > 0 ? (
              restaurants.map((res) => (
                <div key={res.id} className="group bg-dark-lighter/40 rounded-[40px] overflow-hidden border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all shadow-xl hover:-translate-y-2 duration-500">
                  <div className="relative h-64">
                    <Image src={res.image_url} alt={res.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-dark/80 backdrop-blur-md rounded-full flex items-center gap-1.5 border border-white/10">
                      <Star className="w-4 h-4 text-primary fill-current" />
                      <span className="text-sm font-bold">{res.rating}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{res.name}</h3>
                    <div className="flex items-center justify-between text-sm text-white/50 border-t border-white/5 pt-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {res.time_estimate}
                      </div>
                      <span className="font-bold text-primary">{res.price_range}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <div className="col-span-full py-20 text-center text-white/20 border-2 border-dashed border-white/5 rounded-[40px]">
                   No hay restaurantes disponibles.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-dark" />
            </div>
            <span className="text-lg font-bold text-white">Food<span className="text-primary">Fast</span></span>
          </div>
          <p className="text-white/30 text-sm">© 2026 FoodFast Delivery. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-white/50 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Ayuda</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

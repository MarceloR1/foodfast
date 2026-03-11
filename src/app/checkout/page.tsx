import { ShoppingBag, ChevronLeft, CreditCard, Truck, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-dark pb-20">
      {/* Simple Header */}
      <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </Link>
            <span className="text-xl font-bold">Resumen de Pedido</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Details */}
            <div className="p-8 rounded-[40px] bg-dark-lighter/30 border border-white/5 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                Detalles de Entrega
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <div className="text-white/40 mb-2 uppercase tracking-wider text-[10px]">Dirección</div>
                  <div>Calle Principal 123, Ciudad de México</div>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <div className="text-white/40 mb-2 uppercase tracking-wider text-[10px]">Tiempo Estimado</div>
                  <div className="text-primary">25 - 35 minutos</div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-8 rounded-[40px] bg-dark-lighter/30 border border-white/5 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                Método de Pago
              </h2>
              <div className="p-6 rounded-3xl bg-white/5 border border-primary/50 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
                  <div>•••• 4242</div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <button className="w-full py-4 text-sm font-semibold text-white/40 border-2 border-dashed border-white/10 rounded-3xl hover:border-primary/50 hover:text-primary transition-all">
                + Añadir nuevo método de pago
              </button>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <div className="sticky top-24 p-8 rounded-[40px] bg-gradient-to-br from-dark-lighter/60 to-dark-lighter/20 border border-white/10 shadow-2xl space-y-8">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4">Tu Carrito</h3>
              
              {/* Items */}
              <div className="space-y-6">
                {[
                  { name: 'Sushi Moriwaki Special', qty: 1, price: '$24.00', img: '/images/sushi.png' },
                  { name: 'Truffle Wagyu Burger', qty: 2, price: '$36.00', img: '/images/burger.png' },
                ].map((item) => (
                  <div key={item.name} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                      <Image src={item.img} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-bold leading-tight">{item.name}</div>
                      <div className="text-xs text-white/40">Cantidad: {item.qty}</div>
                    </div>
                    <div className="font-bold text-sm">{item.price}</div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span>$60.00</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Envío</span>
                  <span className="text-secondary font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4">
                  <span>Total</span>
                  <span className="text-primary">$60.00</span>
                </div>
              </div>

              {/* Secure Checkout Button */}
              <button className="w-full py-5 bg-primary text-dark font-black rounded-3xl hover:bg-primary-dark transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3">
                Confirmar y Pagar
                <ShieldCheck className="w-5 h-5" />
              </button>
              
              <div className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
                Pago 100% Seguro · Encriptado SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

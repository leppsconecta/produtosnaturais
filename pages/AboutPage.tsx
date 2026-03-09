import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Truck, Users } from 'lucide-react';
<<<<<<< HEAD
import Navbar from '../components/Navbar';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
=======
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924

export default function AboutPage() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Qualidade Garantida',
      desc: 'Produtos selecionados com rigor.',
    },
    {
      icon: Heart,
      title: 'Feito com Amor',
      desc: 'Cuidado artesanal em cada embalagem.',
    },
    {
      icon: Users,
      title: 'Atacado e Varejo',
      desc: 'Atendemos todos os públicos.',
    },
    {
      icon: Truck,
      title: 'Envio Nacional',
      desc: 'Entregamos em todo o Brasil.',
    },
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen font-sans text-earth-800 bg-offwhite flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
=======
    <div className="py-32 px-4 sm:px-6 lg:px-8">
      <main className="flex-grow">
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-lg h-[400px]"
            >
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop"
                alt="Especiarias e temperos naturais"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#5A1788] mb-6">
                Quem Somos
              </h1>

              <div className="space-y-4 text-earth-800 text-lg leading-relaxed mb-8">
                <p>
                  A <strong>Empórios MDA</strong> nasceu da paixão por sabores autênticos e alimentação saudável. Nossa missão é levar até a sua mesa temperos, chás e grãos selecionados com o máximo rigor e carinho.
                </p>
                <p>
                  Trabalhamos diretamente com produtores para garantir frescor e qualidade, atendendo desde o consumidor final até grandes comércios, sempre com um atendimento próximo e personalizado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-[#5A1788]/10 p-2 rounded-lg text-[#5A1788] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#5A1788] text-sm">{feature.title}</h4>
                        <p className="text-xs text-earth-600">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
<<<<<<< HEAD

      <FloatingWhatsApp />
=======
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
    </div>
  );
}

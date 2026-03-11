import { blogService } from '../src/lib/supabase/blog';

async function main() {
  try {
    // Post 1
    await blogService.create({
      title: '5 secretos para un pan artesanal perfecto',
      content: 'Hacer pan artesanal es un arte. Aquí te compartimos los 5 secretos que marcan la diferencia: usar ingredientes frescos, respetar los tiempos de fermentación, amasar con paciencia, controlar la temperatura y hornear con vapor. ¡Atrévete a probarlos!',
      excerpt: 'Descubre los trucos de los panaderos expertos para lograr un pan delicioso y esponjoso en casa.',
      image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      is_published: true,
      featured: true,
      tags: ['pan', 'consejos', 'artesanal']
    });
    // Post 2
    await blogService.create({
      title: '¿Por qué el pan de masa madre es más saludable?',
      content: 'El pan de masa madre contiene probióticos naturales, es más fácil de digerir y tiene un sabor único. Además, su fermentación lenta ayuda a reducir el índice glucémico y mejora la absorción de nutrientes.',
      excerpt: 'Te explicamos los beneficios del pan de masa madre y por qué deberías incluirlo en tu dieta.',
      image_url: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80',
      is_published: true,
      featured: false,
      tags: ['salud', 'masa madre', 'nutrición']
    });
    // Post 3
    await blogService.create({
      title: 'Receta fácil: Pan dulce para compartir en familia',
      content: 'Ingredientes: harina, azúcar, mantequilla, huevos, leche y frutas confitadas. Mezcla, amasa, deja reposar y hornea. ¡El resultado es un pan dulce esponjoso y perfecto para la merienda!',
      excerpt: 'Una receta sencilla y deliciosa para preparar pan dulce en casa y disfrutar con los tuyos.',
      image_url: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80',
      is_published: true,
      featured: false,
      tags: ['receta', 'pan dulce', 'familia']
    });
    console.log('¡Posts de ejemplo creados exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al crear los posts:', error);
    process.exit(1);
  }
}

main(); 
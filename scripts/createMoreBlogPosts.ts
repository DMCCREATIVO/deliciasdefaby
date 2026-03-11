import { blogService } from '../src/lib/supabase/blog';

async function main() {
  try {
    console.log("Creando posts adicionales...");
    
    // Post 3
    await blogService.create({
      title: 'Los mejores postres para la temporada otoñal',
      content: '<p>El otoño es la temporada perfecta para disfrutar de sabores cálidos y reconfortantes. En este artículo compartimos nuestras recetas favoritas para esta época del año.</p><p>Las tartas de manzana con canela, los pasteles de calabaza y los brownies con nueces son opciones deliciosas que no puedes dejar de probar. Además, te explicamos cómo conseguir la textura perfecta en cada una de estas preparaciones.</p>',
      excerpt: 'Descubre las mejores recetas de postres para disfrutar durante el otoño con ingredientes de temporada.',
      image_url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
      is_published: true,
      featured: true,
      tags: ['recetas', 'postres', 'otoño']
    });
    
    // Post 4
    await blogService.create({
      title: 'Cómo decorar pasteles como un profesional',
      content: '<p>La decoración de pasteles es un arte que puedes dominar con práctica y las herramientas adecuadas. En este artículo te revelamos los secretos de los pasteleros profesionales.</p><p>Aprenderás técnicas para conseguir un glaseado perfecto, cómo hacer flores de fondant realistas y trucos para escribir con chocolate de manera impecable. Con estos consejos, tus creaciones lucirán como si vinieran de una pastelería profesional.</p>',
      excerpt: 'Técnicas y consejos de decoración para conseguir pasteles dignos de una pastelería profesional desde tu cocina.',
      image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
      is_published: true,
      featured: false,
      tags: ['decoración', 'técnicas', 'pasteles']
    });
    
    // Post 5
    await blogService.create({
      title: 'Panes del mundo: un viaje gastronómico',
      content: '<p>El pan es un alimento universal con miles de variantes alrededor del mundo. Te invitamos a un recorrido por las recetas más emblemáticas de diferentes culturas.</p><p>Desde el baguette francés hasta el naan indio, pasando por el pan de muerto mexicano o el pretzel alemán, cada país tiene su propia tradición panadera. Exploraremos sus ingredientes, técnicas de elaboración y el papel cultural que desempeñan en sus lugares de origen.</p>',
      excerpt: 'Recorrido por las variedades de pan más famosas del mundo, sus ingredientes y técnicas tradicionales.',
      image_url: 'https://images.unsplash.com/photo-1555951015-6da1e2452e10?auto=format&fit=crop&w=800&q=80',
      is_published: true,
      featured: false,
      tags: ['pan', 'internacional', 'tradiciones']
    });
    
    console.log("Posts creados con éxito");
  } catch (error) {
    console.error("Error al crear posts:", error);
  }
}

main(); 
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface TestimonialFormProps {
  onSubmit: (testimonial: {
    name: string;
    comment: string;
    rating: number;
  }) => void;
}

export const TestimonialForm = ({ onSubmit }: TestimonialFormProps) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      return;
    }
    onSubmit({ name, comment, rating });
    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 text-brand-cafe">
          Tu Nombre
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Escribe tu nombre"
          required
          className="border-brand-cafe/20 focus:border-brand-cafe"
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-1 text-brand-cafe">
          Tu Experiencia
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos tu experiencia con nuestros productos"
          required
          className="min-h-[100px] border-brand-cafe/20 focus:border-brand-cafe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-brand-cafe">
          Calificación
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  value <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-brand-cafe hover:bg-brand-brown text-white"
      >
        Enviar Reseña
      </Button>
    </form>
  );
};
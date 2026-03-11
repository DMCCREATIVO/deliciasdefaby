import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/lib/database/index";
import { motion } from "framer-motion";

export const DeliveryBanner = () => {
  const { data: scheduleText } = useQuery({
    queryKey: ['settings', 'delivery_schedule_text'],
    queryFn: async () => {
      const allSettings = await settingsService.getAll();
      const setting = allSettings.find(s => s.key === 'delivery_schedule_text');
      return setting?.value;
    }
  });

  return (
    <motion.div
      className="w-full bg-gradient-to-r from-brand-beige/30 via-brand-beige/20 to-brand-beige/30 py-2 border-b border-brand-cafe/10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <p className="text-center text-sm md:text-base font-medium text-brand-cafe/80">
          {scheduleText || "📅 Entregas: Martes y Jueves de 9:00 AM a 6:00 PM"}
        </p>
      </div>
    </motion.div>
  );
};
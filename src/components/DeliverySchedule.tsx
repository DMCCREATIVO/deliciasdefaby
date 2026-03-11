import { Calendar, Clock, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { scheduleService } from "@/lib/database/index";
import { DeliverySchedule as DeliveryScheduleType } from "@/lib/database/schedules.pocketbase";

export const DeliverySchedule = () => {
  const [schedules, setSchedules] = useState<DeliveryScheduleType[]>([]);

  const diasTraducidos: Record<string, string> = {
    "monday": "Lunes",
    "tuesday": "Martes",
    "wednesday": "Miércoles",
    "thursday": "Jueves",
    "friday": "Viernes",
    "saturday": "Sábado",
    "sunday": "Domingo",
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await scheduleService.getAll();
      setSchedules(data.filter(s => s.is_active));
    };
    fetchSchedules();
  }, []);

  const getDíasTexto = () => {
    if (schedules.length === 0) return "Cargando...";
    if (schedules.length === 7) return "Todos los días";
    return schedules.map(s => diasTraducidos[s.day_of_week] || s.day_of_week).join(", ");
  };

  const getHorarioTexto = () => {
    if (schedules.length === 0) return "Cargando...";
    // Si todos tienen el mismo horario, mostrar uno solo
    const first = schedules[0];
    const matchesAll = schedules.every(s => s.start_time === first.start_time && s.end_time === first.end_time);

    if (matchesAll) {
      return `${first.start_time} - ${first.end_time}`;
    }
    return "Ver detalle al pedir";
  };

  return (
    <div className="py-12 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 via-transparent to-brand-beige/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-900/80 to-zinc-900 pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-brand-pink via-white to-brand-beige bg-clip-text text-transparent mb-6">
            Horarios de Entrega
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Planifica tu pedido con nuestros horarios de entrega disponibles para tu comodidad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-800/30 backdrop-blur-sm p-8 rounded-xl border border-zinc-700/50 hover:border-brand-pink/50 transition-all group hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-pink/5 min-h-[250px]">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-lg mb-6 inline-block group-hover:bg-gradient-to-br group-hover:from-brand-pink/20 group-hover:to-brand-brown/20 transition-all">
              <Calendar className="w-12 h-12 text-brand-pink group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Días de Entrega</h3>
            <p className="text-lg text-zinc-400">{getDíasTexto()}</p>
          </div>

          <div className="bg-zinc-800/30 backdrop-blur-sm p-8 rounded-xl border border-zinc-700/50 hover:border-brand-pink/50 transition-all group hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-pink/5 min-h-[250px]">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-lg mb-6 inline-block group-hover:bg-gradient-to-br group-hover:from-brand-pink/20 group-hover:to-brand-brown/20 transition-all">
              <Clock className="w-12 h-12 text-brand-pink group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Horario</h3>
            <p className="text-lg text-zinc-400">{getHorarioTexto()}</p>
          </div>

          <div className="bg-zinc-800/30 backdrop-blur-sm p-8 rounded-xl border border-zinc-700/50 hover:border-brand-pink/50 transition-all group hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-pink/5 min-h-[250px]">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-lg mb-6 inline-block group-hover:bg-gradient-to-br group-hover:from-brand-pink/20 group-hover:to-brand-brown/20 transition-all">
              <MapPin className="w-12 h-12 text-brand-pink group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Zona de Entrega</h3>
            <p className="text-lg text-zinc-400">Santiago y alrededores</p>
          </div>
        </div>
      </div>
    </div>
  );
};
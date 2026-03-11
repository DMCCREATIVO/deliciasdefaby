import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scheduleService } from "@/lib/database/index";
import { toast } from "sonner";
import { DeliverySchedule } from "@/lib/database/schedules.pocketbase";
import { adminComponentPresets } from "@/hooks/useAdminTheme";
import { Clock, CalendarDays, Save, RefreshCw } from "lucide-react";

const dias: Record<string, string> = {
  "monday": "Lunes",
  "tuesday": "Martes",
  "wednesday": "Miércoles",
  "thursday": "Jueves",
  "friday": "Viernes",
  "saturday": "Sábado",
  "sunday": "Domingo",
};

const Horarios = () => {
  const [schedules, setSchedules] = useState<DeliverySchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setInitialLoad(true);
    try {
      const data = await scheduleService.getAll();
      const order = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const sortedData = [...(data || [])].sort((a, b) => order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week));
      setSchedules(sortedData);
    } catch (e) {
      toast.error('Error al cargar horarios desde la base de datos');
    } finally {
      setInitialLoad(false);
    }
  };

  const handleToggle = (id: string, checked: boolean) => {
    setSchedules(prev => prev.map(schedule =>
      schedule.id === id ? { ...schedule, is_active: checked } : schedule
    ));
  };

  const handleTimeChange = (id: string, field: 'start_time' | 'end_time', value: string) => {
    setSchedules(prev => prev.map(schedule =>
      schedule.id === id ? { ...schedule, [field]: value } : schedule
    ));
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      const success = await scheduleService.update(schedules);
      if (!success) throw new Error('Error al guardar cambios.');
      toast.success('Horarios actualizados con éxito');
    } catch (error: any) {
      console.error('Error saving schedules:', error);
      toast.error('Ocurrió un error. Asegúrate de haber vinculado la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-zinc-600 font-medium font-heading">Cargando esquema de horarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${adminComponentPresets.pageContainer} space-y-6 max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold admin-text-primary font-heading flex items-center gap-2">
            <Clock className="h-8 w-8 admin-text-accent" />
            Horarios de Entrega
          </h1>
          <p className="admin-text-secondary mt-1">
            Configura los días y franjas horarias en las que recibes o despachas pedidos.
          </p>
        </div>
        <Button
          onClick={saveChanges}
          disabled={loading || schedules.length === 0}
          className={`${adminComponentPresets.primaryButton} shadow-lg`}
        >
          {loading ? (
            <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Guardar Cambios</>
          )}
        </Button>
      </div>

      <Card className={adminComponentPresets.sectionContainer}>
        <CardHeader className="border-b admin-border-light pb-4 mb-4">
          <CardTitle className="admin-text-primary flex items-center gap-2 mb-1">
            <CalendarDays className="h-5 w-5 admin-text-muted" />
            Planificación Semanal
          </CardTitle>
          <CardDescription className="admin-text-secondary">
            Enciende los días hábiles en los que tu negocio operará y establecer el rango en 24h.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.map((schedule) => {
              const isActive = schedule.is_active;
              const nombreDia = dias[schedule.day_of_week] || "Desconocido";

              return (
                <div
                  key={schedule.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all ${isActive
                      ? "bg-white border-amber-200 shadow-sm"
                      : "bg-zinc-50 border-zinc-200 opacity-75 grayscale-[0.2]"
                    }`}
                >
                  {/* Interruptor y Día */}
                  <div className="flex items-center gap-4 mb-3 sm:mb-0 min-w-[150px]">
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => handleToggle(schedule.id, checked)}
                      className={isActive ? "data-[state=checked]:bg-amber-600" : ""}
                    />
                    <span className={`font-semibold md:text-lg ${isActive ? "text-amber-900" : "text-zinc-500"}`}>
                      {nombreDia}
                    </span>
                  </div>

                  {/* Horarios Inputs */}
                  <div className="flex items-center gap-3 md:gap-6 w-full sm:w-auto">
                    {isActive ? (
                      <div className="flex flex-1 sm:flex-none items-center gap-3">
                        <Input
                          type="time"
                          value={schedule.start_time || "09:00"}
                          onChange={(e) => handleTimeChange(schedule.id, 'start_time', e.target.value)}
                          className="w-28 text-center font-bold text-amber-900 border-amber-200 bg-amber-50 focus-visible:ring-amber-500"
                        />
                        <span className="text-amber-600/60 font-medium text-sm">A</span>
                        <Input
                          type="time"
                          value={schedule.end_time || "18:00"}
                          onChange={(e) => handleTimeChange(schedule.id, 'end_time', e.target.value)}
                          className="w-28 text-center font-bold text-amber-900 border-amber-200 bg-amber-50 focus-visible:ring-amber-500"
                        />
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-zinc-500 border-zinc-300 bg-zinc-200 justify-center w-[200px] md:w-60 py-1.5 flex transition-all">
                        Día de Descanso
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Horarios;
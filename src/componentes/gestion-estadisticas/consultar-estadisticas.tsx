import { useEffect, useState } from "react";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import { 
  LayoutDashboard, CheckCircle2, Clock, AlertTriangle, 
  TrendingUp, Activity, PieChart as PieIcon, 
} from 'lucide-react';

import EstadisticasService from "./estadisticas-service";
import type { EstadisticasCompletas } from "../../interfaces/gestion-estadisticas/interfaces-estadisticas";
import type { DashboardFilters } from "./filtros";
import FilterBar from "./filtros";
import { CriticidadReclamoS, EstadoReclamoS, PrioridadReclamoS } from "../../interfaces/gestion-reclamo/interfaces-reclamo";
import StatsCard from "./tarjetas";
import Select from "react-select";

// Color Palettes
const COLORS_STATE = ['#3B82F6', '#10B981', '#F59E0B', '#6B7280', '#EF4444'];
const COLORS_PRIORITY = ['#60A5FA', '#34D399', '#FBBF24', '#F87171'];
const COLORS_AREA = '#6366f1';


export const EstadisticasS: Record<number, string> = {
  2: 'Tiempo Promedio Por Estado',
  3: 'Cantidad por Estado',
  4: 'Cantidad por Área',
  5: 'Cantidad por Prioridad',
  6: 'Cantidad por Criticidad',
}

export const Estadisticas = {
  TIEMPO_PROMEDIO_POR_ESTADO: 2,
  CANTIDAD_POR_ESTADO: 3,
  CANTIDAD_POR_AREA: 4,
  CANTIDAD_POR_PRIORIDAD: 5,
  CANTIDAD_POR_CRITICIDAD: 6,
}


export default function ConsultarEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasCompletas | null>(null);
  const [loading, ] = useState<boolean>(true);
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [estadisticaSeleccionada, setEstadisticaSeleccionada] = useState<number>(3);

  console.log("Filtros actuales:", filters);

  useEffect(() => {
    handleBuscarEstadisticas();
  }, []);

  const handleBuscarEstadisticas = async () => {
    try {
      const response = await EstadisticasService.obtenerEstadisticas(filters);
      setEstadisticas(response);

    } catch (error) {
      console.error("Error al obtener las estadísticas:", error);
    }
  }

  const handleClearFilters = () => {
    setFilters({});
  };

  if (loading && !estadisticas) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Cargando dashboard...</p>
      </div>
    );
  }

  if (!estadisticas) return null;

  const { generales, porEstado, porArea, porPrioridad, porCriticidad, tiemposPorEstado } = estadisticas;

  // Prepare data for charts with readable names
  const pieDataEstado = porEstado.map(item => ({
    name: EstadoReclamoS[item.estado] || `Estado ${item.estado}`,
    value: item.cantidad
  }));

  const barDataPrioridad = porPrioridad.map(item => ({
    name: PrioridadReclamoS[item.prioridad] || `Prio ${item.prioridad}`,
    cantidad: item.cantidad
  }));

  const barDataCriticidad = porCriticidad.map(item => ({
    name: CriticidadReclamoS[item.criticidad] || `Crit ${item.criticidad}`,
    cantidad: item.cantidad
  }));
  
  const timeData = tiemposPorEstado.map(item => ({
      name: EstadoReclamoS[item.estado] || `Estado ${item.estado}`,
      horas: item.tiempoPromedioHoras,
      dias: item.tiempoPromedioDias
  }));

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            Dashboard de Estadísticas
          </h1>
          <p className="text-gray-500 mt-1">Visualización general de métricas y rendimiento</p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar 
        filters={filters} 
        onFilterChange={setFilters} 
        onClearFilters={handleClearFilters} 
        onBuscarEstadisticas={handleBuscarEstadisticas}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">

          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700 py-1">Estadística</label>
            <Select
              value={
                Object.entries(EstadisticasS)
                  .map(([key, value]) => ({
                    value: Number(key),
                    label: value // or provide a more user-friendly label if needed
                  }))
                  .find((option) => Number(option.value) === estadisticaSeleccionada) || null
              }
              options={Object.entries(EstadisticasS).map(([key, value]) => ({
                value: Number(key),
                label: value,
              }))}
              onChange={(option: any) => setEstadisticaSeleccionada(option ? option.value : null)}
              className="text-black"
              menuPortalTarget={document.body}
              styles={{
                control: (base) => ({
                  ...base,
                  color: "black",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "black",
                }),
                option: (base, { isSelected, isFocused }) => ({
                  ...base,
                  color: isSelected ? "white" : "black",
                  backgroundColor: isSelected 
                  ? "#3b82f6" 
                  : isFocused 
                  ? "#93c5fd"
                  : "white",
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Status Distribution (Pie) */}
          {estadisticaSeleccionada === Estadisticas.CANTIDAD_POR_ESTADO && ( 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-gray-500" />
                Distribución por Estado
              </h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataEstado}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieDataEstado.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_STATE[index % COLORS_STATE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

          {/* Area Distribution (Bar Horizontal) */}
          {estadisticaSeleccionada === Estadisticas.CANTIDAD_POR_AREA && ( 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Carga por Área</h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={porArea}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="areaNombre" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="cantidad" fill={COLORS_AREA} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

          {/* Priority (Simple Bar) */}
          {estadisticaSeleccionada === Estadisticas.CANTIDAD_POR_PRIORIDAD && ( 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Por Prioridad</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barDataPrioridad}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                    {barDataPrioridad.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PRIORITY[index % COLORS_PRIORITY.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

          {/* Criticality (Simple Bar) */}
          {estadisticaSeleccionada === Estadisticas.CANTIDAD_POR_CRITICIDAD && ( 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-gray-800">Criticidad</h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barDataCriticidad}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#F87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

          {/* Time Analysis (Area Chart) */}
          {estadisticaSeleccionada === Estadisticas.TIEMPO_PROMEDIO_POR_ESTADO && ( 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tiempo Promedio (Horas)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData}>
                  <defs>
                    <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 11}} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="horas" stroke="#8884d8" fillOpacity={1} fill="url(#colorHoras)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <StatsCard 
            title="Total Reclamos" 
            value={generales.totalReclamos} 
            icon={Activity} 
            colorClass="bg-blue-500 text-blue-600"
            subtext="Total acumulado"
          />
          <StatsCard 
            title="Resueltos" 
            value={generales.reclamosResueltos} 
            icon={CheckCircle2} 
            colorClass="bg-green-500 text-green-600"
            subtext={`${((generales.reclamosResueltos / generales.totalReclamos) * 100).toFixed(1)}% eficiencia`}
          />
          <StatsCard 
            title="En Curso" 
            value={generales.reclamosEnCurso} 
            icon={Clock} 
            colorClass="bg-yellow-500 text-yellow-600"
            subtext="Actualmente trabajando"
          />
          <StatsCard 
            title="Tiempo Promedio De Resolucion" 
            value={`${generales.tiempoPromedioResolucionDias} días`} 
            icon={TrendingUp} 
            colorClass="bg-purple-500 text-purple-600"
            subtext={`${generales.tiempoPromedioResolucionHoras} horas laborales`}
          />
        </div>

      
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        

      </div>

    </div>
  );
}
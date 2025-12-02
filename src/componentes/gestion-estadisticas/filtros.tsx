import React, { useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import Select from "react-select";
import EstadisticasService from './estadisticas-service';
import type { SelectCliente } from '../../interfaces/generales/interfaces-generales';
import type { SelectProyecto } from '../../interfaces/gestion-proyecto/interfaces-proyecto';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FilterBarProps {
  filters: DashboardFilters;
  onFilterChange: (newFilters: DashboardFilters) => void;
  onClearFilters: () => void;
  onBuscarEstadisticas: () => void;
}

export interface DashboardFilters {
  clienteId?: string;
  proyectoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
}


const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onClearFilters, onBuscarEstadisticas }) => {

    const [clientes, setClientes] = React.useState<SelectCliente[]>([]);
    const [proyectos, setProyectos] = React.useState<SelectProyecto[]>([]);

    useEffect(() => {
        const fetchClientes = async () => {
            const response = await EstadisticasService.obtenerTotales({},"clientes");
            setClientes(response);
        };
        fetchClientes();

    }, []);

    useEffect(() => {
        const fetchProyectos = async () => {
            const response = await EstadisticasService.obtenerTotalesPara(filters.clienteId || "","proyectos");
            setProyectos(response);
        };
        fetchProyectos();

    }, [filters.clienteId]);
    
  
  const handleChange = (key: keyof DashboardFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value === "" ? undefined : value
    });
  };

  const handleBuscar = () => {
    onBuscarEstadisticas();
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        <Filter className="w-5 h-5" />
        <h2 className="font-semibold">Filtros Avanzados</h2>
      </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
        <div className="flex flex-col w-full mt-1">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Cliente
          </label>

          <Select
            value={
              filters.clienteId
                ? clientes.find((option) => String(option.id) === filters.clienteId) || null
                : null
            }
            options={clientes}
            getOptionLabel={(option) => option.nombre+" "+option.apellido}
            getOptionValue={(option) => String(option.id)}
            onChange={(option: any) => handleChange('clienteId', option ? String(option.id) : '')}
            placeholder="Seleccione"
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
                backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>

        <div className="flex flex-col w-full mt-1">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Proyecto
          </label>

          <Select
            value={
              filters.proyectoId
                ? proyectos.find((option) => String(option.id) === filters.proyectoId) || null
                : null
            }
            options={proyectos}
            getOptionLabel={(option) => option.nombre}
            getOptionValue={(option) => String(option.id)}
            onChange={(option: any) => handleChange('proyectoId', option ? String(option.id) : '')}
            placeholder="Seleccione"
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
                backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>

        <div className="flex flex-col w-full mt-7">
          <Input
          type="date"
          name="fechaInicio"
          className="pl-10 bg-white border-gray-300 text-black focus:border-blue-500 focus:ring-blue-500" 
          value={filters.fechaInicio}
          onChange={(e) => handleChange('fechaInicio', e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full mt-7">
          <Input
          type="date"
          name="fechaFin"
          className="pl-10 bg-white border-gray-300 text-black focus:border-blue-500 focus:ring-blue-500"
          value={filters.fechaFin}
          onChange={(e) => handleChange('fechaFin', e.target.value)}
          />
        </div>
    

  

        {/* Botón Limpiar */}
        <div className="flex flex-gap gap-6 items-end">
            <div className="" >
                <button 
                    onClick={onClearFilters}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    <X className="w-4 h-4" /> Limpiar
                </button>
            </div>
            <div className="" >
                <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
                onClick={() => handleBuscar()}
                >
                <Search size={20} />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
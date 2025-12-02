import { useEffect, useState } from 'react'
import { MonitorCog, PlusCircle, Recycle, Search, Trash } from 'lucide-react'
import { useSesion } from '../herramientas/context/SesionContext';
import RegistrarActualizarProyectoForm from './registrar-proyecto';
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from '../herramientas/alertas/alertas';
import Paginacion from '../herramientas/reutilizables/paginacion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { TablaAGGrid, type Column } from '../herramientas/tablas/tabla-flexible-ag-grid';
import { EstadoProyectoS, type ConsultarProyecto } from '../../interfaces/gestion-proyecto/interfaces-proyecto';
import ProyectoService from './proyecto-service';
import { TipoAlertaConfirmacion, TituloAlertaConfirmacion, useConfirmation } from '../herramientas/alertas/alertas-confirmacion';
import { Rol } from '../../interfaces/generales/interfaces-generales';
import type { SelectCliente } from '../../interfaces/generales/interfaces-generales';
import { EstadoBadge } from '../ui/EstadoBadge';
import Select from "react-select";

export default function ConsultarProyectos() {
  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;
  const rolId = sesion.rolId;
  const [proyectos, setProyectos] = useState<ConsultarProyecto[]>([])
  const [loading, setLoading] = useState(false)
  const [error,] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlerts()
  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation()
  const [clientes, setClientes] = useState<SelectCliente[]>([]);

  const [filtros, setFiltros] = useState({
    estado: 1,
    clienteId: "",
  });


  // MANEJO DE PAGINACION =======================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // MANEJO DE PAGINACION =======================================


  useEffect(() => {
    const fetchClientes = async () => {
      const response = await ProyectoService.obtenerTotales({}, "clientes");
      setClientes(response);
    };
    if (rolId !== Rol.CLIENTE) { 
      fetchClientes();
    }
  }, []);



  const handleDelete = async (id: string) => {

    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE,
      title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    })

    if (!confirmed) return

    try {
      await ProyectoService.eliminar(id, usuarioId)
      handleBuscarProyectos()
      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: "El proyecto se elimino correctamente.",
        autoClose: true,
        duration: 3000,
      })

    } catch (err: any) {
      
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se puede eliminar este elemento porque está siendo utilizada por uno o más productos.",
        autoClose: true,
        duration: 3000,
      })
    }
  }


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = async () => {
    closeModal()

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: "El proyecto se ha guardado correctamente.",
      autoClose: true,
      duration: 3000,
    })

    setLoading(true)

    const filtrosConPaginacion = {
      clienteId: filtros.clienteId,
      estado: filtros.estado,
      skip: skip,
      take: take,
    };

    const proyectos = await ProyectoService.obtener(filtrosConPaginacion)

    setLoading(false)
    setEntidadesTotales(proyectos.total)
    setPaginaActual(paginaActual)
    setProyectos(proyectos.data)
  }


  const handleBuscarProyectos = async (botonBuscar?:boolean) => {
    if (botonBuscar) {
      resetearPaginacion();
    }

    setLoading(true)

    const filtrosConPaginacion = {
      clienteId: filtros.clienteId,
      estado: filtros.estado,
      skip: skip,
      take: take,
    };

    let proyectosFiltrados = { data: [] as ConsultarProyecto[], total: 0 };

    proyectosFiltrados = await ProyectoService.obtener(filtrosConPaginacion);

    setLoading(false)
    setProyectos(proyectosFiltrados.data);
    setEntidadesTotales(proyectosFiltrados.total);
  };

  const handleBuscarRapido = async (estado:number) => {

    setLoading(true)

    const filtrosConPaginacion = {
      clienteId: filtros.clienteId,
      estado: estado,
      skip: skip,
      take: take,
    };

    let proyectosFiltrados = { data: [] as ConsultarProyecto[], total: 0 };

    proyectosFiltrados = await ProyectoService.obtener(filtrosConPaginacion);

    setLoading(false)
    setProyectos(proyectosFiltrados.data);
    setEntidadesTotales(proyectosFiltrados.total);
  };



    // MANEJO DE PAGINACION ===========================================

    
  
  useEffect(() => {
    handleBuscarProyectos()
  }, [paginaActual])
  
  const handlePageChange = (skip: number, take: number, paginaActual: number) => {
    console.log("entra en handlePageChange con skip:", skip, "take:", take, "paginaActual:", paginaActual);
    setSkip(skip);
    setTake(take);
    setPaginaActual(paginaActual);
    
  };

  function resetearPaginacion(){
    setSkip(0);
    setPaginaActual(1);
  }

  const columns: Column<ConsultarProyecto>[] = [
    {
      header: "Nombre",
      accessor: "nombre",
      flex: 1.3,
      type: "text",
      editable: false,
      formatFunction: ({ value, row }) => (
        <div className="flex flex-col">
          <div
            className="flex items-center gap-1 truncate whitespace-nowrap max-w-[700px]"
            title={typeof value === "string" ? `${value}${row.descripcion ? `\n${row.descripcion}` : ""}` : undefined}
          >
            <span>{value}</span>
          </div>
          {row.descripcion && <div className="text-sm text-gray-500 truncate max-w-[700px]">{row.descripcion}</div>}
        </div>
      ),
      scrollable: false,
    },
    {
      header: "Estado",
      accessor: "estado",
      flex: 0.5,
      formatFunction: ({ value }) => <EstadoBadge estado={EstadoProyectoS[value]} />,
    },
    {
      header: "Cliente",
      accessor: "cliente",
      flex: 0.3,
      formatFunction: ({ value }) => <span>{value ? `${value.nombre} ${value.apellido}` : ""}</span>,
    },
  ];

  const handleLimpiarFiltros = () => {
    setFiltros({
      estado: 1,
      clienteId: "",
    })
  }

  return (
    <div className="w-full">
    
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando proyectos...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : (
            <>
              <Card className="bg-transparent border-transparent">
                <CardHeader className="form-header flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-6">
                  {/* CONTENEDOR IZQUIERDO */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">

                    <CardTitle className="flex items-center space-x-2">
                      <MonitorCog className="consultar-icon" />
                      <span>Proyectos</span>
                    </CardTitle>

                    {/* FILTROS */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">

                      {/* ESTADO */}
                      <div className="flex flex-col w-full sm:w-[48%] md:w-[200px]">
                        <label className="mb-1 text-sm font-medium text-white">
                          Estado
                        </label>

                        <Select
                          value={
                            Object.entries(EstadoProyectoS)
                              .map(([key, value]) => ({
                                value: Number(key),
                                label: value // or provide a more user-friendly label if needed
                              }))
                              .find((option) => Number(option.value) === filtros.estado) || null
                          }
                          options={Object.entries(EstadoProyectoS).map(([key, value]) => ({
                            value: Number(key),
                            label: value,
                          }))}
                          onChange={(selectedOption) => {
                            setFiltros({ ...filtros, estado: Number(selectedOption?.value) })
                            if (rolId === Rol.CLIENTE) {
                              handleBuscarRapido(Number(selectedOption?.value))
                            }
                          }}
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
                      

                      {/* CLIENTE */}
                      {rolId === Rol.CLIENTE ? null : (
                      <div className="flex flex-col w-full sm:w-[48%] md:w-[240px]">
                        <label className="mb-1 text-sm font-medium text-white">
                          Cliente
                        </label>

                        <Select
                          value={
                            filtros.clienteId
                              ? clientes.find((option) => String(option.id) === filtros.clienteId) || null
                              : null
                          }
                          options={clientes}
                          getOptionLabel={(option) => option.nombre}
                          getOptionValue={(option) => String(option.id)}
                          onChange={(selectedOption) => {
                            setFiltros({
                              ...filtros,
                              clienteId: selectedOption ? String(selectedOption.id) : ""
                            });
                          }}
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
                      )}

                      {/* BOTÓN LIMPIAR */}
                      <div className="flex flex-col w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="mt-5 bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full border-transparent shadow-md transition"
                          onClick={handleLimpiarFiltros}
                        >
                          <Recycle size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* CONTENEDOR DERECHA (Botones) */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full border-transparent shadow-md transition"
                      onClick={() => handleBuscarProyectos(true)}
                    >
                      <Search size={20} />
                    </Button>

                    {rolId !== Rol.CLIENTE && (
                      <Button
                        className="bg-blue-500 hover:bg-blue-700 text-white flex items-center px-4 py-3"
                        onClick={openModal}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                      </Button>
                    )}
                  </div>

                </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                <TablaAGGrid
                  columns={columns}
                  data={proyectos}
                  onUpdate={() => {}}
                  actions={(row) => (
                    <> 
                    { rolId !== Rol.CLIENTE && ( 
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(row.id)}
                          className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-800"
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    )}
                    </>
                  )}
                  actionsFlex={0.5}
                  rowHeight={50}
                />
              </div>
              </CardContent>
            </Card>


              <div className="mt-6">
                <Paginacion
                  entidadesTotales={entidadesTotales}
                  take={take}
                  paginaActual={paginaActual}
                  onChange={handlePageChange}
                />
              </div>
              <Alertas alerts={alerts} onRemove={removeAlert} />
              <AlertasConfirmacion />
            </>
          )}
        </div>

           {isModalOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                 <div className="p-6">
                   <RegistrarActualizarProyectoForm onClose={closeModal} onSuccess={handleSuccess} />
                 </div>
               </div>
             </div>
           )}
     
    </div>
  )
}


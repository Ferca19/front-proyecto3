import { useState, useEffect } from "react";
import { Pencil, PlusCircle, Trash, Package, Clock, Eye, MessageCircle, Search, Recycle, ArrowBigRight, Lock, LockIcon } from "lucide-react";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import Paginacion from "../../herramientas/reutilizables/paginacion";
import { TablaAGGrid, type Column } from "../../herramientas/tablas/tabla-flexible-ag-grid";
import { TipoAlertaConfirmacion, TituloAlertaConfirmacion, useConfirmation } from "../../herramientas/alertas/alertas-confirmacion";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../herramientas/alertas/alertas";
import { CriticidadReclamoS, EstadoReclamoS, PrioridadReclamoS, TipoReclamoS, type Comentario, type HistorialReclamo, type Reclamo } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";
import ReclamoService from "./reclamo-service";
import { useSesion } from "../../herramientas/context/SesionContext";
import { EstadoBadge } from "../../ui/EstadoBadge";
import { Rol, type SelectCliente } from "../../../interfaces/generales/interfaces-generales";
import RegistrarActualizarReclamoForm from "./registrar-actualizar-reclamo";
import HistorialReclamoForm from "../historial-reclamo/historial-reclamo";
import ComentariosForm from "../comentarios-reclamo/comentarios-reclamo";
import type { SelectProyecto } from "../../../interfaces/gestion-proyecto/interfaces-proyecto";
import Select from "react-select";
import AsignarReclamoForm from "./asignar-reclamo";
import CambiarPrioridadForm from "./cambiar-prioridad";
import CambiarEstadoReclamoForm from "./cambiar-estado";

export default function ConsultarReclamos() {
  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;
  const rolId = sesion.rolId;
  const [reclamos, setReclamo] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, ] = useState<string | null>(null);
  const [mostrarActualizarReclamo, setMostrarActualizarReclamo] = useState(false);
  const [mostrarVisualizarReclamo, setMostrarVisualizarReclamo] = useState(false);
  const [mostrarAsignarReclamo, setMostrarAsignarReclamo] = useState(false);
  const [mostrarCambiarPrioridadYCriticidad, setMostrarCambiarPrioridadYCriticidad] = useState(false);
  const [mostrarCambiarEstado, setMostrarCambiarEstado] = useState(false);
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo>({} as Reclamo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation();
  const [historialReclamo, setHistorialReclamo] = useState<HistorialReclamo[]>([]);
  const [mostrarHistorialReclamo, setMostrarHistorialReclamo] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [proyectos, setProyectos] = useState<SelectProyecto[]>([]);
  const [clientes, setClientes] = useState<SelectCliente[]>([]);

  const [filtros, setFiltros] = useState({
    proyectoId: "",
    clienteId: "",
  });

  console.log("Filtros actuales:", filtros);

  // MANEJO DE PAGINACION =======================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // MANEJO DE PAGINACION =======================================


  useEffect(() => {
    const fetchClientes = async () => {
      const response = await ReclamoService.obtenerTotales({}, "clientes");
      setClientes(response);
    };
    if (rolId !== Rol.CLIENTE) { 
      fetchClientes();
    }

  }, []);

  useEffect(() => {
    const fetchProyectos = async () => {
      let response;
      if (rolId === Rol.CLIENTE) {
        response = await ReclamoService.obtenerTotalesPara(usuarioId, "proyectos");
      } else {
        response = await ReclamoService.obtenerTotalesPara(filtros.clienteId, "proyectos");
      }
      setProyectos(response);
    };
    if (filtros.clienteId.length > 0 || rolId === Rol.CLIENTE) {
      fetchProyectos();
    }
  }, [filtros.clienteId]);


  const handleAbrirActualizarReclamo = async (id: string) => {
    if (id) {
      const reclamo = await ReclamoService.obtenerId(id);
      setReclamoSeleccionado(reclamo);
      setMostrarActualizarReclamo(true);
    }
  };

  const handleCerrarActualizarReclamo = () => {
    setMostrarActualizarReclamo(false);
    setReclamoSeleccionado({} as Reclamo); // Reset de la marca seleccionada
  };

  const handleAbrirVisualizarReclamo = async (id: string) => {
    if (id) {
      const reclamo = await ReclamoService.obtenerId(id);
      setReclamoSeleccionado(reclamo);
      setMostrarVisualizarReclamo(true);
    }
  };

  const handleCerrarVisualizarReclamo = () => {
    setMostrarVisualizarReclamo(false);
    setReclamoSeleccionado({} as Reclamo); // Reset de la marca seleccionada
  };

  const handleAbrirHistorialReclamo = async (id: string) => {
    if (id) {
      const historial = await ReclamoService.obtenerHistorial(id);
      setHistorialReclamo(historial);
      setMostrarHistorialReclamo(true);
    }
  };

  const handleCerrarHistorialReclamo = () => {
    setMostrarHistorialReclamo(false);
    setHistorialReclamo([]); 
  };


   const handleAbrirComentarios = async (id: string) => {
    if (id) {
      /*
      const response = await ReclamoService.obtenerComentarios(id);
      setComentarios(response);
      */
      setMostrarComentarios(true);
    }
  };

  const handleCerrarComentarios = () => {
    setMostrarComentarios(false);
    setComentarios([]); 
  };

  const handleAbrirAsignarReclamo = async (id: string) => {
    if (id) {
      const reclamo = await ReclamoService.obtenerId(id);
      setReclamoSeleccionado(reclamo);
      setMostrarAsignarReclamo(true);
    }
  };

  const handleCerrarAsignarReclamo = () => {
    setMostrarAsignarReclamo(false);
    setReclamoSeleccionado({} as Reclamo); // Reset de la marca seleccionada
  };

  const handleCambiarPrioridadYCriticidad = async (id: string) => {
    if (id) {
      const reclamo = await ReclamoService.obtenerId(id);
      setReclamoSeleccionado(reclamo);
      setMostrarCambiarPrioridadYCriticidad(true);
    }
  };

  const handleCerrarCambiarPrioridadYCriticidad = () => {
    setMostrarCambiarPrioridadYCriticidad(false);
    setReclamoSeleccionado({} as Reclamo); // Reset de la marca seleccionada
  };

  const handleAbrirCambiarEstado = async (id: string) => {
    if (id) {
      const reclamo = await ReclamoService.obtenerId(id);
      setReclamoSeleccionado(reclamo);
      setMostrarCambiarEstado(true);
    }
  };

  const handleCerrarCambiarEstado = () => {
    setMostrarCambiarEstado(false);
    setReclamoSeleccionado({} as Reclamo); // Reset de la marca seleccionada
  };

  


  const handleDelete = async (id: string) => {
    
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE,
      title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (!confirmed) return;

    try {
      await ReclamoService.eliminar(id, usuarioId);
      handleBuscarReclamos();
      
      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: "El reclamo se elimino correctamente",
        autoClose: true,
        duration: 3000,
      });
    } catch (err: any) {
      
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se puede eliminar este elemento porque está siendo utilizado",
        autoClose: true,
        duration: 3000,
      });
    }
  };



  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = async () => {
    closeModal();

    setLoading(true);

    const filtrosConPaginacion = {
      usuarioId: usuarioId,
      proyectoId: filtros.proyectoId,
      skip: skip,
      take: take,
    };

    const reclamosFiltrados = await ReclamoService.obtener(filtrosConPaginacion);

    setEntidadesTotales(reclamosFiltrados.total);
    setPaginaActual(paginaActual);
    setReclamo(reclamosFiltrados.data);
    setLoading(false);
  };

  const handleActualizarSuccess = async () => {
    closeModal();

    setLoading(true);

    await handleBuscarReclamos();
  };

  const handleAsignarSuccess = async () => {
    closeModal();

    setLoading(true);

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: "El reclamo se agino correctamente",
      autoClose: true,
      duration: 3000,
    });

    await handleBuscarReclamos();
  };

  const handleCambiarPrioridadYCriticidadSuccess = async () => {
    closeModal();

    setLoading(true);

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: "La prioridad y criticidad se cambiaron correctamente",
      autoClose: true,
      duration: 3000,
    });

    await handleBuscarReclamos();
  };

  const handleCambiarEstadoSuccess = async () => {
    closeModal();

    setLoading(true);

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: "El estado se cambio correctamente",
      autoClose: true,
      duration: 3000,
    });

    await handleBuscarReclamos();
  };

  const handleBuscarReclamos = async (botonBuscar?: boolean) => {

    if (botonBuscar) {
      resetearPaginacion();
    }
    setLoading(true);

    const filtrosConPaginacion = {
      //usuarioId: usuarioId,
      //proyectoId: filtros.proyectoId,
      skip: skip,
      take: take,
    };

    const reclamosFiltrados = await ReclamoService.obtener(filtrosConPaginacion);
    setReclamo(reclamosFiltrados.data);
    setEntidadesTotales(reclamosFiltrados.total);
    setLoading(false);
  };

  // MANEJO DE PAGINACION ===========================================

  useEffect(() => {
    handleBuscarReclamos();
  }, [paginaActual, take]);

  const handlePageChange = (skip: number, take: number, paginaActual: number) => {
    setSkip(skip);
    setTake(take);
    setPaginaActual(paginaActual);
  };

  function resetearPaginacion() {
    setSkip(0);
    setPaginaActual(1);
  }

  const handleLimpiarFiltros = () => {
    setFiltros({
      proyectoId: "",
      clienteId: "",
    })
  }

  // MANEJO DE PAGINACION ===========================================

  const columns: Column<Reclamo>[] = [
    {
      header: "Título",
      accessor: "titulo",
      flex: 1,
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
      header: "Tipo",
      accessor: "tipo",
      flex: 0.3,
      formatFunction: ({ value }) => <EstadoBadge estado={TipoReclamoS[value]} />,
    },
    {
      header: "Estado",
      accessor: "estado",
      flex: 0.3,
      formatFunction: ({ value }) => <EstadoBadge estado={EstadoReclamoS[value]} />,
    },
    {
      header: "Prioridad",
      accessor: "prioridad",
      flex: 0.3,
      formatFunction: ({ value }) => <EstadoBadge estado={PrioridadReclamoS[value]} />,
    },
    {
      header: "Criticidad",
      accessor: "criticidad",
      flex: 0.3,
      formatFunction: ({ value }) => <EstadoBadge estado={CriticidadReclamoS[value]} />,
    },
    
  ];


  return (
    <div className="w-full">
      {/* Contenido Principal */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando reclamos...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>

            <Card className="border-gray-200 dark:border-slate-700">
              <CardHeader className="form-header  flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="consultar-icon" />
                    <span>Reclamo</span>
                  </CardTitle>

                  {/* CLIENTE */}
                  {rolId === Rol.CLIENTE ? null : (
                  <div className="flex flex-col w-full sm:w-[48%] md:w-[240px]">
                    <label className="mb-1 text-sm font-medium text-gray-700">
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

                  <div className="flex flex-col w-full sm:w-[48%] md:w-[240px]">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Proyecto
                    </label>

                    <Select
                      value={
                        filtros.proyectoId
                          ? proyectos.find((option) => String(option.id) === filtros.proyectoId) || null
                          : null
                      }
                      options={proyectos}
                      getOptionLabel={(option) => option.nombre}
                      getOptionValue={(option) => String(option.id)}
                      onChange={(selectedOption) => {
                        setFiltros({
                          ...filtros,
                          proyectoId: selectedOption ? String(selectedOption.id) : ""
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

                  <div className="flex flex-col w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="mt-5 bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
                      onClick={handleLimpiarFiltros}
                    >
                      <Recycle size={20} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
                    onClick={() => handleBuscarReclamos(true)}
                  >
                    <Search size={20} />
                  </Button>
                  {rolId === Rol.CLIENTE && ( 
                    <Button
                      className="bg-blue-500 hover:bg-blue-700 text-white flex items-center w-full md:w-auto justify-center px-4 py-3"
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
                    data={reclamos}
                    onUpdate={() => {}}
                    actions={(row) => (
                      <div className="flex justify-end space-x-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirVisualizarReclamo(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Visualizar reclamo"
                          >
                            <Eye size={18} />
                        </Button>
                        {(rolId == Rol.ADMINISTRADOR || rolId == Rol.EMPLEADO) && (
                        <>
                          {rolId === Rol.ADMINISTRADOR && (
                          <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirHistorialReclamo(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Actualizar reclamo"
                          >
                            <Clock size={18} />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarPrioridadYCriticidad(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Cambiar Prioridad y Criticidad"
                          >
                            <Lock size={18} />
                          </Button>
                          </>
                          )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirAsignarReclamo(row.id)}
                          className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                          title="Asignar reclamo"
                        >
                          <ArrowBigRight size={18} />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirActualizarReclamo(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Actualizar reclamo"
                          >
                            <Pencil size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirComentarios(row.id)}
                          className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                          title="Actualizar reclamo"
                        >
                          <MessageCircle size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(row.id)}
                          className={`w-8 h-8 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-800`}
                          title="Eliminar reclamo"
                        >
                          <Trash size={18} />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirCambiarEstado(row.id)}
                          className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                          title="Actualizar reclamo"
                        >
                          <LockIcon size={18} />
                        </Button>
                        </>
                        )}
                      </div>
                    )}
                    actionsFlex={0.5}
                    actionsScrollable={true}
                    rowHeight={55}
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

          </>
        )}
      </div>

      {/* Modales*/}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RegistrarActualizarReclamoForm onClose={closeModal} onSuccess={handleSuccess}  />
          </div>
        </div>
      )}

      {mostrarVisualizarReclamo && reclamoSeleccionado !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RegistrarActualizarReclamoForm
              reclamo={reclamoSeleccionado}
              onClose={handleCerrarVisualizarReclamo}
              onSuccess={() => {}}
              visualizar={true}
            />
          </div>
        </div>
      )}

      {mostrarActualizarReclamo && reclamoSeleccionado !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RegistrarActualizarReclamoForm
              reclamo={reclamoSeleccionado}
              onClose={handleCerrarActualizarReclamo}
              onSuccess={handleActualizarSuccess}
            />
          </div>
        </div>
      )}

      {mostrarHistorialReclamo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[95%] max-w-8xl h-[90vh] md:h-[700px] shadow-2xl rounded-2xl overflow-hidden bg-white">
            <HistorialReclamoForm
              historial={historialReclamo}
              onClose={handleCerrarHistorialReclamo}
            />
          </div>
        </div>
      )}

      {mostrarComentarios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <ComentariosForm
              comentarios={comentarios}
              onClose={handleCerrarComentarios}
            />
          </div>
        </div>
      )}

      {mostrarAsignarReclamo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <AsignarReclamoForm
              reclamo = {reclamoSeleccionado}
              onClose={handleCerrarAsignarReclamo}
              onSuccess = {handleAsignarSuccess}
            />
          </div>
        </div>
      )}

      {mostrarCambiarPrioridadYCriticidad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <CambiarPrioridadForm
              reclamo = {reclamoSeleccionado}
              onClose={handleCerrarCambiarPrioridadYCriticidad}
              onSuccess = {handleCambiarPrioridadYCriticidadSuccess}
            />
          </div>
        </div>
      )}

      {mostrarCambiarEstado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <CambiarEstadoReclamoForm
              reclamo = {reclamoSeleccionado}
              onClose={handleCerrarCambiarEstado}
              onSuccess = {handleCambiarEstadoSuccess}
            />
          </div>
        </div>
      )}
      <Alertas alerts={alerts} onRemove={removeAlert} />
      <AlertasConfirmacion />
    </div>
  );
}

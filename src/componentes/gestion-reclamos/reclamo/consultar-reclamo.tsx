import { useState, useEffect } from "react";
import { PlusCircle, Clock, Eye, MessageCircle, Search, Recycle, ArrowBigRight, RefreshCcw, X, ArrowUp, Triangle, MailWarning } from "lucide-react";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import Paginacion from "../../herramientas/reutilizables/paginacion";
import { TablaAGGrid, type Column } from "../../herramientas/tablas/tabla-flexible-ag-grid";
import { TipoAlertaConfirmacion, TituloAlertaConfirmacion, useConfirmation } from "../../herramientas/alertas/alertas-confirmacion";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../herramientas/alertas/alertas";
import { CriticidadReclamoS, EstadoReclamo, EstadoReclamoS, PrioridadReclamoS, TipoReclamoS, type Comentario, type HistorialReclamo, type Reclamo } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";
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
import type { Area } from "../../../interfaces/gestion-usuario/interfaces-usuario";
import CambiarCriticidadForm from "./cambiar-criticidad";

export default function ConsultarReclamos() {
  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;
  const rolId = sesion.rolId;
  const [reclamos, setReclamo] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, ] = useState<string | null>(null);
  const [mostrarVisualizarReclamo, setMostrarVisualizarReclamo] = useState(false);
  const [mostrarAsignarReclamo, setMostrarAsignarReclamo] = useState(false);
  const [mostrarCambiarPrioridad, setMostrarCambiarPrioridad] = useState(false);
  const [mostrarCambiarCriticidad, setMostrarCambiarCriticidad] = useState(false);
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
  const [areas, setAreas] = useState<Area[]>([]);

  const [filtros, setFiltros] = useState({
    proyectoId: "",
    clienteId: "",
    areaId: ""
  });


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
    const fetchAreas = async () => {
      const response = await ReclamoService.obtenerTotales({}, "areas");
      setAreas(response);
    };
    if (rolId === Rol.ADMINISTRADOR) { 
      fetchAreas();
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
      const response = await ReclamoService.obtenerComentarios(id);
      setComentarios(response);
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

  const handleCambiarPrioridad = async (id: string) => {
    if (id) {
      const reclamo = await ReclamoService.obtenerId(id);
      setReclamoSeleccionado(reclamo);
      setMostrarCambiarPrioridad(true);
    }
  };

  const handleCerrarCambiarPrioridad = () => {
    setMostrarCambiarPrioridad(false);
    setReclamoSeleccionado({} as Reclamo); // Reset de la marca seleccionada
  };

  const handleCambiarCriticidad = async (id: string) => {
    if (id) {
      const reclamo = await ReclamoService.obtenerId(id);
      setReclamoSeleccionado(reclamo);
      setMostrarCambiarCriticidad(true);
    }
  };

  const handleCerrarCambiarCriticidad = () => {
    setMostrarCambiarCriticidad(false);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCancelarReclamo= async (id: string) => {
    if (id) {
      const confirmed = await showConfirmation({
        type: TipoAlertaConfirmacion.DESTRUCTIVE,
        title: TituloAlertaConfirmacion.DESTRUCTIVE,
        message: "¿Estás seguro de que quieres cancelar este reclamo? Esta acción no se puede deshacer.",
        confirmText: "Eliminar",
        cancelText: "Cancelar",
        onConfirm: () => {},
      });

      if (!confirmed) return;
      await ReclamoService.cancelar(id);
      handleBuscarReclamos();
    }
  };

  const handleSuccess = async () => {
    closeModal();

    setLoading(true);

    const filtrosConPaginacion = {
      clienteId: filtros.clienteId,
      proyectoId: filtros.proyectoId,
      areaId: filtros.areaId,
      skip: skip,
      take: take,
    };

    const reclamosFiltrados = await ReclamoService.obtener(filtrosConPaginacion);

    setEntidadesTotales(reclamosFiltrados.total);
    setPaginaActual(paginaActual);
    setReclamo(reclamosFiltrados.data);
    setLoading(false);
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

  const handleCambiarPrioridadSuccess = async () => {
    closeModal();

    setLoading(true);

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: "La prioridad se cambio correctamente",
      autoClose: true,
      duration: 3000,
    });

    await handleBuscarReclamos();
  };

  const handleCambiarCriticidadSuccess = async () => {
    closeModal();

    setLoading(true);

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: "La criticidad se cambio correctamente",
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
      clienteId: filtros.clienteId,
      proyectoId: filtros.proyectoId,
      areaId: filtros.areaId,
      skip: skip,
      take: take,
    };

    const reclamosFiltrados = await ReclamoService.obtener(filtrosConPaginacion);
    setReclamo(reclamosFiltrados.data);
    setEntidadesTotales(reclamosFiltrados.total);
    setLoading(false);
  };

  const handleBuscarRapido = async (proyectoId: string) => {
    setLoading(true);
    const filtrosConPaginacion = {
      usuarioId: usuarioId,
      proyectoId: proyectoId,
      skip: skip,
      take: take,
    };
    const reclamosFiltrados = await ReclamoService.obtener(filtrosConPaginacion);
    setLoading(false);
    setReclamo(reclamosFiltrados.data);
    setEntidadesTotales(reclamosFiltrados.total);
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
      areaId: ""
    })
  }

  // MANEJO DE PAGINACION ===========================================

  const columns: Column<Reclamo>[] = [
    {
      header: "Título",
      accessor: "titulo",
      flex: 0.9,
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
    {
      header: "Área Actual",
      accessor: "area",
      flex: 0.3,
      formatFunction: ({ value }) => <span>{value?.nombre ?? ""}</span>,
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

            <Card className="bg-transparent border-transparent overflow-hidden">
              <CardHeader className="form-header flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
                  <CardTitle className="flex items-center space-x-2">
                    <MailWarning className="consultar-icon" />
                    <span>Reclamo</span>
                  </CardTitle>

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
                      getOptionLabel={(option) => option.nombre+" "+option.apellido}
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
                    <label className="mb-1 text-sm font-medium text-white">
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
                        const proyectoId = selectedOption ? String(selectedOption.id) : "";
                        setFiltros({
                          ...filtros,
                          proyectoId
                        });
                        if (rolId === Rol.CLIENTE) { 
                          handleBuscarRapido(proyectoId);
                        }
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

                  {rolId === Rol.ADMINISTRADOR ? (
                  <div className="flex flex-col w-full sm:w-[48%] md:w-[240px]">
                    <label className="mb-1 text-sm font-medium text-white">
                      Area
                    </label>

                    <Select
                      value={
                        filtros.areaId
                          ? areas.find((option) => String(option.id) === filtros.areaId) || null
                          : null
                      }
                      options={areas}
                      getOptionLabel={(option) => option.nombre}
                      getOptionValue={(option) => String(option.id)}
                      onChange={(selectedOption) => {
                        setFiltros({
                          ...filtros,
                          areaId: selectedOption ? String(selectedOption.id) : ""
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
                  ) : null}

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

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full border-transparent shadow-md transition"
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
                            title="Visualizar"
                          >
                            <Eye size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirHistorialReclamo(row.id)}
                          className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                          title="Ver Recorrido"
                        >
                          <Clock size={18} />
                        </Button>
                        {(rolId == Rol.ADMINISTRADOR || rolId == Rol.EMPLEADO) && (
                        <>
                          {rolId === Rol.ADMINISTRADOR && (
                          <>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarPrioridad(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            disabled={row.estado === EstadoReclamo.CERRADO || row.estado === EstadoReclamo.CANCELADO || row.estado === EstadoReclamo.RESUELTO}
                            title="Cambiar Prioridad"
                          >
                            <ArrowUp size={18} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarCriticidad(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            disabled={row.estado === EstadoReclamo.CERRADO || row.estado === EstadoReclamo.CANCELADO || row.estado === EstadoReclamo.RESUELTO}
                            title="Cambiar Criticidad"
                          >
                            <Triangle size={18} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirAsignarReclamo(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            disabled={!(row.estado === EstadoReclamo.ASIGNADO || row.estado === EstadoReclamo.EN_ANALISIS || row.estado === EstadoReclamo.PENDIENTE)}
                            title="Asignar Area"
                          >
                            <ArrowBigRight size={18} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelarReclamo(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            disabled={!(row.estado === EstadoReclamo.ASIGNADO)}
                            title="Cancelar"
                          >
                            <X size={18} />
                          </Button>
                          </>
                          )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirComentarios(row.id)}
                          className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                          disabled={!(row.estado === EstadoReclamo.EN_PROGRESO )}
                          title="Comentarios"
                        >
                          <MessageCircle size={18} />
                        </Button>
                        {rolId === Rol.EMPLEADO && row.estado === EstadoReclamo.RESUELTO ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirCambiarEstado(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            disabled
                            title="Cambiar Estado"
                          >
                            <RefreshCcw size={18} />
                          </Button>
                        ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirCambiarEstado(row.id)}
                          className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                          disabled={!(row.estado === EstadoReclamo.ASIGNADO || row.estado === EstadoReclamo.EN_ANALISIS || row.estado === EstadoReclamo.EN_PROGRESO || row.estado === EstadoReclamo.RESUELTO)}
                          title="Cambiar Estado"
                        >
                          <RefreshCcw size={18} />
                        </Button>
                        )}
                        </>
                        )}
                      </div>
                    )}
                    actionsFlex={0.5}
                    actionsScrollable={true}
                    rowHeight={60}
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

      {mostrarCambiarPrioridad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <CambiarPrioridadForm
              reclamo = {reclamoSeleccionado}
              onClose={handleCerrarCambiarPrioridad}
              onSuccess = {handleCambiarPrioridadSuccess}
            />
          </div>
        </div>
      )}

      {mostrarCambiarCriticidad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <CambiarCriticidadForm
              reclamo = {reclamoSeleccionado}
              onClose={handleCerrarCambiarCriticidad}
              onSuccess = {handleCambiarCriticidadSuccess}
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

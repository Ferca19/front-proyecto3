import { useState, useEffect } from "react";
import { Pencil, PlusCircle, Trash, Package, Clock, Eye, MessageCircle } from "lucide-react";
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
import { Rol } from "../../../interfaces/generales/interfaces-generales";
import RegistrarActualizarReclamoForm from "./registrar-actualizar-reclamo";
import HistorialReclamoForm from "../historial-reclamo/historial-reclamo";
import ComentariosForm from "../comentarios-reclamo/comentarios-reclamo";

export default function ConsultarReclamos() {
  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;
  const rolId = sesion.rolId;
  const [reclamos, setReclamo] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, ] = useState<string | null>(null);
  const [mostrarActualizarReclamo, setMostrarActualizarReclamo] = useState(false);
  const [mostrarVisualizarReclamo, setMostrarVisualizarReclamo] = useState(false);
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo>({} as Reclamo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation();
  const [historialReclamo, setHistorialReclamo] = useState<HistorialReclamo[]>([]);
  const [mostrarHistorialReclamo, setMostrarHistorialReclamo] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  // MANEJO DE PAGINACION =======================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // MANEJO DE PAGINACION =======================================


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
    console.log("ID Reclamo para historial:", id);
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
      handleBuscarReclamo();
      
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

    await handleBuscarReclamo();
  };

  const handleBuscarReclamo = async (botonBuscar?: boolean) => {

    if (botonBuscar) {
      resetearPaginacion();
    }
    setLoading(true);

    const filtrosConPaginacion = {
      usuarioId: usuarioId,
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
    handleBuscarReclamo();
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
              <CardHeader className="form-header  flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="consultar-icon" />
                    <span>Reclamo</span>
                  </CardTitle>


                </div>

                <div className="flex items-center gap-2">
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
                            onClick={() => handleAbrirVisualizarReclamo(row._id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Visualizar reclamo"
                          >
                            <Eye size={18} />
                        </Button>
                        {(rolId == Rol.ADMINISTRADOR || rolId == Rol.EMPLEADO) && (
                        <>
                          {rolId === Rol.ADMINISTRADOR && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirHistorialReclamo(row._id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Actualizar reclamo"
                          >
                            <Clock size={18} />
                          </Button>
                          )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirActualizarReclamo(row._id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Actualizar reclamo"
                          >
                            <Pencil size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirComentarios(row._id)}
                          className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                          title="Actualizar reclamo"
                        >
                          <MessageCircle size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(row._id)}
                          className={`w-8 h-8 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-800`}
                          title="Eliminar reclamo"
                        >
                          <Trash size={18} />
                        </Button>
                        </>
                        )}
                      </div>
                    )}
                    actionsFlex={0.5}
                    actionsScrollable={false}
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
      <Alertas alerts={alerts} onRemove={removeAlert} />
      <AlertasConfirmacion />
    </div>
  );
}

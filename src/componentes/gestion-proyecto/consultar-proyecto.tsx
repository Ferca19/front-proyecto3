import { useEffect, useState } from 'react'
import { CreditCard, PlusCircle, Trash } from 'lucide-react'
import { useSesion } from '../herramientas/context/SesionContext';
import RegistrarActualizarProyectoForm from './registrar-proyecto';
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from '../herramientas/alertas/alertas';
import Paginacion from '../herramientas/reutilizables/paginacion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { TablaAGGrid, type Column } from '../herramientas/tablas/tabla-flexible-ag-grid';
import type { ConsultarProyecto } from '../../interfaces/gestion-proyecto/interfaces-proyecto';
import ProyectoService from './proyecto-service';
import { TipoAlertaConfirmacion, TituloAlertaConfirmacion, useConfirmation } from '../herramientas/alertas/alertas-confirmacion';
import { Rol } from '../../interfaces/generales/interfaces-generales';

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

  // MANEJO DE PAGINACION =======================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // MANEJO DE PAGINACION =======================================



  const handleDelete = async (id: number) => {

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
      setProyectos(proyectos.filter((presentacion) => presentacion.id !== id))
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
      message: "mensajeAlerta",
      autoClose: true,
      duration: 3000,
    })

    setLoading(true)

    const filtrosConPaginacion = {
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
      skip: skip,
      take: take,
    };

    let proyectosFiltrados = { data: [] as ConsultarProyecto[], total: 0 };

    if (rolId === Rol.CLIENTE) {
      proyectosFiltrados = await ProyectoService.obtenerTotalesDe(filtrosConPaginacion, usuarioId);
    } else {
      proyectosFiltrados = await ProyectoService.obtener(filtrosConPaginacion);
    }

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
      header: 'Nombre', 
      accessor: 'nombre',
      flex: 1,
      type: 'text',
      editable: false,
    },
  ];

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
              <Card className="border-gray-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-6">
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="consultar-icon" />
                    <span>Proyectos</span>
                  </CardTitle>
                </div>

                {/* Contenedor de botones */}
                <div className="flex items-center gap-2">
                  { rolId !== Rol.CLIENTE && ( 
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
                  vacioFlex={0.5}
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


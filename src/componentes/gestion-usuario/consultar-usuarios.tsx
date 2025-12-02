import { useState, useEffect } from "react";
import { PlusCircle, Search, Trash, User } from "lucide-react";
import { Button } from "../ui/Button";
import RegistrarUsuario from "./registrar-usuario";
import Paginacion from "../herramientas/reutilizables/paginacion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { TablaAGGrid, type Column } from "../herramientas/tablas/tabla-flexible-ag-grid";
import UsuarioService from "./usuario-service";
import { RolesS, type Usuario } from "../../interfaces/gestion-usuario/interfaces-usuario";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../herramientas/alertas/alertas";
import { TipoAlertaConfirmacion, TituloAlertaConfirmacion, useConfirmation } from "../herramientas/alertas/alertas-confirmacion";
import Select from "react-select";
import { Rol } from "../../interfaces/generales/interfaces-generales";
import { useSesion } from "../herramientas/context/SesionContext";

export default function ConsultarUsuarios() {

  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, ] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation();

  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);

  const [filtros, setFiltros] = useState({
    rolId: 3,
  });




  // Realizar la búsqueda cada vez que el término cambia
 

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

      await UsuarioService.eliminar(id, usuarioId);
      handleBuscarUsuarios();
      
      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: "El usuario se elimino correctamente",
        autoClose: true,
        duration: 3000,
      });
    } catch (err: any) {
      
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se pudo eliminar este elemento",
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

  const handleBuscarUsuarios = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      resetearPaginacion();
    }
    setLoading(true);
    const filtrosConPaginacion = {
      rolId: filtros.rolId,
      skip: skip,
      take: take,
    };
    const usuariosFiltrados = await UsuarioService.obtener(filtrosConPaginacion);
    setLoading(false);
    setUsuarios(usuariosFiltrados.data);
    setEntidadesTotales(usuariosFiltrados.total);
  };

  const handleBuscarRapido = async (rolId: number) => {
    setLoading(true);
    const filtrosConPaginacion = {
      rolId: rolId,
      skip: skip,
      take: take,
    };
    const usuariosFiltrados = await UsuarioService.obtener(filtrosConPaginacion);
    setLoading(false);
    setUsuarios(usuariosFiltrados.data);
    setEntidadesTotales(usuariosFiltrados.total);
  };


  const handleSuccess = async () => {
    closeModal();

    setLoading(true);

    const filtrosConPaginacion = {
      rolId: filtros.rolId,
      skip: skip,
      take: take,
    };

    const usuarios = await UsuarioService.obtener(filtrosConPaginacion);

    setLoading(false);
    setEntidadesTotales(usuarios.total);
    setPaginaActual(paginaActual);
    setUsuarios(usuarios.data);
  };

  // MANEJO DE PAGINACION ===========================================
  useEffect(() => {
    handleBuscarUsuarios();
  }, [paginaActual]);

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

  const columns: Column<Usuario>[] = [
    {
      header: "Nombre",
      accessor: "nombre",
      flex: 1,
      type: "text",
      editable: false,
      scrollable: false,
    },
    {
      header: "Apellido",
      accessor: "apellido",
      flex: 1,
      type: "text",
      editable: false,
      scrollable: false,
    },
    {
      header: "Email",
      accessor: "email",
      flex: 1,
      type: "text",
      editable: false,
      scrollable: false,
    },
    {
      header: "Rol",
      accessor: "rol",
      flex: 0.8,
      type: "text",
      editable: false,
      align: "right",
      formatFunction: ({ value }) => <span>{(value.nombre)}</span>
      
    },
  ];


  return (
    <div className="w-full">
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <Card className="bg-transparent border-transparent ">
              <CardHeader className="form-header flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">

                  <div className="flex items-center gap-8">

                  <CardTitle className="flex w-full sm:w-[48%] md:w-[200px]">
                    <User className="consultar-icon" />
                    <span>{
                      filtros.rolId === Rol.ADMINISTRADOR 
                      ? "Administradores" 
                      : filtros.rolId === Rol.EMPLEADO
                      ? "Empleados"
                      : "Clientes"
                      }</span>
                  </CardTitle>
                  

                  <div className="flex flex-col w-full sm:w-[48%] md:w-[200px]">
                      <label className="mb-1 text-sm font-mediumtext-black dark:text-white">
                        Rol
                      </label>
                      <Select
                        value={
                          Object.entries(RolesS)
                            .map(([key, value]) => ({
                              value: Number(key),
                              label: value // or provide a more user-friendly label if needed
                            }))
                            .find((option) => Number(option.value) === filtros.rolId) || null
                        }
                        options={Object.entries(RolesS).map(([key, value]) => ({
                          value: Number(key),
                          label: value,
                        }))}
                        onChange={(selectedOption) => {
                          setFiltros({ ...filtros, rolId: Number(selectedOption?.value) })
                          handleBuscarRapido(Number(selectedOption?.value));
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
                    </div>

                    
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 border-transparent rounded-full shadow-md transition"
                    onClick={() => handleBuscarUsuarios(true)}
                  >
                    <Search size={20} />
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white flex items-center px-4 py-3"
                    onClick={openModal}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <TablaAGGrid
                    columns={columns}
                    data={usuarios}
                    onUpdate={() => {}}
                    actions={(row: any) => (
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(row.id)}
                          className={`${row.sistema ? "bg-gray-600" : "bg-blue-500"} text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center`}
                          title="Eliminar usuario"
                          disabled={row.sistema ? true : false}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    )}
                    actionsFlex={0.5}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RegistrarUsuario onClose={closeModal} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
      <Alertas alerts={alerts} onRemove={removeAlert} />
      <AlertasConfirmacion />
    </div>
  );
}

import { useEffect,  useState } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../ui/Card";
import { Button } from "../../ui/Button";
import FormInput from "../../herramientas/formateo-de-campos/form-input";
import React from "react";
import { Card } from "../../ui/Card";
import Select from "react-select";
import { parseApiError } from "../../../utils/errores";
import { Layers } from "lucide-react";
import {CriticidadReclamoS, PrioridadReclamoS, TipoReclamoS, type Reclamo } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";
import { schemaReclamo, transformData, type FormValuesReclamo } from "./interfaces-validaciones-reclamo";
import type { SelectProyecto } from "../../../interfaces/gestion-proyecto/interfaces-proyecto";
import ReclamoService from "./reclamo-service";
import { useSesion } from "../../herramientas/context/SesionContext";
import CargaArchivos from "../../herramientas/reutilizables/carga-archivos";


export default function RegistrarActualizarReclamoForm({
  reclamo,
  onClose,
  onSuccess,
  visualizar,
}: {
  reclamo?: Reclamo;
  onClose: () => void;
  onSuccess: () => void;
  visualizar?: boolean;
}) {
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValuesReclamo>({
    resolver: yupResolver(schemaReclamo) as Resolver<FormValuesReclamo>,
    defaultValues: reclamo
      ? transformData(reclamo)
      : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    setError,
  } = methods;


  // Obtener proveedores, marcas y líneas
  const [proyectos, setProyectos] = React.useState<SelectProyecto[]>([]);
  const [selectedProyecto, setSelectedProyecto] = React.useState<SelectProyecto>();
  const [archivos, setArchivos] = useState<File[]>([]);
  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId;

  const proyectoId = watch("proyectoId")

  console.log("visualizar", visualizar)


  //=============================== FUNCIONALIDAD ==================================


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (reclamo) {

          setValue("proyectoId", reclamo.proyecto.id || "");
          setSelectedProyecto(reclamo.proyecto);;
  
          setValue("titulo", reclamo.titulo || "");
          setValue("descripcion", reclamo.descripcion);

          setValue("tipo", reclamo.prioridad || 0);
          setValue("prioridad", reclamo.prioridad || 0);
          setValue("criticidad", reclamo.criticidad || 0);

        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [reclamo]);  

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        handleBuscarProyectos();
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
      }
    };
    
    fetchProyectos();
  }, []);

  const onSubmit = async (formData: FormValuesReclamo) => {

    try {

      if (archivos.length > 0) {

        const payload = new FormData();

        payload.append("titulo", formData.titulo);
        payload.append("descripcion", formData.descripcion);
        payload.append("tipo", String(formData.tipo));
        payload.append("prioridad", String(formData.prioridad));
        payload.append("criticidad", String(formData.criticidad));
        payload.append("proyectoId", formData.proyectoId);

        // Archivos
        archivos.forEach(file => {
          payload.append("files", file);
        });

        await ReclamoService.nuevoConArchivos(payload);

      }else {

        await ReclamoService.nuevo(formData);
      }

      await onSuccess();
      onClose();

    } catch (error) {
      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };


  const handleBuscarProyectos = async () => {
    try {

        const proyectos = await ReclamoService.obtenerTotalesPara( usuarioId, "proyectos");
        if (proyectos) {
          console.log("proyectos encontradas:", proyectos);
          setProyectos(proyectos);
        } else {
          console.log("No se encontró un proyecto con la denominación ingresada.");
        }

  
    } catch (error) {
      console.error("Error al buscar por código:", error);
    }
  };

  const handleFilesChange = (files: File[]) => {
    setArchivos(files);
  };


  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="w-full max-w-7xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden relative mt-10 mb-12">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          &times;
        </button>

        <div className="form-header">
          <h2 className="form-title">
            <Layers className="form-icon" />
            <span>{reclamo ? "Actualizar Reclamo" : "Registrar Reclamo"}</span>
          </h2>
          <p className="form-subtitle">
            {reclamo
              ? "Modifica los detalles del reclamo."
              : "Ingresa los datos del nuevo reclamo para registrarlo."}
          </p>
        </div>

        <fieldset disabled={visualizar === true ? true : false}>
        
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="col-span-full flex flex-col lg:flex-row gap-4">

                <div className="w-full lg:w-1/2 lg:pl-4 mt-4"> 

                  <div className="flex-1">
                    <FormInput
                      name="titulo"
                      label="Titulo"
                      placeholder="Ingrese el titulo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 col-span-full">

                    <div className="mt-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Tipo</label>
                      <div  className="w-full">
                        <Select
                          value={
                            Object.entries(TipoReclamoS)
                              .map(([key, value]) => ({
                                value: Number(key),
                                label: value // or provide a more user-friendly label if needed
                              }))
                              .find((option) => Number(option.value) === watch('tipo')) || null
                          }
                          options={Object.entries(TipoReclamoS).map(([key, value]) => ({
                            value: Number(key),
                            label: value,
                          }))}
                          onChange={(selectedOption) => {
                            methods.setValue(`tipo`, Number(selectedOption?.value) || 0);
                          }}
                          className="text-black"
                          menuPortalTarget={document.body}
                          isDisabled={visualizar && visualizar === true ? true : false}
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
                        {errors.tipo && <small className="text-red-500">{errors.tipo?.message as string}</small>}
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Prioridad</label>
                      <div  className="w-full">
                        <Select
                          value={
                            Object.entries(PrioridadReclamoS)
                              .map(([key, value]) => ({
                                value: Number(key),
                                label: value // or provide a more user-friendly label if needed
                              }))
                              .find((option) => Number(option.value) === watch('prioridad')) || null
                          }
                          options={Object.entries(PrioridadReclamoS).map(([key, value]) => ({
                            value: Number(key),
                            label: value,
                          }))}
                          onChange={(selectedOption) => {
                            methods.setValue(`prioridad`, Number(selectedOption?.value) || 0);
                          }}
                          className="text-black"
                          menuPortalTarget={document.body}
                          isDisabled={visualizar && visualizar === true ? true : false}
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
                        {errors.prioridad && <small className="text-red-500">{errors.prioridad?.message as string}</small>}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Criticidad</label>
                      <div  className="w-full">
                        <Select
                            value={
                              Object.entries(CriticidadReclamoS)
                                .map(([key, value]) => ({
                                  value: Number(key),
                                  label: value // or provide a more user-friendly label if needed
                                }))
                                .find((option) => Number(option.value) === watch('criticidad')) || null
                            }
                            options={Object.entries(CriticidadReclamoS).map(([key, value]) => ({
                              value: Number(key),
                              label: value,
                            }))}
                            onChange={(selectedOption) => {
                              methods.setValue(`criticidad`, Number(selectedOption?.value) || 0);
                            }}
                            className="text-black"
                            menuPortalTarget={document.body}
                            isDisabled={visualizar && visualizar === true ? true : false}
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
                        
                        {errors.criticidad && <small className="text-red-500">{errors.criticidad?.message as string}</small>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 py-1">Proyectos</label>
                      <div className="flex gap-x-2">
                        <div className="w-full">
                          <Select
                            value={
                              proyectos.length > 0
                                ? proyectos.find((option) => option.id === proyectoId) || null
                                : selectedProyecto
                            }
                            options={proyectos}
                            getOptionLabel={(option) => option.nombre}
                            getOptionValue={(option) => String(option.id)}
                            onChange={(selectedOption) => {
                              methods.setValue(`proyectoId`, selectedOption?.id || "");
                              setSelectedProyecto(selectedOption as SelectProyecto);
                            }}
                            placeholder="Seleccione"
                            className="text-black"
                            menuPortalTarget={document.body}
                            isDisabled={visualizar && visualizar === true ? true : false}
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
                      </div>
                    </div>
                    
                  </div>

                  <div className="flex gap-x-4 mt-2 ">
                    <div className="flex-1">
                      <FormInput name="descripcion" label="Descripcion" />
                    </div>
                  </div>

                </div>

                <div className="w-full lg:w-1/2 lg:pl-4 lg:border-l lg:border-gray-300 mt-4">
                  <CargaArchivos
                    archivosRemotos={reclamo?.archivos}
                    label="Archivos del Reclamo"
                    onFilesChange={handleFilesChange}
                  />
                </div>
               
              </CardContent>

              {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

              <CardFooter className="flex justify-center">
                {visualizar && visualizar === true ? null : (
                <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                  {isSubmitting
                    ? reclamo
                      ? "Actualizando..."
                      : "Registrando..."
                    : reclamo
                      ? "Actualizar"
                      : "Registrar"}
                </Button>
                )}
              </CardFooter>

            </form>
          </FormProvider>
        </fieldset>
      </Card>
    </div>
  );
}

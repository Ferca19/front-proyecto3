import { useEffect, useState } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsuarioService from "./usuario-service";
import { Card, CardContent, CardFooter } from "../ui/Card";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Button } from "../ui/Button";
import { parseApiError } from "../../utils/errores";
import { schemaRegister, type FormValuesRegister } from "./interfaces-validaciones-usuario";
import type { Area } from "../../interfaces/gestion-usuario/interfaces-usuario";
import { User } from "lucide-react";
import { RolS } from "../../interfaces/generales/interfaces-generales";
import Select from "react-select";
import React from "react";

export default function RegistrarUsuario({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValuesRegister>({
    resolver: yupResolver(schemaRegister) as Resolver<FormValuesRegister>,
    defaultValues: { email: "", password: "", nombre: "", apellido: "", rolId: 0 },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    setValue,
    watch,
  } = methods;

  const rolId = watch("rolId");
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = React.useState<Area>({} as Area);
  const [, setErrorMessage] = useState("");

  const areaId = watch("areaId");

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areaRes] = await Promise.all([await UsuarioService.obtenerTotales({},"areas")]);

        setAreas(areaRes);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (formData: FormValuesRegister) => {
    setErrorMessage("");

    try {

        if (formData.password !== formData.passwordConfirmada) {
          setError("passwordConfirmada", {
            type: "manual",
            message: "Las contraseñas no coinciden.",
          });
          return;
        }
  
        const { passwordConfirmada, ...finalPayload } = formData;
  
        await UsuarioService.register(finalPayload);
  
        onClose();
        onSuccess();
      } catch (error) {

      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleOnClose = async () => {
    onClose();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-4xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">

        <div className="form-header">
          <button
            onClick={handleOnClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            &times;
          </button>

          <h2 className="form-title">
            <User className="form-icon" />
            <span>Registrar Usuario</span>
          </h2>
          <p className="form-subtitle">
            Ingresa los datos del nuevo usuario para registrarla.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Campos generales */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 col-span-full">

              
              <FormInput name="nombre" label="Nombre" type="nombre" />
              <FormInput name="apellido" label="Apellido" type="apellido" />
              <FormInput name="email" label="Correo Electrónico" placeholder="tu@ejemplo.com" />
              <FormInput name="telefono" label="Telefono" placeholder="3534114047" />
              

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Roles</label>
                <div  className="w-full">
                  <Select
                    value={
                      Object.entries(RolS)
                        .map(([key, value]) => ({
                          value: Number(key),
                          label: value // or provide a more user-friendly label if needed
                        }))
                        .find((option) => Number(option.value) === watch('rolId')) || null
                    }
                    options={Object.entries(RolS).map(([key, value]) => ({
                      value: Number(key),
                      label: value,
                    }))}
                    onChange={(selectedOption) => {
                      methods.setValue(`rolId`, Number(selectedOption?.value) || 0);
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
                  {errors.rolId && <small className="text-red-500">{errors.rolId?.message as string}</small>}
                </div>
              </div>

              <div className="flex-1 rounded-lg p-2 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 py-1">Areas</label>
                <div className="flex items-end gap-x-2">
                  <div className="flex flex-col w-full gap-y-2">
                    <div className="w-full">
                      <Select
                        value={
                          areas.length > 0
                            ? areas.find((option) => option._id === areaId) || null
                            : selectedArea
                        }
                        options={areas}
                        getOptionLabel={(option) => option.nombre}
                        getOptionValue={(option) => String(option._id)}
                        onChange={(selectedOption) => {
                          if (selectedOption) {
                            setValue('areaId', selectedOption._id);  
                            setSelectedArea(selectedOption);
                          }
                        }}
                        placeholder="Seleccione"
                        className="text-black"
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base) => ({ ...base, color: "black" }),
                          singleValue: (base) => ({ ...base, color: "black" }),
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
                        {errors.areaId?.message && (
                        <p className="text-sm text-red-600 mt-1">{errors.areaId.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <FormInput name="password" label="Contraseña" type="password" />

              <FormInput
                name="passwordConfirmada"
                label="Confirmar Contraseña"
                type="password"
              />
            </div>
            </CardContent>

            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

            <CardFooter className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
              >
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";
import Select from "react-select";
import FormInput from "../../herramientas/formateo-de-campos/form-input";
import ReclamoService from "./reclamo-service";
import { EstadoReclamo, EstadoReclamoS, type Reclamo } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";
import * as yup from "yup";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseApiError } from "../../../utils/errores";

interface FormValues{
  estado: number;
  descripcion?: string | null;
}

//===================== schema de validacion ============================================//

const schema = 
  yup.object().shape({
    estado: yup.number().required("El Estado es obligatoria"),
    descripcion: yup.string().optional(),
  });


export default function CambiarEstadoReclamoForm({
  reclamo,
  onSuccess,
  onClose,
}: {
  reclamo: Reclamo;
  onSuccess: () => void;
  onClose: () => void;
}) {
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      estado: reclamo.estado+1,
    }
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setError,
    setValue
  } = methods;

  const estado = watch("estado");

  const onSubmit = async (formData: FormValues) => {
    try {

      const payload = {
        ...formData,
      };

      await ReclamoService.cambiarEstado(reclamo._id, payload);

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


  //=============================== FUNCIONALIDAD ==================================


    

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl bg-white mx-auto shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out max-h-[95vh] flex flex-col">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          &times;
        </button>

        {/* Header */}
        <CardHeader className="px-3 py-2">
          <CardTitle className="text-lg font-bold text-center text-black">
            Cambiar Estado del Reclamo
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-sm">
            Asigne el estado correspondiente
          </CardDescription>
        </CardHeader>

        {/* Contenido con scroll si es necesario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 px-4 sm:px-6 md:px-10 py-3 overflow-y-auto">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 py-1">Estado Actual</label>
                  <Select
                    value={
                      Object.entries(EstadoReclamoS)
                        .map(([key, value]) => ({
                          value: Number(key),
                          label: value // or provide a more user-friendly label if needed
                        }))
                        .find((option) => Number(option.value) === estado) || null
                    }
                    options={Object.entries(EstadoReclamoS).map(([key, value]) => ({
                      value: Number(key),
                      label: value,
                    }))}
                    onChange={() => {}}
                    className="text-black"
                    menuPortalTarget={document.body}
                    isDisabled= {true}
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
              
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 py-1">Nuevo Estado</label>
                  <Select
                    value={
                      Object.entries(EstadoReclamoS)
                        .map(([key, value]) => ({
                          value: Number(key),
                          label: value // or provide a more user-friendly label if needed
                        }))
                        .find((option) => Number(option.value) === (estado+1)) || null
                    }
                    options={Object.entries(EstadoReclamoS).map(([key, value]) => ({
                      value: Number(key),
                      label: value,
                    }))}
                    onChange={(selectedOption) => {
                      setValue(`estado`, selectedOption ? Number(selectedOption.value) : 0);
                    }}
                    className="text-black"
                    menuPortalTarget={document.body}
                    isDisabled= {true}
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

              <div className="flex-1">
                <FormInput name="descripcion" label={estado === EstadoReclamo.RESUELTO ? "Resolución Final":"Descripción"} />
              </div>

            </CardContent>

            {/* Footer */}
            <CardFooter className="flex justify-center py-3">
              <Button type="submit" disabled={isSubmitting} 
                className="btn btn-dark">
                {isSubmitting ? ("Asignando...") : ("Asignar")}
              </Button>
            </CardFooter>

          </form>
        </FormProvider>
      </Card>

    </div>
  );

}

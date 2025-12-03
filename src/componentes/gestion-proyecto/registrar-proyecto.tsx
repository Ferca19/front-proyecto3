import { useEffect} from "react";
import { useForm, FormProvider, type Resolver} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import Select from "react-select";
import { CreditCard} from "lucide-react";
import type { SelectCliente } from "../../interfaces/generales/interfaces-generales";
import { schemaProyecto, type FormValuesProyecto } from "./interfaces-validaciones-proyecto";
import ProyectoService from "./proyecto-service";
import { parseApiError } from "../../utils/errores";
import { Card, CardContent, CardFooter } from "../ui/Card";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Button } from "../ui/Button";



export default function RegistrarActualizarProyectoForm({onClose, onSuccess } :
  { 
    onClose: () => void; 
    onSuccess: () => void
  }) {

    //===================== CONSTANTES VARIAS ============================================
    const [clientes, setClientes] = React.useState<SelectCliente[]>([]);
    const [selectedCliente, setSelectedCliente] = React.useState<SelectCliente>({} as SelectCliente);
    const methods = useForm<FormValuesProyecto>({
      resolver: yupResolver(schemaProyecto) as Resolver<FormValuesProyecto>,
      defaultValues: {
        clienteId: "",
      },
    });
  
    const { handleSubmit, formState: { isSubmitting, errors }, setValue, watch, setError } = methods;
    console.log("Errores del formulario:", errors);

    const clienteId = watch("clienteId");


    //=============================== FUNCIONALIDAD ==================================
  
    useEffect(() => {
      const fetchData = async () => {
        try {      

          const clientes = await ProyectoService.obtenerTotales({denominacion: ""},"clientes");
          setClientes(clientes);

        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      };
  
      fetchData();
    }, []);

  

    const onSubmit = async (formData: FormValuesProyecto) => {
      try {

          const payload = {
              ...formData,
          };

          await ProyectoService.nuevo(payload);

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

    

return (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-4xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">

          <button
              onClick={onClose}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
              >
              &times;
          </button>

          <div className="form-header">
            <h2 className="form-title">
              <CreditCard className="form-icon" />
              <span>{"Registrar Proyecto"}</span>
            </h2>
            <p className="form-subtitle">{"Ingresa los datos del nuevo Proyecto para registrarlo."}</p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-3 px-3 py-2">
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-2">
                  <div className="flex gap-x-4">
                    <div className="flex-1">
                      <FormInput name="nombre" label="Nombre" />
                    </div>
                  </div>

                  <div className="flex-1 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 py-1">Cliente</label>
                    <div className="flex items-end gap-x-2">
                      <div className="flex flex-col w-full gap-y-2">
                        <div className="w-full">
                          <Select
                            value={
                              clientes.length > 0
                                ? clientes.find((option) => option.id === clienteId) || null
                                : selectedCliente
                            }
                            options={clientes}
                            getOptionLabel={(option) => option.nombre}
                            getOptionValue={(option) => String(option.id)}
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                setValue('clienteId', selectedOption.id);  
                                setSelectedCliente(selectedOption);
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
                          {errors.clienteId?.message && (
                            <p className="text-sm text-red-600 mt-1">{errors.clienteId.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-x-4">
                  <div className="flex-1">
                    <FormInput name="descripcion" label="Descripcion" />
                  </div>
                </div>

              </CardContent>


              {errors.root && (
                <div className="text-red-600 text-center mb-4">
                  {errors.root.message}
                </div>
              )}

              <CardFooter className="flex justify-center mt-4">
                <Button type="submit" disabled={isSubmitting} 
                  className="btn btn-dark">
                  {isSubmitting ? ("Registrando...") : ("Registrar")}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>

      </div>
      );
    }


  

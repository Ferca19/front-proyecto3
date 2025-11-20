import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsuarioService from "./usuario-service";
import { Card, CardContent, CardFooter } from "../ui/Card";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { parseApiError } from "../../utils/errores";
import { schemaRegister, type FormValuesRegister } from "./interfaces-validaciones-usuario";
import type { Rol } from "../../interfaces/gestion-usuario/interfaces-usuario";
import { User } from "lucide-react";

export default function RegistrarUsuario({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValuesRegister>({
    resolver: yupResolver(schemaRegister),
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
  const [roles, setRoles] = useState<Rol[]>([]);
  const [, setErrorMessage] = useState("");

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolRes] = await Promise.all([await UsuarioService.obtenerRolesTotales()]);

        setRoles(rolRes);
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
              


              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="rolId" className="text-sm font-medium text-gray-700 block mb-1">
                  Rol
                </Label>
                <select
                  id="rolId"
                  value={rolId}
                  onChange={(e) => setValue("rolId",Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800"
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
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

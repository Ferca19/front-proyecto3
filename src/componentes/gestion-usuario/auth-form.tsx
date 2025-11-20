import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsuarioService from "./usuario-service";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { schemaLogin, type FormValuesLogin } from "./interfaces-validaciones-usuario";
import { parseApiError } from "../../utils/errores";
import RecuperarContrasenaForm from "./recuperar-contrasena-form";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) {
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValuesLogin>({
    resolver: yupResolver(schemaLogin),
    defaultValues: { email: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    register,
  } = methods;
  console.log("Errores del formulario:", errors);

  // Obtener proveedores, marcas y líneas
  const [, setErrorMessage] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //=============================== FUNCIONALIDAD ==================================



  const onSubmit = async (formData: FormValuesLogin) => {
    setErrorMessage("");

    try {
      const payload = { ...formData };

      console.log("Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await UsuarioService.login(payload);
      const token = response?.data.accessToken;

      localStorage.setItem("Token", token);

      window.location.href = "/admin";

      if (onClose) onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);

      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };


  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del formulario */}
          <div className="space-y-3">
            <FormInput name="email" label="Correo Electrónico" placeholder="tu@ejemplo.com" className="text-sm" />

            <div className="relative">
              <Label htmlFor={"contrasena"} className="text-sm font-medium text-gray-700 block mb-1">
                Constraseña
              </Label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full text-black bg-gray-100 px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute h-2 top-1/1 mt-3 right-3  p-0 m-0 bg-transparent border-none text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-principal" />
                ) : (
                  <Eye size={16} className="text-principal" />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-principal hover:bg-overPrincipal text-white text-sm py-2.5 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
          </Button>

          {/* Botón para recuperar contraseña */}
          <p className="text-sm text-center mt-2 text-red-500">
            ¿Olvidaste tu contraseña?{" "}
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="text-principal bg-transparent hover:underline"
            >
              Recuperar
            </button>
          </p>
          
        </form>
      </FormProvider>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RecuperarContrasenaForm onClose={() => setMostrarModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

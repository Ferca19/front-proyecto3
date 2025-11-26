import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsuarioService from "./usuario-service";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { parseApiError } from "../../utils/errores";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSesion } from "../herramientas/context/SesionContext";
import { schemaLogin, type FormValuesLogin } from "./interfaces-validaciones-usuario";
import { Rol } from "../../interfaces/generales/interfaces-generales";

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

  const [, setErrorMessage] = useState("");
  const { setSesionEnContext } = useSesion();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //=============================== FUNCIONALIDAD ==================================

  const onSubmit = async (formData: FormValuesLogin) => {
    setErrorMessage("");

    try {
      const payload = { ...formData };

      const response = await UsuarioService.login(payload);

      setSesionEnContext({
        usuarioId: response.usuarioId,
        rolId: response.rolId,
      });

      if (response.rolId === Rol.ADMINISTRADOR || response.rolId === Rol.EMPLEADO){
        navigate("/admin");
      } else if (response.rolId === Rol.CLIENTE) {
        navigate("/public");
      }

      navigate("/admin");

      if (onClose) onClose();
      if (onSuccess) onSuccess();
    } catch (error) {

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
              <Label htmlFor={"password"} className="text-sm font-medium text-gray-700 block mb-1">
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
        </form>
      </FormProvider>

    </div>
  );
}

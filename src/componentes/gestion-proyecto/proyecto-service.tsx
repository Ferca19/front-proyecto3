import { createCrudService } from "../../utils/crudFactory";
import type { FormValuesProyecto } from "./interfaces-validaciones-proyecto";

const baseService = createCrudService<FormValuesProyecto>("proyecto");

const ProyectoService = {
  ...baseService,
};

export default ProyectoService;

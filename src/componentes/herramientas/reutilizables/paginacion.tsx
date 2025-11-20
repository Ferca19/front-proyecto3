
import { Button } from "../../ui/Button";

interface PaginacionProps {
  entidadesTotales: number;
  take: number;
  paginaActual: number;
  onChange: (skip: number, take: number, currentPage: number) => void;
}


export default function Paginacion({ entidadesTotales, take, paginaActual, onChange }: PaginacionProps) {
  const totalPaginas = Math.ceil(entidadesTotales / take);

  if (totalPaginas <= 1) return null;

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      const skip = (nuevaPagina - 1) * take;
      onChange(skip, take, nuevaPagina);
    }
  };

  const generarRango = () => {
    const rango = [];
    const maxBotones = 4;
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    const fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio + 1 < maxBotones) {
      inicio = Math.max(1, fin - maxBotones + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      rango.push(i);
    }
    return rango;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      
      <Button
        variant="outline"
        type="button"
        size="sm"
        onClick={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="bg-black text-white hover:bg-gray-800"
      >
        {"<"}
      </Button>

      {generarRango().map((pagina) => (
        <Button
          key={pagina}
          variant={pagina === paginaActual ? "default" : "outline"}
          size="sm"
          type="button"
          onClick={() => cambiarPagina(pagina)}
          className={`bg-black text-white hover:bg-gray-800 ${pagina === paginaActual ? `bg-blue-700` : ``}`}
        >
          {pagina}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="bg-black text-white hover:bg-gray-800"
      >
        {">"}
      </Button>
    </div>
  );
}

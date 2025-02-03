"use client";

import { cn } from "@/lib/utils";
import { useListStudiesQuery } from "@/services/studies";
import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const studies_extension = [
  {
    code: "nutritional",
    title: "Informe nutricional",
    subtitle: "Cargar informe nutricional",
    img: "https://www.lummi.ai/api/pro/image/ceab724a-1df9-4b2e-8bde-eeb404588057?asset=original&cb=8a5U2g&auto=format&w=640",
  },
  {
    code: "training",
    title: "Plan de entrenamiento",
    img: "https://assets.lummi.ai/assets/QmP72ieegKY5jZF78VhRtB44ApoMuqiKmNgvMAHmwP949r?auto=format&w=640",
    subtitle: "Cargar plan de entrenamiento"
  },
  {
    code: "lab",
    title: "Informe de laboratorio",
    img: "https://epha.ca/wp-content/uploads/elementor/thumbs/Risk-Assessment-quy22aa3i4h2nnm2hdv35p9j2xin4vxc796ni3mxmg.png",
    subtitle: "Cargar informe de laboratorio"
  },
  {
    code: "supplements",
    title: "Suplementos recomendados",
    img: "https://assets.lummi.ai/assets/QmSs6nbHGj9gnDoL65R8eU7UtT7W8mAgdAGN2PMeSVZae4?auto=format&w=640",
    subtitle: "Cargar suplementos recomendados"
  },
  {
    code: "in_body",
    title: "Análisis InBody",
    img: "https://media.licdn.com/dms/image/v2/D4D22AQHPEQjD_JeDtw/feedshare-shrink_800/feedshare-shrink_800/0/1732571916031?e=2147483647&v=beta&t=JYJXw1FlnRKOMN2DMDuh6EOS0KIFo5C7Z6b8DCk2lFQ",
    subtitle: "Cargar análisis InBody"
  }
];

export default function SelectStudyPage() {
  const pathname = usePathname();

  const { data, isLoading } = useListStudiesQuery(undefined);

  const studies = isLoading ? studies_extension : data;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Seleccionar estudio</h1>
      <div className="flex flex-wrap justify-start items-start gap-5">
        <div
          className="cursor-dot"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            opacity: isHovering ? 1 : 0
          }}
        >
          <ArrowRight />
        </div>
        {studies?.map((study, idx) => {
          const study_extension = studies_extension.find((ext) => ext.code === study.code);
          return <button
            key={idx}
            className={cn(
              "group relative flex h-52 w-72 flex-col justify-end overflow-hidden !rounded-lg p-5 shadow-lg shadow-border transition-all hover:shadow-xl hover:cursor-none"
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Link
              href={isLoading ? "#" : `${pathname}/${study.code}`}
              className="custom-cursor absolute inset-0 flex flex-col justify-end p-5 overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <img
                  className={cn("absolute inset-0 h-full w-full object-cover transition-all will-change-transform group-hover:scale-110",
                    isLoading ? "blur-lg" : "blur-none"
                  )}
                  src={study_extension?.img}
                  aria-hidden="true"
                />
                <div className={cn("absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90 transition-opacity duration-300 ease-out group-hover:opacity-90")} />
              </div>
              <div className="relative z-10 translate-y-0 transform transition-all duration-300 ease-out">
                <h2 className={cn("text-lg font-semibold text-white/75 transition-all duration-300 ease-out group-hover:text-white text-left",
                  isLoading ? "blur-[6px] text-white font-bold" : "blur-none"
                )}>
                  {study.title}
                </h2>
              </div>
            </Link>
          </button>
        })}
      </div>
    </div>
  );
}
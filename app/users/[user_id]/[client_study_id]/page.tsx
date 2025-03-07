'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { useGetClientQuery } from "@/services/clients";
import { useDownloadClientStudyMutation, useGetClientStudyQuery } from "@/services/studies";
import MarkdownPreview from '@uiw/react-markdown-preview';
import {
  Activity, Atom, CroissantIcon as Bread, ChefHat, Citrus, Clock,
  Dna, Droplet, Droplets, Drumstick, Edit, Egg, FileIcon, FuelIcon as Oil,
  Pizza,
  Salad, Trash, type LucideIcon
} from "lucide-react";
import { Link } from "next-view-transitions";
import { useParams } from "next/navigation";
import { Cell, Pie, PieChart } from "recharts";
import { Square } from "../components/square";

type ParameterStatus = "normal" | "good" | "bad"

const labelsMapping: Record<string, string> = {
  aging: "Envejecimiento",
  methylation: "Metilación",
  sensibility: "Sensibilidad a la insulina",
  detoxification: "Detoxificación",
  fat_metabolism: "Metabolismo de grasas",
  micronutrients: "Micronutrientes",
  carbs_metabolism: "Metabolismo de carbohidratos",
  protein_metabolism: "Metabolismo de proteínas",
};

const iconMapping: Record<string, LucideIcon> = {
  aging: Clock,
  methylation: Atom,
  sensibility: ChefHat,
  detoxification: Droplet,
  fat_metabolism: Pizza,
  micronutrients: Citrus,
  carbs_metabolism: Bread,
  protein_metabolism: Drumstick,
}

const statusColorMapping: Record<ParameterStatus, string> = {
  good: "#22c55e",
  normal: "#eab308",
  bad: "#ef4444",
}

const statusTextMapping: Record<ParameterStatus, string> = {
  good: "Bueno",
  normal: "Normal",
  bad: "Malo",
}

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, midAngle, parameter } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const IconComponent = iconMapping[parameter];

  return (
    <g>
      <foreignObject
        x={x - 12}
        y={y - 12}
        width={24}
        height={24}
        style={{ pointerEvents: 'none', textAlign: "center" }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <IconComponent className="h-5 w-5 text-white" />
        </div>
      </foreignObject>
    </g>
  );
};


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{data.label}</p>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="text-xs">{data.statusText}</p>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function ClientStudyDetailsPage() {
  const { toast } = useToast();

  const { client_study_id, user_id } = useParams<{ client_study_id: string; user_id: string }>();

  const [downloadStudy] = useDownloadClientStudyMutation();

  const { data: client, isLoading: isClientLoading } = useGetClientQuery(user_id ?? "");
  const { data: clientStudy, isLoading: isStudyLoading } = useGetClientStudyQuery(client_study_id ?? "");

  const handleDownloadStudy = async () => {
    try {
      const response = await downloadStudy(client_study_id);
      if (response.data?.url) {
        window.open(response.data.url || "", "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el estudio",
        variant: "destructive"
      })
    }
  }

  const chartData = clientStudy?.metadata?.values && Object.entries(clientStudy?.metadata?.values).map(([key, status]) => ({
    parameter: key,
    value: 1,
    status,
    label: labelsMapping[key],
    color: statusColorMapping[status as ParameterStatus],
    statusText: statusTextMapping[status as ParameterStatus],
  }))

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <h1
          className={cn(
            "text-xl font-semibold transition-all duration-200",
            isStudyLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
          )}
        >
          {isStudyLoading ? "texto de estudio" : clientStudy?.title}
        </h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <Link href={`/users/${user_id}/${client_study_id}/edit-study`}>
              <Edit />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-9 w-9"
            onClick={() => setDialogsState({
              open: "delete-client-study",
              payload: {
                client_study_id: client_study_id,
                user_id: user_id
              }
            })}
          >
            <Trash />
          </Button>
        </div>
      </div>
      <div className="bg-background p-6 rounded-md shadow-lg shadow-border border space-y-6">
        <div className="flex gap-4">
          <div className="flex flex-col w-full space-y-2">
            <Label>Cliente</Label>
            <Button
              variant="outline"
              role="combobox"
              type="button"
              disableRipple
              className={cn(
                "justify-between px-3 bg-secondary cursor-default border-none hover:bg-secondary/50",
                !client?.id && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Square className={cn("bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20")}>
                  <p
                    className={cn("transition-all duration-200", isClientLoading ? "blur-[4px]" : "blur-none")}
                  >
                    {isClientLoading ? "T" : client?.first_name?.charAt(0)}
                  </p>
                </Square>
                <p
                  className={cn("transition-all duration-200", isClientLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none")}
                >
                  {isClientLoading ? "Agustin Delgado" : `${client?.first_name} ${client?.last_name}`}
                </p>
              </div>
            </Button>
          </div>
          <div className="flex flex-col w-full space-y-2">
            <Label>Estudio</Label>
            <Button
              variant="outline"
              role="combobox"
              type="button"
              disableRipple
              className={cn(
                "justify-between px-3 bg-secondary cursor-default border-none hover:bg-secondary/50",
                !clientStudy?.id && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Square className={cn("bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20")}>
                  <p
                    className={cn("transition-all duration-200", isStudyLoading ? "blur-[4px]" : "blur-none")}
                  >
                    {isStudyLoading ? "T" : clientStudy?.title?.charAt(0)}
                  </p>
                </Square>
                <p
                  className={cn("transition-all duration-200", isStudyLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none")}
                >
                  {isStudyLoading ? "Agustin Delgado" : `${clientStudy?.title}`}
                </p>
              </div>
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Label>PDF Adjunto</Label>
          {isStudyLoading ? (
            <div className="flex items-center gap-2 p-2 pl-3 pr-4 rounded-md bg-secondary transition-border justify-between shadow-sm hover:shadow-md transition-all h-10 cursor-pointer">
              <div className="flex items-center gap-2">
                <Square className="bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20">
                  <FileIcon className="w-3.5 h-3.5" />
                </Square>
                <span className="font-medium text-sm blur-[6px] text-muted-foreground">
                  Cargando PDF...
                </span>
              </div>
            </div>
          ) : clientStudy?.storage_ref ? (
            <div
              onClick={handleDownloadStudy}
              className="flex items-center gap-2 p-2 pl-3 pr-4 rounded-md bg-secondary transition-border justify-between shadow-sm hover:shadow-md transition-all h-10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Square className="bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20">
                  <FileIcon className="w-3.5 h-3.5" />
                </Square>
                <span className="font-medium text-sm">{clientStudy.storage_ref}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 pl-3 pr-4 rounded-md bg-secondary transition-border justify-between shadow-sm hover:shadow-md transition-all h-10 cursor-pointer">
              <div className="flex items-center gap-2">
                <Square className="bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20">
                  <FileIcon className="w-3.5 h-3.5" />
                </Square>
                <span className="text-muted-foreground text-sm">No hay PDF adjunto</span>
              </div>
            </div>
          )}
        </div>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle
              className={cn(
                "text-sm font-semibold",
                isStudyLoading && "blur-[4px] text-muted-foreground"
              )}
            >
              {isStudyLoading ? "Cargando Procedimientos" : "Procedimientos"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0 relative">
            <ChartContainer
              config={{}}
              className={cn("mx-auto aspect-square max-h-[250px]", isStudyLoading && "blur-[6px]")}
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<CustomTooltip hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="parameter"
                  innerRadius={50}
                  paddingAngle={2}
                  label={renderCustomizedLabel}
                  labelLine={false}
                  isAnimationActive={false}
                >
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            {isStudyLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Cargando...
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        <div className={cn("space-y-2", !clientStudy?.metadata.blocks?.length && "hidden")}>
          <Label>Bloques</Label>
          {clientStudy?.code === "nutritional" && (
            clientStudy?.metadata?.blocks?.map((block, index: number) => (
              <div key={index} className={'p-4 rounded-md bg-secondary shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all relative group'}>
                <span className="font-medium">{block.title}</span>
                <MarkdownPreview
                  wrapperElement={{ "data-color-mode": "light" }}
                  source={block.body}
                  className="!text-sm"
                  style={{ padding: 16, all: "revert" }}
                />
              </div>
            ))
          )}
          {clientStudy?.code === "training" && (
            clientStudy?.metadata?.blocks?.map((block, index: number) => (
              <div key={index} className={'p-4 rounded-md bg-secondary shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all relative group'}>
                <span className="font-medium">
                  {block.day}
                </span>
                <MarkdownPreview
                  wrapperElement={{ "data-color-mode": "light" }}
                  source={block.body}
                  className="!text-sm"
                  style={{ padding: 16, all: "revert" }}
                />
              </div>
            ))
          )}
          {clientStudy?.code === "supplements" && (
            clientStudy?.metadata?.blocks?.map((block, index: number) => (
              <div key={index} className={'p-4 rounded-md bg-secondary shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all relative group'}>
                <div className="flex gap-1">
                  <span className="font-semibold">
                    {block.supplement}:
                  </span>
                  {block.supplement}
                </div>
                <div>
                  <span>{block.dose}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={cn("space-y-2", !clientStudy?.metadata.obs && "hidden")}>
          <Label>Observaciones</Label>
          <div className={'p-4 rounded-md bg-secondary shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all relative group'}>
            <span>{clientStudy?.metadata.obs || "No hay observaciones"}</span>
          </div>
        </div>

        <div className={cn("space-y-2", !clientStudy?.metadata.note && "hidden")}>
          <Label>Notas</Label>
          <div className={'p-4 rounded-md bg-secondary shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all relative group'}>
            <span>{clientStudy?.metadata.note || "No hay notas"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
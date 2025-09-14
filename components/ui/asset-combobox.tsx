// frontend/components/ui/asset-combobox.tsx

"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"

interface AssetComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function AssetCombobox({ value, onChange }: AssetComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [assets, setAssets] = React.useState<{ value: string; label: string }[]>([])

  // Busca a lista de ativos da nossa API quando o componente é montado
  React.useEffect(() => {
    const fetchAssets = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/available-assets/`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Falha ao buscar ativos");
        
        const data = await response.json();
        const formattedAssets = data.assets.map((asset: string) => ({
          value: asset.toLowerCase(),
          label: asset,
        }));
        setAssets(formattedAssets);
      } catch {
        toast.error("Erro de Rede", {
          description: "Não foi possível carregar a lista de ativos da Binance.",
        });
      }
    };
    fetchAssets();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? assets.find((asset) => asset.label.toLowerCase() === value.toLowerCase())?.label
            : "Selecione um ativo..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder="Buscar ativo..." />
          <CommandList>
            <CommandEmpty>Nenhum ativo encontrado.</CommandEmpty>
            <CommandGroup>
              {assets.map((asset) => (
                <CommandItem
                  key={asset.value}
                  value={asset.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : asset.label)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === asset.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {asset.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

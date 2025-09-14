// frontend/components/ui/date-picker.tsx (VERSÃO CORRETA E CONTROLÁVEL)

"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale" // Adiciona tradução para português
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// 1. Define as propriedades que o componente vai aceitar
interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

// 2. Renomeia a função para "DatePicker" e faz ela aceitar as propriedades
export function DatePicker({ date, setDate, placeholder = "Selecione uma data" }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal", // Ocupa 100% da largura
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* Usa a 'date' recebida para mostrar o valor formatado */}
          {date ? format(date, "PPP", { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}   // Usa a 'date' recebida
          onSelect={setDate} // Usa a função 'setDate' recebida
          initialFocus
          locale={ptBR}      // Mostra o calendário em português
        />
      </PopoverContent>
    </Popover>
  )
}

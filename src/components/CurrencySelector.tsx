import { useCurrency, type Currency } from '@/hooks/useCurrency'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CurrencySelector() {
  const { currency, changeCurrency, currencies } = useCurrency()

  return (
    <Select value={currency} onValueChange={(value) => changeCurrency(value as Currency)}>
      <SelectTrigger className="w-full bg-secondary hover:bg-accent transition-colors duration-200">
        <SelectValue placeholder="Selecione a moeda" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            <span className="flex items-center gap-2">
              <span>{curr.symbol}</span>
              <span>{curr.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

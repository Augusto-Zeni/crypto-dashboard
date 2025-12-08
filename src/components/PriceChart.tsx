import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatPrice } from '@/lib/utils'
import type { Currency } from '@/hooks/useCurrency'
import { useTheme } from '@/hooks/useTheme'

interface PriceChartProps {
  data: [number, number][]
  currency: Currency
  formatValue?: (value: number, currency: Currency) => string
}

interface ChartDataPoint {
  timestamp: number
  price: number
  date: string
}

export function PriceChart({ data, currency, formatValue = formatPrice }: PriceChartProps) {
  const { theme } = useTheme()

  const chartData = useMemo(() => {
    return data.map(([timestamp, price]) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: data.length > 30 ? '2-digit' : undefined,
      }),
    }))
  }, [data])

  const priceChange = useMemo(() => {
    if (data.length < 2) return 0
    const firstPrice = data[0][1]
    const lastPrice = data[data.length - 1][1]
    return ((lastPrice - firstPrice) / firstPrice) * 100
  }, [data])

  const chartColor = priceChange >= 0 ? '#10b981' : '#ef4444'
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb'
  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280'

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: textColor }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={50}
        />
        <YAxis
          tick={{ fontSize: 12, fill: textColor }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatValue(value, currency)}
          domain={['auto', 'auto']}
          width={80}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as ChartDataPoint
              return (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">{data.date}</p>
                  <p className="text-lg font-bold">
                    {formatValue(data.price, currency)}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={chartColor}
          strokeWidth={2}
          fill="url(#colorPrice)"
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

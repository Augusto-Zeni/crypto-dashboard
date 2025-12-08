import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCoinDetails } from '@/hooks/useCoinDetails'
import { useMarketChart } from '@/hooks/useMarketChart'
import { useCurrency } from '@/hooks/useCurrency'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { formatLargeNumber, formatPrice } from '@/lib/utils'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { CoinSelector } from '@/components/CoinSelector'
import { PriceChart } from '@/components/PriceChart'

export function CoinDetails() {
  const { coinId } = useParams<{ coinId: string }>()
  const navigate = useNavigate()
  const { currency } = useCurrency()
  const [chartDays, setChartDays] = useState(7)

  const {
    data: coinDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useCoinDetails(coinId)
  const { data: chartData, isLoading: isLoadingChart } = useMarketChart(coinId, chartDays)

  if (!coinId) {
    return <CoinSelector />
  }

  if (detailsError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="flex h-[400px] items-center justify-center">
            <p className="text-destructive">Erro ao carregar detalhes da moeda. Tente novamente.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoadingDetails) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Skeleton className="h-10 w-32" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px]" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (!coinDetails) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="flex h-[400px] items-center justify-center">
            <p className="text-muted-foreground">Moeda não encontrada.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentPrice = coinDetails.market_data.current_price[currency]
  const priceChange24h = coinDetails.market_data.price_change_percentage_24h
  const priceChange7d = coinDetails.market_data.price_change_percentage_7d
  const priceChange30d = coinDetails.market_data.price_change_percentage_30d
  const priceChange1y = coinDetails.market_data.price_change_percentage_1y

  const isPositive24h = priceChange24h >= 0

  const highestPrice = chartData?.prices.reduce((max, [, price]) => Math.max(max, price), 0) ?? 0
  const lowestPrice = chartData?.prices.reduce((min, [, price]) => 
    Math.min(min, price), Infinity) ?? 0

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <img
              src={coinDetails.image.large}
              alt={coinDetails.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-3xl">{coinDetails.name}</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {coinDetails.symbol.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Rank #{coinDetails.market_cap_rank}
                </Badge>
              </div>
              <CardDescription className="text-xl mt-2">
                {formatPrice(currentPrice, currency)}
              </CardDescription>
            </div>
            <Badge
              variant={isPositive24h ? 'default' : 'destructive'}
              className="text-lg px-4 py-2"
            >
              {isPositive24h ? (
                <TrendingUp className="mr-2 h-5 w-5" />
              ) : (
                <TrendingDown className="mr-2 h-5 w-5" />
              )}
              {isPositive24h ? '+' : ''}
              {priceChange24h.toFixed(2)}%
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatLargeNumber(coinDetails.market_data.market_cap[currency], currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Volume 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatLargeNumber(coinDetails.market_data.total_volume[currency], currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Máxima 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatPrice(coinDetails.market_data.high_24h[currency], currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mínima 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatPrice(coinDetails.market_data.low_24h[currency], currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Variações de Preço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">24 horas</span>
                <Badge variant={priceChange24h >= 0 ? 'default' : 'destructive'}>
                  {priceChange24h >= 0 ? '+' : ''}
                  {priceChange24h.toFixed(2)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">7 dias</span>
                <Badge variant={priceChange7d >= 0 ? 'default' : 'destructive'}>
                  {priceChange7d >= 0 ? '+' : ''}
                  {priceChange7d.toFixed(2)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">30 dias</span>
                <Badge variant={priceChange30d >= 0 ? 'default' : 'destructive'}>
                  {priceChange30d >= 0 ? '+' : ''}
                  {priceChange30d.toFixed(2)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">1 ano</span>
                <Badge variant={priceChange1y >= 0 ? 'default' : 'destructive'}>
                  {priceChange1y >= 0 ? '+' : ''}
                  {priceChange1y.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fornecimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Circulante</span>
                <span className="font-medium">
                  {formatLargeNumber(coinDetails.market_data.circulating_supply, currency).replace(/[^\d.,KMB]/g, '')}
                </span>
              </div>
              {coinDetails.market_data.total_supply && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">
                    {formatLargeNumber(coinDetails.market_data.total_supply, currency).replace(/[^\d.,KMB]/g, '')}
                  </span>
                </div>
              )}
              {coinDetails.market_data.max_supply && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Máximo</span>
                  <span className="font-medium">
                    {formatLargeNumber(coinDetails.market_data.max_supply, currency).replace(/[^\d.,KMB]/g, '')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Histórico de Preços</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={chartDays === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartDays(1)}
              >
                1D
              </Button>
              <Button
                variant={chartDays === 7 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartDays(7)}
              >
                7D
              </Button>
              <Button
                variant={chartDays === 30 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartDays(30)}
              >
                30D
              </Button>
              <Button
                variant={chartDays === 365 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartDays(365)}
              >
                1A
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingChart ? (
            <Skeleton className="h-[300px]" />
          ) : chartData && chartData.prices.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Máxima do Período</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(highestPrice, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mínima do Período</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatPrice(lowestPrice, currency)}
                  </p>
                </div>
              </div>
              <PriceChart data={chartData.prices} currency={currency} />
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground">Sem dados disponíveis para o período</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingChart ? (
              <Skeleton className="h-[300px]" />
            ) : chartData && chartData.market_caps.length > 0 ? (
              <PriceChart data={chartData.market_caps} currency={currency} formatValue={formatLargeNumber} />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">Sem dados disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume de Negociação</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingChart ? (
              <Skeleton className="h-[300px]" />
            ) : chartData && chartData.total_volumes.length > 0 ? (
              <PriceChart data={chartData.total_volumes} currency={currency} formatValue={formatLargeNumber} />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">Sem dados disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {coinDetails.description.en && (
        <Card>
          <CardHeader>
            <CardTitle>Sobre {coinDetails.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: coinDetails.description.en }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>All-Time High (ATH)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {formatPrice(coinDetails.market_data.ath[currency], currency)}
              </p>
              <Badge variant="destructive">
                {coinDetails.market_data.ath_change_percentage[currency].toFixed(2)}%
              </Badge>
              <p className="text-sm text-muted-foreground">
                {new Date(coinDetails.market_data.ath_date[currency]).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All-Time Low (ATL)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {formatPrice(coinDetails.market_data.atl[currency], currency)}
              </p>
              <Badge variant="default">
                +{coinDetails.market_data.atl_change_percentage[currency].toFixed(2)}%
              </Badge>
              <p className="text-sm text-muted-foreground">
                {new Date(coinDetails.market_data.atl_date[currency]).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

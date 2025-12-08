import { useState, useMemo } from 'react'
import { useCryptos } from '@/hooks/useCryptos'
import { useDebounce } from '@/hooks/useDebounce'
import { CryptoList } from '@/components/CryptoList'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function Dashboard() {
  const { data: cryptos, isLoading } = useCryptos()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredCryptos = useMemo(() => {
    if (!cryptos || !debouncedSearchQuery.trim()) {
      return cryptos
    }

    const query = debouncedSearchQuery.toLowerCase().trim()
    return cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(query) ||
        crypto.symbol.toLowerCase().includes(query)
    )
  }, [cryptos, debouncedSearchQuery])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Cryptocurrency Market Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Pesquisar por nome ou símbolo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[90px] w-full" />
              ))}
            </div>
          ) : filteredCryptos && filteredCryptos.length > 0 ? (
            <CryptoList cryptos={filteredCryptos} />
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">
                {debouncedSearchQuery.trim()
                  ? 'Nenhuma criptomoeda encontrada com esse termo.'
                  : 'Nenhuma criptomoeda disponível no momento.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

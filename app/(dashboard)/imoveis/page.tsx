"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Property, PropertyType } from "@/types";
import { Plus, Search, MapPin, Maximize2, Building2 } from "lucide-react";

const typeColors: Record<PropertyType, "default" | "secondary" | "warning" | "success"> = {
    [PropertyType.APARTAMENTO]: "default",
    [PropertyType.CASA]: "success",
    [PropertyType.TERRENO]: "warning",
    [PropertyType.COMERCIAL]: "secondary",
    [PropertyType.RURAL]: "secondary",
    [PropertyType.COBERTURA]: "default",
    [PropertyType.LOFT]: "secondary",
    [PropertyType.KITNET]: "default",
};

export default function ImoveisPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const data = await api.getProperties();
            setProperties(data);
        } catch (error) {
            console.error("Failed to load properties:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter((property) =>
        property.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.tipo_imovel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seu portfólio de propriedades
                    </p>
                </div>
                <Link href="/imoveis/novo">
                    <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Cadastrar Imóvel
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Buscar por título, endereço, cidade ou tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Properties Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Carregando imóveis...</p>
                </div>
            ) : filteredProperties.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Nenhum imóvel encontrado</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProperties.map((property) => (
                        <Link key={property.id} href={`/imoveis/${property.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden">
                                {/* Image Placeholder */}
                                {property.imagens_URL?.[0] || property.imagem_url ? (
                                    <div className="h-48 relative">
                                        <img
                                            src={property.imagens_URL?.[0] || property.imagem_url}
                                            alt={property.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                                        <div className="text-center">
                                            <Building2 className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Sem imagem</p>
                                        </div>
                                    </div>
                                )}

                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg line-clamp-1">{property.titulo}</CardTitle>
                                        <Badge variant={typeColors[property.tipo_imovel]}>
                                            {property.tipo_imovel}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="line-clamp-1">
                                            {property.cidade && property.bairro
                                                ? `${property.bairro}, ${property.cidade}`
                                                : property.endereco}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        {property.area_total && (
                                            <div className="flex items-center gap-1">
                                                <Maximize2 className="w-4 h-4" />
                                                <span>{property.area_total}m²</span>
                                            </div>
                                        )}
                                        {(property.quartos || 0) > 0 && (
                                            <span>{property.quartos} quarto{(property.quartos || 0) > 1 ? "s" : ""}</span>
                                        )}
                                        {(property.banheiros || 0) > 0 && (
                                            <span>{property.banheiros} banh.</span>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t">
                                        <div className="flex items-baseline justify-between">
                                            <p className="text-2xl font-bold text-primary">
                                                {formatPrice(property.preco)}
                                            </p>
                                            {property.tipo_transacao && (
                                                <span className="text-xs text-muted-foreground">
                                                    {property.tipo_transacao}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {property.descricao && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {property.descricao}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Property, PropertyType, TransactionType, PublicationType } from "@/types";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ui/image-upload";

export default function PropertyDetailPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === "novo";

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [property, setProperty] = useState<Partial<Property>>({
        titulo: "",
        tipo_imovel: PropertyType.APARTAMENTO,
        tipo_transacao: TransactionType.VENDA,
        tipo_publicacao: PublicationType.PADRAO,
        descricao: "",
        preco: 0,
        area_total: 0,
        area_util: 0,
        quartos: 0,
        banheiros: 0,
        suites: 0,
        garagem: 0,
        iptu: 0,
        pais: "Brasil",
        estado: "",
        cidade: "",
        bairro: "",
        endereco: "",
        numero: "",
        complemento: "",
        cep: "",
        caracteristicas: "",
        nome_contato: "",
        email_contato: "",
        telefone: "",
        website: "",
        imagens_URL: [],
    });

    useEffect(() => {
        if (!isNew && params.id) {
            loadProperty(params.id as string);
        }
    }, [params.id, isNew]);

    const loadProperty = async (id: string) => {
        setLoading(true);
        try {
            const data = await api.getProperty(id);
            if (data) {
                setProperty(data);
            }
        } catch (error) {
            console.error("Failed to load property:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isNew) {
                await api.createProperty(property as Omit<Property, "id" | "createdAt" | "updatedAt">);
            } else {
                await api.updateProperty(params.id as string, property);
            }
            router.push("/imoveis");
        } catch (error) {
            console.error("Failed to save property:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja excluir este imóvel?")) {
            try {
                await api.deleteProperty(params.id as string);
                router.push("/imoveis");
            } catch (error) {
                console.error("Failed to delete property:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/imoveis">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isNew ? "Novo Imóvel" : "Editar Imóvel"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isNew ? "Cadastre uma nova propriedade" : "Atualize as informações do imóvel"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="grid gap-6">
                {/* Informações Básicas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="titulo">Título do Anúncio *</Label>
                            <Input
                                id="titulo"
                                value={property.titulo}
                                onChange={(e) => setProperty({ ...property, titulo: e.target.value })}
                                placeholder="Ex: Apartamento Moderno Centro"
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_imovel">Tipo de Imóvel</Label>
                                <select
                                    id="tipo_imovel"
                                    value={property.tipo_imovel}
                                    onChange={(e) => setProperty({ ...property, tipo_imovel: e.target.value as PropertyType })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {Object.values(PropertyType).map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo_transacao">Tipo de Transação</Label>
                                <select
                                    id="tipo_transacao"
                                    value={property.tipo_transacao}
                                    onChange={(e) => setProperty({ ...property, tipo_transacao: e.target.value as TransactionType })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {Object.values(TransactionType).map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo_publicacao">Tipo de Publicação</Label>
                                <select
                                    id="tipo_publicacao"
                                    value={property.tipo_publicacao}
                                    onChange={(e) => setProperty({ ...property, tipo_publicacao: e.target.value as PublicationType })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {Object.values(PublicationType).map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <textarea
                                id="descricao"
                                value={property.descricao}
                                onChange={(e) => setProperty({ ...property, descricao: e.target.value })}
                                placeholder="Descrição detalhada do imóvel..."
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Valores e Medidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Valores e Medidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="preco">Preço (R$) *</Label>
                                <Input
                                    id="preco"
                                    type="number"
                                    value={property.preco}
                                    onChange={(e) => setProperty({ ...property, preco: parseFloat(e.target.value) })}
                                    placeholder="450000"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area_total">Área Total (m²)</Label>
                                <Input
                                    id="area_total"
                                    type="number"
                                    value={property.area_total}
                                    onChange={(e) => setProperty({ ...property, area_total: parseFloat(e.target.value) })}
                                    placeholder="85"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area_util">Área Útil (m²)</Label>
                                <Input
                                    id="area_util"
                                    type="number"
                                    value={property.area_util}
                                    onChange={(e) => setProperty({ ...property, area_util: parseFloat(e.target.value) })}
                                    placeholder="75"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <Label htmlFor="quartos">Quartos</Label>
                                <Input
                                    id="quartos"
                                    type="number"
                                    value={property.quartos}
                                    onChange={(e) => setProperty({ ...property, quartos: parseInt(e.target.value) })}
                                    placeholder="2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="suites">Suítes</Label>
                                <Input
                                    id="suites"
                                    type="number"
                                    value={property.suites}
                                    onChange={(e) => setProperty({ ...property, suites: parseInt(e.target.value) })}
                                    placeholder="1"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="banheiros">Banheiros</Label>
                                <Input
                                    id="banheiros"
                                    type="number"
                                    value={property.banheiros}
                                    onChange={(e) => setProperty({ ...property, banheiros: parseInt(e.target.value) })}
                                    placeholder="2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="garagem">Vagas Garagem</Label>
                                <Input
                                    id="garagem"
                                    type="number"
                                    value={property.garagem}
                                    onChange={(e) => setProperty({ ...property, garagem: parseInt(e.target.value) })}
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="iptu">IPTU (R$/mês)</Label>
                            <Input
                                id="iptu"
                                type="number"
                                value={property.iptu}
                                onChange={(e) => setProperty({ ...property, iptu: parseFloat(e.target.value) })}
                                placeholder="350"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Localização */}
                <Card>
                    <CardHeader>
                        <CardTitle>Localização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="estado">Estado</Label>
                                <Input
                                    id="estado"
                                    value={property.estado}
                                    onChange={(e) => setProperty({ ...property, estado: e.target.value })}
                                    placeholder="SP"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cidade">Cidade</Label>
                                <Input
                                    id="cidade"
                                    value={property.cidade}
                                    onChange={(e) => setProperty({ ...property, cidade: e.target.value })}
                                    placeholder="São Paulo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bairro">Bairro</Label>
                                <Input
                                    id="bairro"
                                    value={property.bairro}
                                    onChange={(e) => setProperty({ ...property, bairro: e.target.value })}
                                    placeholder="Centro"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    value={property.endereco}
                                    onChange={(e) => setProperty({ ...property, endereco: e.target.value })}
                                    placeholder="Rua das Flores"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="numero">Número</Label>
                                <Input
                                    id="numero"
                                    value={property.numero}
                                    onChange={(e) => setProperty({ ...property, numero: e.target.value })}
                                    placeholder="123"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="complemento">Complemento</Label>
                                <Input
                                    id="complemento"
                                    value={property.complemento}
                                    onChange={(e) => setProperty({ ...property, complemento: e.target.value })}
                                    placeholder="Apto 501"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cep">CEP</Label>
                                <Input
                                    id="cep"
                                    value={property.cep}
                                    onChange={(e) => setProperty({ ...property, cep: e.target.value })}
                                    placeholder="01310-100"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Características e Contato */}
                <Card>
                    <CardHeader>
                        <CardTitle>Características e Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="caracteristicas">Características</Label>
                            <textarea
                                id="caracteristicas"
                                value={property.caracteristicas}
                                onChange={(e) => setProperty({ ...property, caracteristicas: e.target.value })}
                                placeholder="Ex: Varanda gourmet, Área de lazer, Portaria 24h, Elevador"
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nome_contato">Nome do Contato</Label>
                                <Input
                                    id="nome_contato"
                                    value={property.nome_contato}
                                    onChange={(e) => setProperty({ ...property, nome_contato: e.target.value })}
                                    placeholder="João Silva"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    value={property.telefone}
                                    onChange={(e) => setProperty({ ...property, telefone: e.target.value })}
                                    placeholder="(11) 98765-4321"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email_contato">E-mail do Contato</Label>
                                <Input
                                    id="email_contato"
                                    type="email"
                                    value={property.email_contato}
                                    onChange={(e) => setProperty({ ...property, email_contato: e.target.value })}
                                    placeholder="joao@imobiliaria.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={property.website}
                                    onChange={(e) => setProperty({ ...property, website: e.target.value })}
                                    placeholder="www.imobiliaria.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Fotos do Imóvel</Label>
                            <ImageUpload
                                value={property.imagens_URL || []}
                                onChange={(urls) => setProperty({ ...property, imagens_URL: urls })}
                                onRemove={(url) => setProperty({ ...property, imagens_URL: property.imagens_URL?.filter((current) => current !== url) })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-8">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar"}
                </Button>
                {!isNew && (
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                    </Button>
                )}
                <Link href="/imoveis">
                    <Button variant="outline">Cancelar</Button>
                </Link>
            </div>
        </div>
    );
}

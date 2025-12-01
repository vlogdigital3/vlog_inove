"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Lead, LeadStatus } from "@/types";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === "novo";

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [lead, setLead] = useState<Partial<Lead>>({
        name: "",
        phone: "",
        email: "",
        status: LeadStatus.NOVO,
        interest: "",
        notes: "",
    });

    useEffect(() => {
        if (!isNew && params.id) {
            loadLead(params.id as string);
        }
    }, [params.id, isNew]);

    const loadLead = async (id: string) => {
        setLoading(true);
        try {
            const data = await api.getLead(id);
            if (data) {
                setLead(data);
            }
        } catch (error) {
            console.error("Failed to load lead:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isNew) {
                await api.createLead(lead as Omit<Lead, "id" | "createdAt" | "updatedAt">);
            } else {
                await api.updateLead(params.id as string, lead);
            }
            router.push("/leads");
        } catch (error) {
            console.error("Failed to save lead:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja excluir este lead?")) {
            try {
                await api.deleteLead(params.id as string);
                router.push("/leads");
            } catch (error) {
                console.error("Failed to delete lead:", error);
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
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/leads">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isNew ? "Novo Lead" : "Editar Lead"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isNew ? "Cadastre um novo contato" : "Atualize as informações do lead"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações do Lead</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                                id="name"
                                value={lead.name}
                                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                                placeholder="Nome do lead"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone *</Label>
                            <Input
                                id="phone"
                                value={lead.phone}
                                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={lead.email}
                            onChange={(e) => setLead({ ...lead, email: e.target.value })}
                            placeholder="email@exemplo.com"
                            required
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={lead.status}
                                onChange={(e) => setLead({ ...lead, status: e.target.value as LeadStatus })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {Object.values(LeadStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interest">Interesse</Label>
                            <Input
                                id="interest"
                                value={lead.interest}
                                onChange={(e) => setLead({ ...lead, interest: e.target.value })}
                                placeholder="Ex: Apartamento 2 quartos"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <textarea
                            id="notes"
                            value={lead.notes}
                            onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                            placeholder="Anotações sobre o lead..."
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
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
                <Link href="/leads">
                    <Button variant="outline">Cancelar</Button>
                </Link>
            </div>
        </div>
    );
}

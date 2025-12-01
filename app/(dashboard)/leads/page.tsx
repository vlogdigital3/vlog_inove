"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Lead, LeadStatus } from "@/types";
import { Plus, Search, Phone, Mail } from "lucide-react";

const statusColors: Record<LeadStatus, "default" | "secondary" | "warning" | "success" | "destructive"> = {
    [LeadStatus.NOVO]: "default",
    [LeadStatus.QUALIFICANDO]: "secondary",
    [LeadStatus.VISITA]: "warning",
    [LeadStatus.PROPOSTA]: "default",
    [LeadStatus.FECHADO]: "success",
    [LeadStatus.PERDIDO]: "destructive",
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        setLoading(true);
        try {
            const data = await api.getLeads();
            setLeads(data);
        } catch (error) {
            console.error("Failed to load leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter((lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seus contatos e oportunidades
                    </p>
                </div>
                <Link href="/leads/novo">
                    <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Lead
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Buscar por nome, e-mail ou telefone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Leads List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Carregando leads...</p>
                </div>
            ) : filteredLeads.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Nenhum lead encontrado</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredLeads.map((lead) => (
                        <Link key={lead.id} href={`/leads/${lead.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg">{lead.name}</CardTitle>
                                        <Badge variant={statusColors[lead.status]}>
                                            {lead.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        <span>{lead.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{lead.email}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <p className="text-sm font-medium">Interesse:</p>
                                        <p className="text-sm text-muted-foreground">{lead.interest}</p>
                                    </div>
                                    {lead.notes && (
                                        <div className="pt-2 border-t">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {lead.notes}
                                            </p>
                                        </div>
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

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, TrendingUp, Calendar, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const kpiData = [
    {
        title: "Leads Novos",
        value: "0",
        description: "Nenhum lead cadastrado ainda",
        icon: Users,
        href: "/leads",
    },
    {
        title: "Imóveis Cadastrados",
        value: "0",
        description: "Nenhum imóvel cadastrado ainda",
        icon: Building2,
        href: "/imoveis",
    },
    {
        title: "Taxa de Conversão",
        value: "0%",
        description: "Aguardando dados",
        icon: TrendingUp,
        href: "/funil",
    },
    {
        title: "Atividades Hoje",
        value: "0",
        description: "Nenhuma atividade registrada",
        icon: Calendar,
        href: "/dashboard",
    },
];

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Bem-vindo, {user?.name || "Usuário"}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    Comece cadastrando seus primeiros leads e imóveis
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={kpi.title} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {kpi.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {kpi.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State - Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                    <CardDescription>
                        Suas últimas interações aparecerão aqui
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Nenhuma atividade ainda</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Quando você começar a cadastrar leads e imóveis, suas atividades aparecerão aqui
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" onClick={() => router.push('/leads')}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Adicionar Lead</h3>
                                <p className="text-sm text-muted-foreground">Cadastrar novo contato</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" onClick={() => router.push('/imoveis')}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Cadastrar Imóvel</h3>
                                <p className="text-sm text-muted-foreground">Adicionar nova propriedade</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" onClick={() => router.push('/dashboard')}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Agendar Visita</h3>
                                <p className="text-sm text-muted-foreground">Marcar compromisso</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Getting Started Guide */}
            <Card className="border-2 border-dashed">
                <CardHeader>
                    <CardTitle>🚀 Primeiros Passos</CardTitle>
                    <CardDescription>
                        Configure seu CRM em poucos minutos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium">Cadastre seus primeiros leads</h4>
                                <p className="text-sm text-muted-foreground">
                                    Adicione contatos interessados em imóveis
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium">Adicione seus imóveis</h4>
                                <p className="text-sm text-muted-foreground">
                                    Cadastre as propriedades disponíveis
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium">Gerencie o funil de vendas</h4>
                                <p className="text-sm text-muted-foreground">
                                    Acompanhe o progresso de cada negociação
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

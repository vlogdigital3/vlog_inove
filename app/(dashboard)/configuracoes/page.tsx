"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Save, Moon, Sun } from "lucide-react";

export default function ConfiguracoesPage() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [saving, setSaving] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const [userData, setUserData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        company: user?.company || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSaveProfile = async () => {
        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSaving(false);
        alert("Configurações salvas com sucesso!");
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("As senhas não coincidem");
            return;
        }
        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSaving(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        alert("Senha alterada com sucesso!");
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground mt-1">
                    Gerencie suas preferências e informações da conta
                </p>
            </div>

            {/* User Data */}
            <Card>
                <CardHeader>
                    <CardTitle>Dados do Usuário</CardTitle>
                    <CardDescription>
                        Atualize suas informações pessoais
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                            id="company"
                            value={userData.company}
                            onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                            placeholder="Nome da sua imobiliária"
                        />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </CardContent>
            </Card>

            {/* Theme */}
            <Card>
                <CardHeader>
                    <CardTitle>Aparência</CardTitle>
                    <CardDescription>
                        Personalize a aparência do sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Tema</p>
                            <p className="text-sm text-muted-foreground">
                                {theme === "dark" ? "Modo Escuro" : "Modo Claro"}
                            </p>
                        </div>
                        <Button onClick={toggleTheme} variant="outline">
                            {theme === "dark" ? (
                                <>
                                    <Sun className="w-4 h-4 mr-2" />
                                    Modo Claro
                                </>
                            ) : (
                                <>
                                    <Moon className="w-4 h-4 mr-2" />
                                    Modo Escuro
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Password */}
            <Card>
                <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>
                        Atualize sua senha de acesso
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <Button onClick={handleChangePassword} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Alterar Senha
                    </Button>
                </CardContent>
            </Card>

            {/* Company Data */}
            <Card>
                <CardHeader>
                    <CardTitle>Dados da Empresa</CardTitle>
                    <CardDescription>
                        Informações sobre sua imobiliária (disponível na Fase 2)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Nome da Empresa</Label>
                            <Input id="companyName" placeholder="Imobiliária XYZ" disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input id="cnpj" placeholder="00.000.000/0000-00" disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyAddress">Endereço</Label>
                        <Input id="companyAddress" placeholder="Rua, número - Cidade" disabled />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Funcionalidade completa disponível após integração com back-end
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

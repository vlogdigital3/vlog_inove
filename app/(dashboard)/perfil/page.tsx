"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Upload, User as UserIcon } from "lucide-react";

export default function PerfilPage() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: "",
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSaving(false);
        alert("Perfil atualizado com sucesso!");
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
                <p className="text-muted-foreground mt-1">
                    Gerencie suas informações de perfil
                </p>
            </div>

            {/* Avatar */}
            <Card>
                <CardHeader>
                    <CardTitle>Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <UserIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Fazer Upload
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                JPG, PNG ou GIF. Máximo 2MB.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                (Funcionalidade disponível na Fase 2)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            placeholder="Conte um pouco sobre você..."
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </CardContent>
            </Card>

            {/* Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Leads Cadastrados</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Imóveis Gerenciados</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Negócios Fechados</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        Suas estatísticas aparecerão aqui conforme você usar o sistema
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

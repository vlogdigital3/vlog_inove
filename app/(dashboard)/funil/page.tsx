"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { FunnelItem, LeadStatus } from "@/types";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Calendar, TrendingUp } from "lucide-react";

const columns = [
    { id: LeadStatus.NOVO, title: "Novo", color: "bg-blue-500" },
    { id: LeadStatus.QUALIFICANDO, title: "Qualificando", color: "bg-purple-500" },
    { id: LeadStatus.VISITA, title: "Visita", color: "bg-yellow-500" },
    { id: LeadStatus.PROPOSTA, title: "Proposta", color: "bg-orange-500" },
    { id: LeadStatus.FECHADO, title: "Fechado", color: "bg-green-500" },
    { id: LeadStatus.PERDIDO, title: "Perdido", color: "bg-red-500" },
];

function FunnelCard({ item }: { item: FunnelItem }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const formatPrice = (price?: number) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-card border border-border rounded-lg p-4 mb-3 cursor-move hover:shadow-md transition-shadow"
        >
            <h4 className="font-semibold text-sm mb-2">{item.leadName}</h4>
            {item.propertyName && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                    {item.propertyName}
                </p>
            )}
            <div className="space-y-2">
                {item.value && (
                    <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                            {formatPrice(item.value)}
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{item.daysInStage} dias nesta etapa</span>
                </div>
            </div>
        </div>
    );
}

function FunnelColumn({
    column,
    items,
}: {
    column: { id: LeadStatus; title: string; color: string };
    items: FunnelItem[];
}) {
    return (
        <div className="flex-shrink-0 w-80">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${column.color}`} />
                            <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
                        </div>
                        <Badge variant="secondary">{items.length}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="min-h-[200px]">
                            {items.map((item) => (
                                <FunnelCard key={item.id} item={item} />
                            ))}
                            {items.length === 0 && (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    Nenhum item
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
}

export default function FunilPage() {
    const [items, setItems] = useState<FunnelItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        loadFunnelItems();
    }, []);

    const loadFunnelItems = async () => {
        setLoading(true);
        try {
            const data = await api.getFunnelItems();
            setItems(data);
        } catch (error) {
            console.error("Failed to load funnel items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeItem = items.find((item) => item.id === active.id);
        if (!activeItem) return;

        // Check if dropped on a different column
        const overColumn = columns.find((col) =>
            items.filter((item) => item.stage === col.id).some((item) => item.id === over.id)
        );

        if (overColumn && activeItem.stage !== overColumn.id) {
            // Update item stage
            const updatedItems = items.map((item) =>
                item.id === activeItem.id ? { ...item, stage: overColumn.id, daysInStage: 0 } : item
            );
            setItems(updatedItems);

            // Simulate API call
            try {
                await api.updateFunnelItemStage(activeItem.id, overColumn.id);
            } catch (error) {
                console.error("Failed to update funnel item:", error);
                // Revert on error
                setItems(items);
            }
        }
    };

    const getItemsByStage = (stage: LeadStatus) => {
        return items.filter((item) => item.stage === stage);
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando funil...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Funil de Vendas</h1>
                <p className="text-muted-foreground mt-1">
                    Acompanhe o progresso de suas oportunidades
                </p>
            </div>

            {/* Kanban Board */}
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max">
                        {columns.map((column) => (
                            <FunnelColumn
                                key={column.id}
                                column={column}
                                items={getItemsByStage(column.id)}
                            />
                        ))}
                    </div>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="bg-card border border-border rounded-lg p-4 shadow-lg opacity-90">
                            {items.find((item) => item.id === activeId)?.leadName}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Resumo do Funil</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {columns.map((column) => {
                            const columnItems = getItemsByStage(column.id);
                            const totalValue = columnItems.reduce((sum, item) => sum + (item.value || 0), 0);
                            return (
                                <div key={column.id} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${column.color}`} />
                                        <p className="text-sm font-medium">{column.title}</p>
                                    </div>
                                    <p className="text-2xl font-bold">{columnItems.length}</p>
                                    {totalValue > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                                minimumFractionDigits: 0,
                                            }).format(totalValue)}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

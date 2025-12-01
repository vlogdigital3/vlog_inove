// User types
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    company?: string;
}

// Lead types
export enum LeadStatus {
    NOVO = "Novo",
    QUALIFICANDO = "Qualificando",
    VISITA = "Visita Agendada",
    PROPOSTA = "Proposta Enviada",
    FECHADO = "Fechado",
    PERDIDO = "Perdido",
}

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: LeadStatus;
    interest: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Property types
export enum PropertyType {
    APARTAMENTO = "Apartamento",
    CASA = "Casa",
    TERRENO = "Terreno",
    COMERCIAL = "Comercial",
    RURAL = "Rural",
    COBERTURA = "Cobertura",
    LOFT = "Loft",
    KITNET = "Kitnet",
}

export enum TransactionType {
    VENDA = "Venda",
    ALUGUEL = "Aluguel",
    TEMPORADA = "Temporada",
}

export enum PublicationType {
    PADRAO = "Padrão",
    DESTAQUE = "Destaque",
    SUPER_DESTAQUE = "Super Destaque",
}

export interface Property {
    id: string;
    id_imovel?: string;
    titulo: string;
    tipo_transacao: TransactionType;
    tipo_publicacao: PublicationType;
    imagem_url?: string;
    tipo_imovel: PropertyType;
    descricao: string;
    preco: number;
    area_total?: number;
    area_util?: number;
    quartos?: number;
    banheiros?: number;
    suites?: number;
    garagem?: number;
    iptu?: number;
    pais?: string;
    estado?: string;
    cidade?: string;
    bairro?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    cep?: string;
    latitude?: number;
    longitude?: number;
    caracteristicas?: string;
    nome_contato?: string;
    email_contato?: string;
    website?: string;
    telefone?: string;
    imagens_URL?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Funnel types
export interface FunnelItem {
    id: string;
    leadId: string;
    leadName: string;
    propertyId?: string;
    propertyName?: string;
    stage: LeadStatus;
    value?: number;
    daysInStage: number;
    lastContact?: Date;
}

// Dashboard types
export interface KPIData {
    label: string;
    value: number;
    change: number; // percentage
    icon: string;
}

export interface Activity {
    id: string;
    type: "lead" | "property" | "funnel";
    description: string;
    timestamp: Date;
}

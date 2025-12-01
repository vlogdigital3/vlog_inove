import { supabase } from "@/lib/supabase";
import { Lead, Property, FunnelItem, LeadStatus, PropertyType, TransactionType, PublicationType } from "@/types";

// Helper to map DB Lead to Frontend Lead
const mapLead = (data: any): Lead => ({
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: data.status as LeadStatus,
    interest: data.interest,
    notes: data.notes,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
});

// Helper to map DB Property to Frontend Property
const mapProperty = (data: any): Property => ({
    id: data.id.toString(),
    id_imovel: data.id_imovel,
    titulo: data.titulo,
    tipo_transacao: data.tipo_transacao as TransactionType,
    tipo_publicacao: data.tipo_publicacao as PublicationType,
    imagem_url: data.imagem_url,
    tipo_imovel: data.tipo_imovel as PropertyType,
    descricao: data.descricao,
    preco: Number(data.preco),
    area_total: Number(data.area_total),
    area_util: Number(data.area_util),
    quartos: data.quartos,
    banheiros: data.banheiros,
    suites: data.suites,
    garagem: data.garagem,
    iptu: Number(data.iptu),
    pais: data.pais,
    estado: data.estado,
    cidade: data.cidade,
    bairro: data.bairro,
    endereco: data.endereco,
    numero: data.numero,
    complemento: data.complemento,
    cep: data.cep,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    caracteristicas: data.caracteristicas,
    nome_contato: data.nome_contato,
    email_contato: data.email_contato,
    website: data.website,
    telefone: data.telefone,
    imagens_URL: Array.isArray(data.imagens_URL) ? data.imagens_URL : (data.imagens_URL ? [data.imagens_URL] : []),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
});

// Helper to map DB Funnel Item to Frontend Funnel Item
const mapFunnelItem = (data: any): FunnelItem => ({
    id: data.id,
    leadId: data.lead_id,
    leadName: data.leads?.name || "Unknown", // Joined data
    propertyId: data.property_id?.toString(),
    propertyName: data.imoveis_venda?.titulo, // Joined data
    stage: data.stage as LeadStatus,
    value: Number(data.value),
    daysInStage: data.days_in_stage,
    lastContact: new Date(data.last_contact),
});

export const api = {
    // Leads
    async getLeads(): Promise<Lead[]> {
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data.map(mapLead);
    },

    async getLead(id: string): Promise<Lead | undefined> {
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return undefined;
        return mapLead(data);
    },

    async createLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from("leads")
            .insert({
                user_id: user.id,
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                status: lead.status,
                interest: lead.interest,
                notes: lead.notes,
            })
            .select()
            .single();

        if (error) throw error;
        return mapLead(data);
    },

    async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
        const { data, error } = await supabase
            .from("leads")
            .update({
                name: updates.name,
                email: updates.email,
                phone: updates.phone,
                status: updates.status,
                interest: updates.interest,
                notes: updates.notes,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return mapLead(data);
    },

    async deleteLead(id: string): Promise<void> {
        const { error } = await supabase.from("leads").delete().eq("id", id);
        if (error) throw error;
    },

    // Properties
    async getProperties(): Promise<Property[]> {
        const { data, error } = await supabase
            .from("imoveis_venda")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data.map(mapProperty);
    },

    async getProperty(id: string): Promise<Property | undefined> {
        const { data, error } = await supabase
            .from("imoveis_venda")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return undefined;
        return mapProperty(data);
    },

    async createProperty(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
        const { data, error } = await supabase
            .from("imoveis_venda")
            .insert({
                id_imovel: property.id_imovel,
                titulo: property.titulo,
                tipo_transacao: property.tipo_transacao,
                tipo_publicacao: property.tipo_publicacao,
                imagem_url: property.imagem_url,
                tipo_imovel: property.tipo_imovel,
                descricao: property.descricao,
                preco: property.preco,
                area_total: property.area_total,
                area_util: property.area_util,
                quartos: property.quartos,
                banheiros: property.banheiros,
                suites: property.suites,
                garagem: property.garagem,
                iptu: property.iptu,
                pais: property.pais,
                estado: property.estado,
                cidade: property.cidade,
                bairro: property.bairro,
                endereco: property.endereco,
                numero: property.numero,
                complemento: property.complemento,
                cep: property.cep,
                latitude: property.latitude,
                longitude: property.longitude,
                caracteristicas: property.caracteristicas,
                nome_contato: property.nome_contato,
                email_contato: property.email_contato,
                website: property.website,
                telefone: property.telefone,
                "imagens_URL": property.imagens_URL,
            })
            .select()
            .single();

        if (error) throw error;
        return mapProperty(data);
    },

    async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
        // Filter out undefined values to avoid overwriting with null
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined)
        );

        // Map camelCase to snake_case manually or just pass what matches
        // Since we have many fields, we'll just map the ones we know might change
        // Ideally we should have a mapper function for updates too

        const dbUpdates: any = {
            ...cleanUpdates,
            updated_at: new Date().toISOString(),
        };

        // Handle specific field mappings if needed (e.g. imagens_URL)
        if (updates.imagens_URL) dbUpdates["imagens_URL"] = updates.imagens_URL;

        const { data, error } = await supabase
            .from("imoveis_venda")
            .update(dbUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return mapProperty(data);
    },

    async deleteProperty(id: string): Promise<void> {
        const { error } = await supabase.from("imoveis_venda").delete().eq("id", id);
        if (error) throw error;
    },

    // Funnel
    async getFunnelItems(): Promise<FunnelItem[]> {
        const { data, error } = await supabase
            .from("funnel_items")
            .select(`
        *,
        leads (name),
        imoveis_venda (titulo)
      `)
            .order("last_contact", { ascending: false });

        if (error) throw error;
        return data.map(mapFunnelItem);
    },

    async updateFunnelItemStage(id: string, stage: LeadStatus): Promise<FunnelItem> {
        const { data, error } = await supabase
            .from("funnel_items")
            .update({
                stage,
                days_in_stage: 0,
                last_contact: new Date().toISOString(),
            })
            .eq("id", id)
            .select(`
        *,
        leads (name),
        imoveis_venda (titulo)
      `)
            .single();

        if (error) throw error;
        return mapFunnelItem(data);
    },

    // Storage
    async uploadImage(file: File, bucket: 'properties' | 'avatars' = 'properties'): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    }
};

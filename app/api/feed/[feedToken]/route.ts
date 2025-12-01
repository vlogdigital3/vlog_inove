import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Helper function to wrap content in CDATA
function cdata(content: string): string {
    if (!content) return '';
    return `<![CDATA[${content}]]>`;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { feedToken: string } }
) {
    try {
        const feedToken = params.feedToken.replace('.xml', '');

        // TODO: Validate feed token and get user settings from database
        // For now, we'll use mock data
        const userId = 'mock-user-id';
        const feedSettings = {
            isEnabled: true,
            includeAllProperties: true,
            includeAvailableOnly: false,
            includeLeads: false,
        };

        if (!feedSettings.isEnabled) {
            return new NextResponse('Feed disabled', { status: 403 });
        }

        // Get properties from database
        // TODO: Replace with actual query based on user_id
        const { data: properties, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .limit(100); // Limit for performance

        if (propertiesError) {
            console.error('Error fetching properties:', propertiesError);
        }

        // Get leads if enabled
        let leads: any[] = [];
        if (feedSettings.includeLeads) {
            const { data: leadsData, error: leadsError } = await supabase
                .from('leads')
                .select('*')
                .limit(100);

            if (!leadsError && leadsData) {
                leads = leadsData;
            }
        }

        // Generate XML
        const now = new Date().toISOString();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vloginoveplus.com';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<vloginoveplus>
    <generated_at>${now}</generated_at>
    <user_id>${escapeXml(userId)}</user_id>
    <properties>`;

        // Add properties
        if (properties && properties.length > 0) {
            for (const property of properties) {
                // Filter based on settings
                if (feedSettings.includeAvailableOnly && property.status !== 'Disponível') {
                    continue;
                }

                xml += `
        <property>
            <id>${escapeXml(String(property.id))}</id>
            <title>${cdata(property.titulo || '')}</title>
            <description>${cdata(property.descricao || '')}</description>
            <price>${property.preco || 0}</price>
            <currency>BRL</currency>
            <type>${escapeXml(property.tipo_imovel || '')}</type>
            <status>${escapeXml(property.status || 'Disponível')}</status>
            <transaction_type>${escapeXml(property.tipo_transacao || 'Venda')}</transaction_type>
            <area>${property.area_total || 0}</area>
            <bedrooms>${property.quartos || 0}</bedrooms>
            <bathrooms>${property.banheiros || 0}</bathrooms>
            <garage>${property.vagas_garagem || 0}</garage>
            <address>
                <street>${escapeXml(property.endereco || '')}</street>
                <number>${escapeXml(property.numero || '')}</number>
                <neighborhood>${escapeXml(property.bairro || '')}</neighborhood>
                <city>${escapeXml(property.cidade || '')}</city>
                <state>${escapeXml(property.estado || '')}</state>
                <zipcode>${escapeXml(property.cep || '')}</zipcode>
                <country>Brasil</country>
            </address>`;

                // Add images if available
                if (property.fotos && Array.isArray(property.fotos) && property.fotos.length > 0) {
                    xml += `
            <images>`;
                    for (const foto of property.fotos) {
                        xml += `
                <image>${escapeXml(foto)}</image>`;
                    }
                    xml += `
            </images>`;
                } else {
                    xml += `
            <images></images>`;
                }

                xml += `
            <url>${baseUrl}/imoveis/${property.id}</url>
            <created_at>${property.created_at || now}</created_at>
            <updated_at>${property.updated_at || now}</updated_at>
        </property>`;
            }
        }

        xml += `
    </properties>`;

        // Add leads section
        xml += `
    <leads>`;

        if (feedSettings.includeLeads && leads.length > 0) {
            for (const lead of leads) {
                xml += `
        <lead>
            <id>${escapeXml(String(lead.id))}</id>
            <name>${cdata(lead.name || '')}</name>
            <phone>${escapeXml(lead.phone || '')}</phone>
            <email>${escapeXml(lead.email || '')}</email>
            <status>${escapeXml(lead.status || '')}</status>
            <property_interest>${escapeXml(String(lead.property_id || ''))}</property_interest>
            <created_at>${lead.created_at || now}</created_at>
        </lead>`;
            }
        }

        xml += `
    </leads>
</vloginoveplus>`;

        // Return XML with proper headers
        return new NextResponse(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
                'X-Robots-Tag': 'noindex', // Don't index feed in search engines
            },
        });

    } catch (error) {
        console.error('Feed generation error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

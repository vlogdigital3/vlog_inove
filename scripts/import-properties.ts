import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Lê as variáveis de ambiente do .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não encontradas no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importProperties() {
    try {
        console.log('📂 Lendo arquivo CSV...');
        const csvPath = path.join(__dirname, 'properties_import.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');

        const lines = csvContent.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');

        console.log(`📊 Encontradas ${lines.length - 1} propriedades para importar\n`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const property: any = {};

            headers.forEach((header, index) => {
                property[header.trim()] = values[index]?.trim() || '';
            });

            try {
                // Parse JSON arrays
                let fotos: string[] = [];
                try {
                    fotos = property.imagens_url ? JSON.parse(property.imagens_url) : [];
                } catch (e) {
                    fotos = [];
                }

                // Converte tipos - apenas campos essenciais
                const propertyData: any = {
                    titulo: property.titulo || 'Sem título',
                    descricao: property.descricao || '',
                    preco: parseFloat(property.preco) || 0,
                    tipo_imovel: property.tipo_imovel || 'Apartamento',
                    tipo_transacao: property.tipo_transacao === 'For Sale' ? 'Venda' : 'Venda',
                    status: 'Disponível',
                    quartos: parseInt(property.quartos) || 0,
                    banheiros: parseInt(property.banheiros) || 0,
                    vagas_garagem: parseInt(property.garagem) || 0,
                    endereco: property.endereco || '',
                    numero: property.numero || '',
                    bairro: property.bairro || '',
                    cidade: property.cidade || '',
                    estado: property.estado || '',
                    fotos: fotos,
                };

                // Adiciona campos opcionais apenas se existirem
                if (property.area_total) propertyData.area_total = parseFloat(property.area_total);
                if (property.area_util) propertyData.area_util = parseFloat(property.area_util);
                if (property.suites) propertyData.suites = parseInt(property.suites);
                if (property.latitude) propertyData.latitude = parseFloat(property.latitude);
                if (property.longitude) propertyData.longitude = parseFloat(property.longitude);
                if (property.video_url) propertyData.video_url = property.video_url;

                const { data, error } = await supabase
                    .from('properties')
                    .insert([propertyData])
                    .select();

                if (error) {
                    console.error(`❌ Erro ao importar "${property.titulo}":`, error.message);
                    errorCount++;
                } else {
                    console.log(`✅ Importado: ${property.titulo}`);
                    successCount++;
                }

            } catch (err: any) {
                console.error(`❌ Erro ao processar linha ${i}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\n📈 Resumo da importação:`);
        console.log(`   ✅ Sucesso: ${successCount}`);
        console.log(`   ❌ Erros: ${errorCount}`);
        console.log(`   📊 Total: ${lines.length - 1}`);

    } catch (error: any) {
        console.error('❌ Erro fatal:', error.message);
        process.exit(1);
    }
}

// Helper para fazer parse de linhas CSV com campos entre aspas
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}

// Executa a importação
importProperties();

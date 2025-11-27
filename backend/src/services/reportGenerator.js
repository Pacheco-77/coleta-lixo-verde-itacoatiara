const jsPDF = require('jspdf');
const xlsx = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

// Diretório para salvar relatórios
const REPORTS_DIR = path.join(__dirname, '../../reports');

// Garantir que o diretório existe
const ensureReportsDir = async () => {
  try {
    await fs.mkdir(REPORTS_DIR, { recursive: true });
  } catch (error) {
    logger.error(`Erro ao criar diretório de relatórios: ${error.message}`);
  }
};

// Gerar relatório em PDF
const generatePDFReport = async (data, options = {}) => {
  try {
    await ensureReportsDir();

    const doc = new jsPDF();
    const {
      title = 'Relatório Coleta Verde',
      subtitle = '',
      period = '',
      sections = [],
    } = options;

    let yPosition = 20;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(46, 204, 113); // Verde
    doc.text(title, 105, yPosition, { align: 'center' });
    yPosition += 10;

    if (subtitle) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(subtitle, 105, yPosition, { align: 'center' });
      yPosition += 8;
    }

    if (period) {
      doc.setFontSize(10);
      doc.text(`Período: ${period}`, 105, yPosition, { align: 'center' });
      yPosition += 15;
    }

    // Linha separadora
    doc.setDrawColor(46, 204, 113);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Seções do relatório
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    for (const section of sections) {
      // Verificar se precisa de nova página
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      // Título da seção
      doc.setFontSize(14);
      doc.setTextColor(46, 204, 113);
      doc.text(section.title, 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // Conteúdo da seção
      if (section.type === 'text') {
        const lines = doc.splitTextToSize(section.content, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 5;
      } else if (section.type === 'table') {
        // Tabela simples
        const { headers, rows } = section.content;
        
        // Cabeçalhos
        doc.setFillColor(46, 204, 113);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, yPosition, 170, 8, 'F');
        
        let xPos = 25;
        const colWidth = 170 / headers.length;
        headers.forEach(header => {
          doc.text(header, xPos, yPosition + 5);
          xPos += colWidth;
        });
        yPosition += 10;

        // Linhas
        doc.setTextColor(0, 0, 0);
        rows.forEach((row, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, yPosition, 170, 7, 'F');
          }

          xPos = 25;
          row.forEach(cell => {
            doc.text(String(cell), xPos, yPosition + 5);
            xPos += colWidth;
          });
          yPosition += 7;
        });
        yPosition += 5;
      } else if (section.type === 'list') {
        section.content.forEach(item => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${item}`, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      } else if (section.type === 'stats') {
        // Estatísticas em caixas
        const stats = section.content;
        let xPos = 20;
        const boxWidth = 40;
        const boxHeight = 25;

        stats.forEach((stat, index) => {
          if (index > 0 && index % 4 === 0) {
            yPosition += boxHeight + 5;
            xPos = 20;
          }

          // Caixa
          doc.setFillColor(240, 240, 240);
          doc.rect(xPos, yPosition, boxWidth, boxHeight, 'F');
          doc.setDrawColor(200, 200, 200);
          doc.rect(xPos, yPosition, boxWidth, boxHeight);

          // Valor
          doc.setFontSize(16);
          doc.setTextColor(46, 204, 113);
          doc.text(String(stat.value), xPos + boxWidth / 2, yPosition + 12, { align: 'center' });

          // Label
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const labelLines = doc.splitTextToSize(stat.label, boxWidth - 4);
          doc.text(labelLines, xPos + boxWidth / 2, yPosition + 18, { align: 'center' });

          xPos += boxWidth + 5;
        });

        yPosition += boxHeight + 10;
        doc.setFontSize(10);
      }
    }

    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
      doc.text(
        `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
        105,
        295,
        { align: 'center' }
      );
    }

    // Salvar arquivo
    const filename = `relatorio_${Date.now()}.pdf`;
    const filepath = path.join(REPORTS_DIR, filename);
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    await fs.writeFile(filepath, pdfBuffer);

    logger.info(`Relatório PDF gerado: ${filename}`);

    return {
      success: true,
      filename,
      filepath,
      url: `/reports/${filename}`,
    };
  } catch (error) {
    logger.error(`Erro ao gerar relatório PDF: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Gerar relatório em Excel
const generateExcelReport = async (data, options = {}) => {
  try {
    await ensureReportsDir();

    const {
      title = 'Relatório Coleta Verde',
      sheets = [],
    } = options;

    const workbook = xlsx.utils.book_new();

    // Adicionar sheets
    for (const sheet of sheets) {
      const { name, data: sheetData, headers } = sheet;

      // Criar worksheet
      const ws = xlsx.utils.aoa_to_sheet([headers, ...sheetData]);

      // Estilizar cabeçalhos (limitado no xlsx básico)
      const range = xlsx.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = xlsx.utils.encode_col(C) + '1';
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: '2ECC71' } },
        };
      }

      // Ajustar largura das colunas
      const colWidths = headers.map((_, i) => {
        const maxLength = Math.max(
          headers[i].length,
          ...sheetData.map(row => String(row[i] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;

      xlsx.utils.book_append_sheet(workbook, ws, name);
    }

    // Salvar arquivo
    const filename = `relatorio_${Date.now()}.xlsx`;
    const filepath = path.join(REPORTS_DIR, filename);

    xlsx.writeFile(workbook, filepath);

    logger.info(`Relatório Excel gerado: ${filename}`);

    return {
      success: true,
      filename,
      filepath,
      url: `/reports/${filename}`,
    };
  } catch (error) {
    logger.error(`Erro ao gerar relatório Excel: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Gerar relatório de coletas
const generateCollectionReport = async (data, format = 'pdf') => {
  const { collections, period, summary } = data;

  if (format === 'pdf') {
    return await generatePDFReport(data, {
      title: 'Relatório de Coletas',
      subtitle: 'Sistema de Coleta Verde - Itacoatiara-AM',
      period,
      sections: [
        {
          title: 'Resumo Geral',
          type: 'stats',
          content: [
            { label: 'Total de Coletas', value: summary.totalCollections },
            { label: 'Peso Coletado (kg)', value: summary.totalWeight },
            { label: 'Distância (km)', value: summary.totalDistance.toFixed(2) },
            { label: 'Coletores Ativos', value: summary.activeCollectors },
          ],
        },
        {
          title: 'Detalhes das Coletas',
          type: 'table',
          content: {
            headers: ['Data', 'Endereço', 'Tipo', 'Peso (kg)', 'Coletor'],
            rows: collections.map(c => [
              new Date(c.date).toLocaleDateString('pt-BR'),
              `${c.address.street}, ${c.address.number}`,
              c.wasteType,
              c.weight,
              c.collectorName,
            ]),
          },
        },
      ],
    });
  } else {
    return await generateExcelReport(data, {
      title: 'Relatório de Coletas',
      sheets: [
        {
          name: 'Resumo',
          headers: ['Métrica', 'Valor'],
          data: [
            ['Total de Coletas', summary.totalCollections],
            ['Peso Coletado (kg)', summary.totalWeight],
            ['Distância Percorrida (km)', summary.totalDistance.toFixed(2)],
            ['Coletores Ativos', summary.activeCollectors],
          ],
        },
        {
          name: 'Coletas',
          headers: ['Data', 'Endereço', 'Bairro', 'Tipo', 'Peso (kg)', 'Coletor', 'Status'],
          data: collections.map(c => [
            new Date(c.date).toLocaleDateString('pt-BR'),
            `${c.address.street}, ${c.address.number}`,
            c.address.neighborhood,
            c.wasteType,
            c.weight,
            c.collectorName,
            c.status,
          ]),
        },
      ],
    });
  }
};

// Gerar relatório de desempenho de coletores
const generateCollectorPerformanceReport = async (data, format = 'pdf') => {
  const { collectors, period } = data;

  if (format === 'pdf') {
    return await generatePDFReport(data, {
      title: 'Relatório de Desempenho dos Coletores',
      subtitle: 'Sistema de Coleta Verde - Itacoatiara-AM',
      period,
      sections: [
        {
          title: 'Ranking de Coletores',
          type: 'table',
          content: {
            headers: ['Posição', 'Nome', 'Coletas', 'Peso (kg)', 'Distância (km)', 'Avaliação'],
            rows: collectors.map((c, i) => [
              i + 1,
              c.name,
              c.totalCollections,
              c.totalWeight,
              c.totalDistance.toFixed(2),
              c.rating.toFixed(1),
            ]),
          },
        },
      ],
    });
  } else {
    return await generateExcelReport(data, {
      title: 'Desempenho dos Coletores',
      sheets: [
        {
          name: 'Ranking',
          headers: ['Posição', 'Nome', 'Coletas', 'Peso (kg)', 'Distância (km)', 'Avaliação', 'Eficiência'],
          data: collectors.map((c, i) => [
            i + 1,
            c.name,
            c.totalCollections,
            c.totalWeight,
            c.totalDistance.toFixed(2),
            c.rating.toFixed(1),
            c.efficiency || 'N/A',
          ]),
        },
      ],
    });
  }
};

// Gerar relatório de impacto ambiental
const generateEnvironmentalImpactReport = async (data, format = 'pdf') => {
  const { impact, period } = data;

  if (format === 'pdf') {
    return await generatePDFReport(data, {
      title: 'Relatório de Impacto Ambiental',
      subtitle: 'Sistema de Coleta Verde - Itacoatiara-AM',
      period,
      sections: [
        {
          title: 'Impacto Ambiental',
          type: 'stats',
          content: [
            { label: 'Lixo Reciclado (kg)', value: impact.totalRecycled },
            { label: 'CO₂ Evitado (kg)', value: impact.co2Avoided },
            { label: 'Árvores Salvas', value: impact.treesSaved },
            { label: 'Energia Economizada (kWh)', value: impact.energySaved },
          ],
        },
        {
          title: 'Benefícios Ambientais',
          type: 'list',
          content: [
            `${impact.totalRecycled} kg de resíduos verdes foram coletados e destinados corretamente`,
            `Evitou-se a emissão de aproximadamente ${impact.co2Avoided} kg de CO₂`,
            `Equivalente a plantar ${impact.treesSaved} árvores`,
            `Economia de ${impact.energySaved} kWh de energia`,
            `Redução de ${impact.landfillReduction}% no envio para aterros`,
          ],
        },
      ],
    });
  } else {
    return await generateExcelReport(data, {
      title: 'Impacto Ambiental',
      sheets: [
        {
          name: 'Impacto',
          headers: ['Métrica', 'Valor', 'Unidade'],
          data: [
            ['Lixo Reciclado', impact.totalRecycled, 'kg'],
            ['CO₂ Evitado', impact.co2Avoided, 'kg'],
            ['Árvores Salvas', impact.treesSaved, 'unidades'],
            ['Energia Economizada', impact.energySaved, 'kWh'],
            ['Redução Aterro', impact.landfillReduction, '%'],
          ],
        },
      ],
    });
  }
};

// Limpar relatórios antigos (mais de 30 dias)
const cleanOldReports = async () => {
  try {
    const files = await fs.readdir(REPORTS_DIR);
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filepath = path.join(REPORTS_DIR, file);
      const stats = await fs.stat(filepath);
      
      if (now - stats.mtimeMs > thirtyDays) {
        await fs.unlink(filepath);
        logger.info(`Relatório antigo removido: ${file}`);
      }
    }
  } catch (error) {
    logger.error(`Erro ao limpar relatórios antigos: ${error.message}`);
  }
};

module.exports = {
  generatePDFReport,
  generateExcelReport,
  generateCollectionReport,
  generateCollectorPerformanceReport,
  generateEnvironmentalImpactReport,
  cleanOldReports,
  REPORTS_DIR,
};

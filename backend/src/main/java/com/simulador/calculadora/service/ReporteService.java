package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Consumo;
import com.simulador.calculadora.model.SimulacionConsumo;
import com.google.common.base.Preconditions;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/** Servicio para generar reportes en Excel usando Apache POI. */
@Service
public class ReporteService {

    private static final Logger log = LoggerFactory.getLogger(ReporteService.class);

    /**
     * Genera un reporte Excel con el historial de consumos.
     * @param consumos lista de consumos a exportar
     * @return arreglo de bytes del archivo Excel generado
     */
    public byte[] exportarConsumosAExcel(List<Consumo> consumos) {
        Preconditions.checkNotNull(consumos, "La lista de consumos no puede ser nula");
        log.info("Exportando {} registros de consumo a Excel", consumos.size());

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Consumos");

            Row headerRow = sheet.createRow(0);
            String[] columnas = {"ID", "Cliente", "kWh Total", "Costo Total", "Huella CO2", "Fecha"};
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(crearEstiloHeader(workbook));
            }

            int rowNum = 1;
            for (Consumo c : consumos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(c.getIdConsumo());
                row.createCell(1).setCellValue(c.getCliente() != null ? c.getCliente().getNombre() : "N/A");
                row.createCell(2).setCellValue(c.getTotalKwh() != null ? c.getTotalKwh() : 0);
                row.createCell(3).setCellValue(c.getCostoTotal() != null ? c.getCostoTotal() : 0);
                row.createCell(4).setCellValue(c.getHuellaCarbono() != null ? c.getHuellaCarbono() : 0);
                row.createCell(5).setCellValue(c.getFecha() != null ? c.getFecha().toString() : "");
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Error al generar reporte Excel de consumos", e);
            throw new RuntimeException("Error al generar reporte Excel", e);
        }
    }

    /**
     * Genera un reporte Excel con el historial de simulaciones.
     * @param simulaciones lista de simulaciones a exportar
     * @return arreglo de bytes del archivo Excel generado
     */
    public byte[] exportarSimulacionesAExcel(List<SimulacionConsumo> simulaciones) {
        Preconditions.checkNotNull(simulaciones, "La lista de simulaciones no puede ser nula");
        log.info("Exportando {} simulaciones a Excel", simulaciones.size());

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Simulaciones");

            Row headerRow = sheet.createRow(0);
            String[] columnas = {"ID", "Tipo Persona", "Tipo Medidor", "Carga kW", "Energía kWh",
                    "Costo S/.", "CO2 kg", "Fecha Registro"};
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(crearEstiloHeader(workbook));
            }

            int rowNum = 1;
            for (SimulacionConsumo s : simulaciones) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(s.getId());
                row.createCell(1).setCellValue(s.getTipoPersona());
                row.createCell(2).setCellValue(s.getTipoMedidor());
                row.createCell(3).setCellValue(s.getCargaKw());
                row.createCell(4).setCellValue(s.getEnergiaKwh());
                row.createCell(5).setCellValue(s.getCostoSoles());
                row.createCell(6).setCellValue(s.getCo2Kg());
                row.createCell(7).setCellValue(s.getFechaRegistro() != null ? s.getFechaRegistro().toString() : "");
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Error al generar reporte Excel de simulaciones", e);
            throw new RuntimeException("Error al generar reporte Excel", e);
        }
    }

    private CellStyle crearEstiloHeader(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }
}

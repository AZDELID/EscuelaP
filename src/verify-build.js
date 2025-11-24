#!/usr/bin/env node

/**
 * Script de Verificación de Build
 * Verifica que el build esté correctamente optimizado para GitHub Pages
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const DIST_DIR = './dist';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let errors = 0;
let warnings = 0;
let checks = 0;

function log(message, type = 'info') {
  checks++;
  const prefix = type === 'error' ? `${RED}✗${RESET}` : 
                 type === 'warning' ? `${YELLOW}⚠${RESET}` : 
                 `${GREEN}✓${RESET}`;
  console.log(`${prefix} ${message}`);
  
  if (type === 'error') errors++;
  if (type === 'warning') warnings++;
}

function checkFileExists(file, description) {
  const path = join(DIST_DIR, file);
  if (existsSync(path)) {
    log(`${description} existe: ${file}`, 'success');
    return true;
  } else {
    log(`${description} NO encontrado: ${file}`, 'error');
    return false;
  }
}

function checkDirectoryExists(dir, description) {
  const path = join(DIST_DIR, dir);
  if (existsSync(path)) {
    const files = readdirSync(path);
    log(`${description} existe con ${files.length} archivo(s)`, 'success');
    return true;
  } else {
    log(`${description} NO encontrado: ${dir}`, 'error');
    return false;
  }
}

function checkRelativePaths() {
  const indexPath = join(DIST_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    log('index.html no existe, no se puede verificar paths', 'error');
    return;
  }
  
  const content = readFileSync(indexPath, 'utf-8');
  
  // Verificar rutas absolutas (no deberían existir)
  if (content.includes('src="/'  || content.includes('href="/'))) {
    const absolutePaths = content.match(/(?:src|href)="\/[^"]+"/g) || [];
    if (absolutePaths.some(p => !p.includes('http'))) {
      log('ADVERTENCIA: Se encontraron rutas absolutas en index.html', 'warning');
      console.log('  Rutas encontradas:', absolutePaths.slice(0, 3).join(', '));
    }
  }
  
  // Verificar rutas relativas
  const relativePaths = content.match(/(?:src|href)="\.\/[^"]+"/g) || [];
  if (relativePaths.length > 0) {
    log(`Rutas relativas correctas encontradas: ${relativePaths.length}`, 'success');
  } else {
    log('No se encontraron rutas relativas (./)' , 'warning');
  }
}

function checkFileSize(file, maxSizeKB, description) {
  const path = join(DIST_DIR, file);
  if (!existsSync(path)) return;
  
  const stats = statSync(path);
  const sizeKB = stats.size / 1024;
  
  if (sizeKB > maxSizeKB) {
    log(`${description} es muy grande: ${sizeKB.toFixed(2)}KB (máx: ${maxSizeKB}KB)`, 'warning');
  } else {
    log(`${description} tamaño OK: ${sizeKB.toFixed(2)}KB`, 'success');
  }
}

function checkTotalSize() {
  if (!existsSync(DIST_DIR)) return;
  
  let totalSize = 0;
  
  function getDirectorySize(dir) {
    const files = readdirSync(dir);
    files.forEach(file => {
      const filePath = join(dir, file);
      const stats = statSync(filePath);
      if (stats.isDirectory()) {
        getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  }
  
  getDirectorySize(DIST_DIR);
  const totalMB = totalSize / (1024 * 1024);
  
  if (totalMB > 5) {
    log(`Tamaño total del build: ${totalMB.toFixed(2)}MB (considera optimizar)`, 'warning');
  } else {
    log(`Tamaño total del build: ${totalMB.toFixed(2)}MB`, 'success');
  }
}

console.log('\n🔍 Verificando Build para GitHub Pages...\n');

// Verificar que /dist existe
if (!existsSync(DIST_DIR)) {
  console.log(`${RED}✗ Directorio /dist no existe. Ejecuta: npm run build${RESET}\n`);
  process.exit(1);
}

// Archivos esenciales
console.log('📄 Archivos Esenciales:');
checkFileExists('index.html', 'index.html');
checkFileExists('favicon.svg', 'Favicon');
checkFileExists('manifest.json', 'Manifest PWA');
checkFileExists('robots.txt', 'robots.txt');
checkFileExists('sitemap.xml', 'sitemap.xml');
checkFileExists('404.html', '404.html (SPA routing)');

// Estructura de directorios
console.log('\n📁 Estructura de Assets:');
checkDirectoryExists('assets', 'Carpeta assets');
checkDirectoryExists('assets/css', 'CSS');
checkDirectoryExists('assets/js', 'JavaScript');

// Verificar rutas relativas
console.log('\n🔗 Verificando Rutas:');
checkRelativePaths();

// Verificar tamaños
console.log('\n📊 Tamaños de Archivos:');
checkFileSize('index.html', 10, 'index.html');

// Buscar archivos CSS
const assetsPath = join(DIST_DIR, 'assets/css');
if (existsSync(assetsPath)) {
  const cssFiles = readdirSync(assetsPath).filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    checkFileSize(join('assets/css', cssFiles[0]), 100, 'CSS principal');
  }
}

// Buscar archivos JS
const jsPath = join(DIST_DIR, 'assets/js');
if (existsSync(jsPath)) {
  const jsFiles = readdirSync(jsPath).filter(f => f.endsWith('.js'));
  jsFiles.forEach(file => {
    checkFileSize(join('assets/js', file), 300, `JS: ${file.split('-')[0]}`);
  });
}

// Tamaño total
console.log('\n💾 Tamaño Total:');
checkTotalSize();

// Resumen
console.log('\n' + '='.repeat(50));
console.log(`📋 Resumen de Verificación:`);
console.log(`   ${GREEN}✓${RESET} Checks exitosos: ${checks - errors - warnings}`);
if (warnings > 0) {
  console.log(`   ${YELLOW}⚠${RESET} Advertencias: ${warnings}`);
}
if (errors > 0) {
  console.log(`   ${RED}✗${RESET} Errores: ${errors}`);
}
console.log('='.repeat(50) + '\n');

// Recomendaciones
if (errors === 0 && warnings === 0) {
  console.log(`${GREEN}🎉 ¡Build perfecto! Listo para GitHub Pages${RESET}\n`);
  console.log('Próximos pasos:');
  console.log('  1. git add .');
  console.log('  2. git commit -m "Deploy to GitHub Pages"');
  console.log('  3. git push origin main\n');
} else if (errors === 0) {
  console.log(`${YELLOW}⚠ Build OK con advertencias. Puedes deployar, pero considera optimizar.${RESET}\n`);
} else {
  console.log(`${RED}✗ Build tiene errores. Revisa y corrige antes de deployar.${RESET}\n`);
  process.exit(1);
}

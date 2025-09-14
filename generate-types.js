#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ADMIN_DIR = './admin/src';
const OUTPUT_FILE = './site/src/strapi.generated.ts';

// Helper function to convert Strapi field types to TypeScript types
function strapiToTSType(fieldType, field) {
  switch (fieldType) {
    case 'string':
    case 'text':
    case 'richtext':
    case 'email':
    case 'password':
    case 'uid':
      return 'string';
    case 'integer':
    case 'biginteger':
    case 'decimal':
    case 'float':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
    case 'datetime':
    case 'time':
      return 'string'; // Usually ISO string from Strapi API
    case 'json':
      return 'unknown';
    case 'enumeration':
      return field.enum ? `'${field.enum.join("' | '")}'` : 'string';
    case 'media':
      return field.multiple ? 'StrapiMedia[]' : 'StrapiMedia | null';
    case 'relation':
      return 'unknown'; // Relations are complex, keep as unknown for now
    case 'component':
      if (field.component) {
        const componentName = field.component.replace('.', '');
        const namespace = field.component.split('.')[0];
        const component = field.component.split('.')[1];
        return field.repeatable
          ? `Strapi.Components.${capitalize(namespace)}.${capitalize(toPascalCase(component))}[]`
          : `Strapi.Components.${capitalize(namespace)}.${capitalize(toPascalCase(component))} | null`;
      }
      return 'unknown';
    case 'dynamiczone':
      return 'unknown[]';
    default:
      return 'unknown';
  }
}

// Helper function to capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to pascal case conversion
function toPascalCase(str) {
  return str.split('-').map(capitalize).join('');
}

// Function to generate interfaces for components
function generateComponentInterfaces() {
  const componentsDir = path.join(ADMIN_DIR, 'components');
  const interfaces = [];
  const namespaces = new Set();

  if (!fs.existsSync(componentsDir)) {
    return { interfaces: [], namespaces: [] };
  }

  const componentDirs = fs.readdirSync(componentsDir);

  componentDirs.forEach(namespace => {
    const namespacePath = path.join(componentsDir, namespace);
    if (!fs.statSync(namespacePath).isDirectory()) return;

    namespaces.add(namespace);
    const componentFiles = fs.readdirSync(namespacePath).filter(f => f.endsWith('.json'));

    componentFiles.forEach(file => {
      const componentPath = path.join(namespacePath, file);
      const componentSchema = JSON.parse(fs.readFileSync(componentPath, 'utf8'));
      const componentName = path.basename(file, '.json');

      const attributes = Object.entries(componentSchema.attributes || {})
        .map(([key, field]) => {
          const type = strapiToTSType(field.type, field);
          const optional = field.required ? '' : '?';
          return `    ${key}${optional}: ${type};`;
        })
        .join('\n');

      interfaces.push({
        namespace: capitalize(namespace),
        name: capitalize(toPascalCase(componentName)),
        definition: `  export interface ${capitalize(toPascalCase(componentName))} {\n${attributes}\n  }`
      });
    });
  });

  return { interfaces, namespaces: Array.from(namespaces) };
}

// Function to generate interfaces for content types
function generateContentTypeInterfaces() {
  const apiDir = path.join(ADMIN_DIR, 'api');
  const interfaces = [];

  if (!fs.existsSync(apiDir)) {
    return interfaces;
  }

  const contentTypeDirs = fs.readdirSync(apiDir);

  contentTypeDirs.forEach(contentType => {
    const schemaPath = path.join(apiDir, contentType, 'content-types', contentType, 'schema.json');

    if (!fs.existsSync(schemaPath)) return;

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const name = capitalize(toPascalCase(contentType));

    // Generate base attributes
    const attributes = Object.entries(schema.attributes || {})
      .map(([key, field]) => {
        const type = strapiToTSType(field.type, field);
        const optional = field.required ? '' : '?';
        return `    ${key}${optional}: ${type};`;
      })
      .join('\n');

    // Add standard Strapi fields
    const strapiFields = [
      '    id: number;',
      '    documentId: string;',
      '    createdAt: string;',
      '    updatedAt: string;',
      '    publishedAt?: string;',
      '    locale?: string;'
    ].join('\n');

    const definition = `  export interface ${name} {\n${strapiFields}\n${attributes}\n  }`;

    interfaces.push({ name, definition });
  });

  return interfaces;
}

// Generate the complete TypeScript file
function generateTypeScript() {
  console.log('🔄 Generating Strapi types...');

  const { interfaces: componentInterfaces, namespaces } = generateComponentInterfaces();
  const contentTypeInterfaces = generateContentTypeInterfaces();

  let output = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toISOString()}
/* eslint-disable @typescript-eslint/no-namespace */

export namespace Strapi {
  // Base Strapi media type
  export interface StrapiMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: unknown;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: unknown;
    createdAt: string;
    updatedAt: string;
  }

`;

  // Add component interfaces
  if (componentInterfaces.length > 0) {
    output += `  export namespace Components {\n`;

    namespaces.forEach(namespace => {
      const namespaceInterfaces = componentInterfaces.filter(comp => comp.namespace === capitalize(namespace));
      if (namespaceInterfaces.length > 0) {
        output += `    export namespace ${capitalize(namespace)} {\n`;
        namespaceInterfaces.forEach(comp => {
          output += `${comp.definition}\n`;
        });
        output += `    }\n\n`;
      }
    });

    output += `  }\n\n`;
  }

  // Add content type interfaces
  if (contentTypeInterfaces.length > 0) {
    output += `  export namespace ContentTypes {\n`;
    contentTypeInterfaces.forEach(contentType => {
      output += `${contentType.definition}\n\n`;
    });
    output += `  }\n`;
  }

  output += `}\n`;

  return output;
}

// Main execution
function main() {
  try {
    const typeScript = generateTypeScript();

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(OUTPUT_FILE, typeScript);

    console.log('✅ Strapi types generated successfully!');
    console.log(`📁 Output: ${OUTPUT_FILE}`);

    // Show what was generated
    const { interfaces: componentInterfaces } = generateComponentInterfaces();
    const contentTypeInterfaces = generateContentTypeInterfaces();

    if (contentTypeInterfaces.length > 0) {
      console.log(`🏷️  Content Types: ${contentTypeInterfaces.map(ct => ct.name).join(', ')}`);
    }

    if (componentInterfaces.length > 0) {
      const componentNames = componentInterfaces.map(comp => `${comp.namespace}.${comp.name}`);
      console.log(`🧩 Components: ${componentNames.join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Error generating types:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
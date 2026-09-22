// Rich Database Schema Metadata & DBML Parser Engine for SchemaStudio

export const sampleEcommerceSchema = {
  connectionInfo: {
    database: "ECOMMERCE_PROD_DB",
    status: "CONNECTED",
    version: "PostgreSQL 16.2",
    tablesCount: 5,
    rowsCount: 156400,
    healthScore: 82,
    lastAuditTime: "2026-09-22 22:45:00 UTC"
  },
  tables: [
    {
      name: "customers",
      type: "BASE TABLE",
      rows: 12450,
      description: "Stores customer accounts, authentication credentials, and status.",
      health: "HEALTHY",
      columns: [
        { name: "id", type: "uuid", isPk: true, isFk: false, nullable: false, defaultVal: "gen_random_uuid()", description: "Primary Key" },
        { name: "email", type: "varchar", isPk: false, isFk: false, nullable: false, defaultVal: "NULL", description: "Unique customer email" },
        { name: "full_name", type: "varchar", isPk: false, isFk: false, nullable: false, defaultVal: "NULL", description: "Customer legal name" },
        { name: "role", type: "varchar", isPk: false, isFk: false, nullable: false, defaultVal: "'CUSTOMER'", description: "Access role: CUSTOMER or ADMIN" },
        { name: "created_at", type: "timestamp", isPk: false, isFk: false, nullable: false, defaultVal: "NOW()", description: "Account registration timestamp" }
      ]
    },
    {
      name: "categories",
      type: "BASE TABLE",
      rows: 120,
      description: "Product taxonomy and hierarchy mapping.",
      health: "HEALTHY",
      columns: [
        { name: "id", type: "uuid", isPk: true, isFk: false, nullable: false, defaultVal: "gen_random_uuid()", description: "Category Primary Key" },
        { name: "name", type: "varchar", isPk: false, isFk: false, nullable: false, defaultVal: "NULL", description: "Display category name" },
        { name: "slug", type: "varchar", isPk: false, isFk: false, nullable: false, defaultVal: "NULL", description: "URL-friendly slug" }
      ]
    },
    {
      name: "products",
      type: "BASE TABLE",
      rows: 3400,
      description: "Catalog item records, pricing, and current stock inventory.",
      health: "WARNING",
      columns: [
        { name: "id", type: "uuid", isPk: true, isFk: false, nullable: false, defaultVal: "gen_random_uuid()", description: "Product Primary Key" },
        { name: "title", type: "varchar", isPk: false, isFk: false, nullable: false, defaultVal: "NULL", description: "Product title" },
        { name: "category_id", type: "uuid", isPk: false, isFk: true, fkTarget: "categories.id", nullable: false, defaultVal: "NULL", description: "Foreign key referencing categories" },
        { name: "price", type: "numeric", isPk: false, isFk: false, nullable: false, defaultVal: "0.00", description: "Item retail price" },
        { name: "stock_qty", type: "integer", isPk: false, isFk: false, nullable: false, defaultVal: "0", description: "Current inventory stock" }
      ]
    },
    {
      name: "orders",
      type: "BASE TABLE",
      rows: 45200,
      description: "Transaction order records placed by customers.",
      health: "HEALTHY",
      columns: [
        { name: "id", type: "uuid", isPk: true, isFk: false, nullable: false, defaultVal: "gen_random_uuid()", description: "Order Primary Key" },
        { name: "customer_id", type: "uuid", isPk: false, isFk: true, fkTarget: "customers.id", nullable: false, defaultVal: "NULL", description: "Foreign key referencing customers" },
        { name: "total_amount", type: "numeric", isPk: false, isFk: false, nullable: false, defaultVal: "0.00", description: "Total order cost in USD" },
        { name: "status", type: "varchar", isPk: false, isFk: false, nullable: false, defaultVal: "'PENDING'", description: "Order state: PENDING, PAID, SHIPPED" },
        { name: "created_at", type: "timestamp", isPk: false, isFk: false, nullable: false, defaultVal: "NOW()", description: "Timestamp order was placed" }
      ]
    },
    {
      name: "order_items",
      type: "BASE TABLE",
      rows: 98400,
      description: "Line-item breakdown connecting orders with products.",
      health: "RISKY",
      columns: [
        { name: "id", type: "uuid", isPk: true, isFk: false, nullable: false, defaultVal: "gen_random_uuid()", description: "Line item Primary Key" },
        { name: "order_id", type: "uuid", isPk: false, isFk: true, fkTarget: "orders.id", nullable: false, defaultVal: "NULL", description: "Unindexed Foreign Key" },
        { name: "product_id", type: "uuid", isPk: false, isFk: true, fkTarget: "products.id", nullable: false, defaultVal: "NULL", description: "Foreign Key to product catalog" },
        { name: "quantity", type: "integer", isPk: false, isFk: false, nullable: false, defaultVal: "1", description: "Units purchased" },
        { name: "unit_price", type: "numeric", isPk: false, isFk: false, nullable: false, defaultVal: "0.00", description: "Unit price at purchase time" }
      ]
    }
  ]
};

// Generate DBML Syntax String from Schema Object
export function generateDbmlText(schema) {
  let dbml = `// SchemaStudio DBML Specification\n\n`;
  schema.tables.forEach((table) => {
    dbml += `Table ${table.name} {\n`;
    table.columns.forEach((col) => {
      const pkAttr = col.isPk ? ' [primary key]' : '';
      dbml += `  ${col.name} ${col.type}${pkAttr}\n`;
    });
    dbml += `}\n\n`;
  });

  schema.tables.forEach((table) => {
    table.columns.forEach((col) => {
      if (col.isFk && col.fkTarget) {
        dbml += `Ref: ${table.name}.${col.name} > ${col.fkTarget}\n`;
      }
    });
  });

  return dbml;
}

// Converts Schema JSON into Rich Custom React Flow Nodes and Edges
export function parseSchemaToGraph(schema) {
  const nodes = [];
  const edges = [];

  const layoutPositions = [
    { x: 50, y: 80 },    // customers
    { x: 380, y: 80 },   // orders
    { x: 710, y: 80 },   // order_items
    { x: 710, y: 380 },  // products
    { x: 380, y: 380 }   // categories
  ];

  schema.tables.forEach((table, idx) => {
    const pos = layoutPositions[idx % layoutPositions.length] || { x: 50 + idx * 300, y: 100 };

    nodes.push({
      id: table.name,
      type: 'tableNode',
      position: pos,
      data: {
        name: table.name,
        type: table.type,
        rows: table.rows,
        health: table.health,
        columns: table.columns
      }
    });

    table.columns.forEach((column) => {
      if (column.isFk && column.fkTarget) {
        const [targetTable] = column.fkTarget.split('.');
        edges.push({
          id: `e-${table.name}-${column.name}-${targetTable}`,
          source: table.name,
          target: targetTable,
          animated: false,
          type: 'smoothstep',
          style: { stroke: '#8B9CFF', strokeWidth: 1.8 },
          label: `1 : *`,
          labelStyle: { fill: '#8FE3C0', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' },
          labelBgStyle: { fill: '#0D111C', rx: 4, ry: 4 }
        });
      }
    });
  });

  return { nodes, edges };
}

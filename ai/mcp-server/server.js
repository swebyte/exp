import cors from "cors";
import express from "express";
import pg from "pg";

const { Pool } = pg;

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  server: {
    port: parseInt(process.env.PORT || "3001"),
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "admin",
    // password: process.env.DB_PASSWORD,
    password: "kW7xMCzhLm7yH3wo",
    database: process.env.DB_NAME || "blogdb",
    max: 10,
    idleTimeoutMillis: 30000,
  },
  ollama: {
    url: process.env.OLLAMA_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "tinyllama",
  },
};

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

const pool = new Pool(CONFIG.database);

// Test database connection on startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection error:", err);
  } else {
    console.log("✅ Database connected successfully");
  }
});

// ============================================================================
// AI / OLLAMA FUNCTIONS
// ============================================================================

/**
 * Call Ollama API with a prompt and get AI response
 * @param {string} prompt - The prompt to send to the AI model
 * @returns {Promise<string>} - AI generated response
 */
async function callOllama(prompt) {
  try {
    const response = await fetch(`${CONFIG.ollama.url}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CONFIG.ollama.model,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Ollama error:", error);
    throw new Error(`Error calling AI model: ${error.message}`);
  }
}

/**
 * Get database schema context for AI prompts
 * @returns {Promise<string>} - Formatted schema description
 */
async function getSchemaContext() {
  const result = await pool.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'api'
    ORDER BY table_name, ordinal_position;
  `);

  const schemaByTable = result.rows.reduce((acc, row) => {
    if (!acc[row.table_name]) acc[row.table_name] = [];
    acc[row.table_name].push(`${row.column_name} (${row.data_type})`);
    return acc;
  }, {});

  return Object.entries(schemaByTable)
    .map(([table, cols]) => `Table ${table}: ${cols.join(", ")}`)
    .join("\n");
}

// ============================================================================
// DATABASE QUERY FUNCTIONS
// ============================================================================

// /**
//  * Execute a safe SELECT query
//  * @param {string} query - SQL query to execute
//  * @returns {Promise<Array>} - Query results
//  */
// async function executeSafeQuery(query) {
//   if (!query.trim().toLowerCase().startsWith("select")) {
//     throw new Error("Only SELECT queries are allowed for safety");
//   }
//   const result = await pool.query(query);
//   return result.rows;
// }

// /**
//  * Get database schema information
//  * @param {string} schemaName - Schema name (default: 'api')
//  * @returns {Promise<Object>} - Schema organized by table
//  */
// async function getDatabaseSchema(schemaName = "api") {
//   const result = await pool.query(
//     `SELECT table_name, column_name, data_type, is_nullable
//      FROM information_schema.columns
//      WHERE table_schema = $1
//      ORDER BY table_name, ordinal_position`,
//     [schemaName]
//   );

//   const schema = {};
//   result.rows.forEach((row) => {
//     if (!schema[row.table_name]) {
//       schema[row.table_name] = [];
//     }
//     schema[row.table_name].push({
//       column: row.column_name,
//       type: row.data_type,
//       nullable: row.is_nullable === "YES",
//     });
//   });

//   return schema;
// }

// /**
//  * List blog posts from the database
//  * @param {number} limit - Maximum number of posts to return
//  * @returns {Promise<Array>} - Array of blog posts
//  */
// async function listBlogPosts(limit = 10) {
//   const result = await pool.query(
//     `SELECT id, title, body, published, created_at, user_id
//      FROM api.blog
//      ORDER BY created_at DESC
//      LIMIT $1`,
//     [limit]
//   );
//   return result.rows;
// }

// /**
//  * Get a single blog post by ID
//  * @param {number} id - Blog post ID
//  * @returns {Promise<Object|null>} - Blog post object or null
//  */
// async function getBlogPostById(id) {
//   const result = await pool.query(
//     `SELECT id, title, body, published, created_at, user_id
//      FROM api.blog
//      WHERE id = $1`,
//     [id]
//   );
//   return result.rows[0] || null;
// }

// /**
//  * List experience entries from the database
//  * @param {number} limit - Maximum number of entries to return
//  * @returns {Promise<Array>} - Array of experience entries
//  */
// async function listExperience(limit = 10) {
//   const result = await pool.query(
//     `SELECT id, title, company, description, start_date, end_date, created_at, user_id
//      FROM api.experience
//      ORDER BY start_date DESC
//      LIMIT $1`,
//     [limit]
//   );
//   return result.rows;
// }

// /**
//  * Get a single experience entry by ID
//  * @param {number} id - Experience entry ID
//  * @returns {Promise<Object|null>} - Experience entry object or null
//  */
// async function getExperienceById(id) {
//   const result = await pool.query(
//     `SELECT id, title, company, description, start_date, end_date, created_at, user_id
//      FROM api.experience
//      WHERE id = $1`,
//     [id]
//   );
//   return result.rows[0] || null;
// }

// /**
//  * List users from the database
//  * @returns {Promise<Array>} - Array of users (without passwords)
//  */
// async function listUsers() {
//   const result = await pool.query(
//     `SELECT id, email, role, created_at
//      FROM api.users
//      ORDER BY created_at DESC`
//   );
//   return result.rows;
// }

// ============================================================================
// EXPRESS APP SETUP
// ============================================================================

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// API ROUTES
// ============================================================================

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "connected",
    ollama: CONFIG.ollama.url,
    model: CONFIG.ollama.model,
  });
});

// // Get database schema
// app.get("/api/schema", async (req, res) => {
//   try {
//     const schemaName = req.query.schema || "api";
//     const schema = await getDatabaseSchema(schemaName);
//     res.json({ success: true, data: schema });
//   } catch (error) {
//     console.error("Error getting schema:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Execute custom query
// app.post("/api/query", async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Query is required" });
//     }

//     const results = await executeSafeQuery(query);
//     res.json({ success: true, data: results });
//   } catch (error) {
//     console.error("Error executing query:", error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// });

// // List blog posts
// app.get("/api/blog", async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const posts = await listBlogPosts(limit);
//     res.json({ success: true, data: posts });
//   } catch (error) {
//     console.error("Error listing blog posts:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get single blog post
// app.get("/api/blog/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const post = await getBlogPostById(id);

//     if (!post) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Blog post not found" });
//     }

//     res.json({ success: true, data: post });
//   } catch (error) {
//     console.error("Error getting blog post:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // List experience entries
// app.get("/api/experience", async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const experience = await listExperience(limit);
//     res.json({ success: true, data: experience });
//   } catch (error) {
//     console.error("Error listing experience:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get single experience entry
// app.get("/api/experience/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const entry = await getExperienceById(id);

//     if (!entry) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Experience entry not found" });
//     }

//     res.json({ success: true, data: entry });
//   } catch (error) {
//     console.error("Error getting experience entry:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // List users
// app.get("/api/users", async (req, res) => {
//   try {
//     const users = await listUsers();
//     res.json({ success: true, data: users });
//   } catch (error) {
//     console.error("Error listing users:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// AI Chat endpoint - Ask questions about your data
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { question, includeSchema = true } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ success: false, error: "Question is required" });
    }

    // Get schema context if requested
    let prompt = "";
    if (includeSchema) {
      const schemaText = await getSchemaContext();
      prompt = `You are helpful, answeres very short with data. Given this database schema:

${schemaText}

User question: ${question}

Provide a brief, helpful answer. `;
    } else {
      prompt = question;
    }

    // Call Ollama
    const aiResponse = await callOllama(prompt);

    res.json({
      success: true,
      data: {
        question,
        answer: aiResponse,
        model: CONFIG.ollama.model,
      },
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI-enhanced data query - Ask questions and get data + AI explanation
// app.post("/api/ai/query-data", async (req, res) => {
//   try {
//     const { question } = req.body;

//     if (!question) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Question is required" });
//     }

//     // Get schema context
//     const schemaText = await getSchemaContext();

//     // Ask AI to generate SQL query
//     const sqlPrompt = `Given this database schema:

// ${schemaText}

// Generate a SQL query to answer this question: ${question}

// Return ONLY the SQL query, nothing else. Use the 'api' schema for table names.`;

//     const sqlQuery = await callOllama(sqlPrompt);

//     // Execute the query (if it's a SELECT)
//     let queryResults = null;
//     let queryError = null;

//     try {
//       if (sqlQuery.toLowerCase().trim().includes("select")) {
//         // Extract just the SQL query (remove markdown formatting if present)
//         const cleanQuery = sqlQuery
//           .replace(/```sql\n?/g, "")
//           .replace(/```\n?/g, "")
//           .trim();
//         queryResults = await executeSafeQuery(cleanQuery);
//       }
//     } catch (err) {
//       queryError = err.message;
//     }

//     // Get AI explanation of results
//     const explanationPrompt = `Question: ${question}
// SQL Query: ${sqlQuery}
// Results: ${
//       queryResults ? JSON.stringify(queryResults) : "Query error: " + queryError
//     }

// Provide a brief, natural language explanation of these results.`;

//     const explanation = await callOllama(explanationPrompt);

//     res.json({
//       success: true,
//       data: {
//         question,
//         sqlQuery,
//         results: queryResults,
//         queryError,
//         explanation,
//         model: CONFIG.ollama.model,
//       },
//     });
//   } catch (error) {
//     console.error("Error in AI query-data:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(CONFIG.server.port, () => {
  console.log("");
  console.log("🚀 AI Server with Ollama Integration");
  console.log("=====================================");
  console.log(`📡 Server running on: http://localhost:${CONFIG.server.port}`);
  console.log(
    `🗄️  Database: ${CONFIG.database.database}@${CONFIG.database.host}`
  );
  console.log(`🤖 AI Model: ${CONFIG.ollama.model} at ${CONFIG.ollama.url}`);
  console.log("");
  console.log("Available endpoints:");
  console.log("  GET  /health              - Health check");
  // console.log("  GET  /api/schema          - Get database schema");
  // console.log("  POST /api/query           - Execute SQL query");
  // console.log("  GET  /api/blog            - List blog posts");
  // console.log("  GET  /api/blog/:id        - Get blog post by ID");
  // console.log("  GET  /api/experience      - List experience entries");
  // console.log("  GET  /api/experience/:id  - Get experience by ID");
  // console.log("  GET  /api/users           - List users");
  console.log("  POST /api/ai/chat         - Chat with AI about your data");
  // console.log("  POST /api/ai/query-data   - AI generates query and explains");
  console.log("");
});

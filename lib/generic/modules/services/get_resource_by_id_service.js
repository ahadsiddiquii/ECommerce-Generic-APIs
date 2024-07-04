async function getResourceById(table_name, id, connection) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM " + table_name + " WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return null; // Resource not found
    }

    return rows[0]; // Return the first (and presumably only) row
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getResourceByCustomKey(table_name, key, value, connection) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM " + table_name + " WHERE " + key + " = ?",
      [value]
    );

    if (rows.length === 0) {
      return null; // Resource not found
    }

    return rows[0]; // Return the first (and presumably only) row
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = { getResourceById, getResourceByCustomKey };
